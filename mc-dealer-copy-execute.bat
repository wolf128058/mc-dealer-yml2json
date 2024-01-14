@ECHO OFF
setlocal enabledelayedexpansion

TITLE MCDealerCopieExecute

:: SETTINGS
:: Path to the main folder of the script
set "PYTHON_SCRIPT_PATH=scriptfolder"
:: Path to your Bukkit Server
set "SERVER_PATH=bukkitserver"
:: How often the data should be updated
set "UPDATETIME=60"
:: Modes are INTERNAL, FTP, SFTP and NONE
set "MODE=NONE"

:: PATH TO INTERNAL WEB SERVER
set "INTERNAL_PATH=internalwebserver"

:: FTP Settings
set "FTP_SERVER="
set "FTP_USERNAME="
set "FTP_PASSWORD="
set "FTP_REMOTE_DIR="

:: SFTP Settings
set "SFTP_SERVER="
set "SFTP_USERNAME="
set "SFTP_PASSWORD="
set "SFTP_REMOTE_DIR="

:: DO NOT CHANGE ANYTHING BELOW THIS POINT! UNLESS YOU KNOW WHAT YOU'RE DOING!

:: Python, Tar and Curl install script
set "PYTHON_VERSION=3.9.7"
set "PIP_VERSION=21.2.4"
set "CURL_VERSION=7.79.1"
set "CURL_URL=https://curl.se/windows/dl-ssl/curl-%CURL_VERSION%-win64-mingw.zip"
set "TAR_URL=https://sourceforge.net/projects/gnuwin32/files/tar/1.15.1-1/tar-1.15.1-1-bin.exe/download"

:: Check if tar is already installed
where tar >nul 2>nul
if !ERRORLEVEL! neq 0 (
    echo tar is not installed. Installing tar...
    curl -L -o tar-installer.exe %TAR_URL%
    tar-installer.exe /S
    del tar-installer.exe
) else (
    echo tar is already installed.
)

:: Check if curl is already installed
where curl >nul 2>nul
if !ERRORLEVEL! neq 0 (
    echo Curl is not installed. Installing curl...
    curl -L -o curl.zip %CURL_URL%
    unzip -o curl.zip -d "%ProgramFiles%\curl" -o
    del curl.zip
) else (
    echo Curl is already installed.
)

:: Check if python is already installed
python --version 2>nul | findstr /C:"Python" >nul
if !ERRORLEVEL! neq 0 (
    echo Python is not installed. Installing the latest Python version...
    curl -o python-installer.exe https://www.python.org/ftp/python/latest/python-latest-amd64.exe
    python-installer.exe /quiet PrependPath=1 Include_test=0 TargetDir=C:\Python\
    del python-installer.exe
)

set "PATH=%PATH%;C:\Python\Scripts"

echo Upgrading pip...
python -m pip install --upgrade pip

:: Install or upgrade dependencies
for %%P in (Pillow PyYAML requests nbtlib) do (
    pip install --upgrade %%P
)

echo Installation completed.

cd /d %~dp0

:: Check if required settings are present
if not defined PYTHON_SCRIPT_PATH (
    echo PYTHON_SCRIPT_PATH is not set in the SETTINGS.
    pause >nul
    exit /b 1
)

if not defined SERVER_PATH (
    echo SERVER_PATH is not set in the SETTINGS.
    pause >nul
    exit /b 1
)

if not defined UPDATETIME (
    echo UPDATETIME is not set in the SETTINGS.
    pause >nul
    exit /b 1
)

:: Additional checks for INTERNAL, FTP, and SFTP settings
if /i "%MODE%"=="INTERNAL" (
    if not defined INTERNAL_PATH (
        echo INTERNAL_PATH is not set in the SETTINGS.
        pause >nul
        exit /b 1
    )
) else if /i "%MODE%"=="FTP" (
    for %%F in (FTP_SERVER FTP_USERNAME FTP_PASSWORD FTP_REMOTE_DIR) do (
        if not defined %%F (
            echo %%F is not set in the SETTINGS.
            pause >nul
            exit /b 1
        )
    )
) else if /i "%MODE%"=="SFTP" (
    for %%S in (SFTP_SERVER SFTP_USERNAME SFTP_PASSWORD SFTP_REMOTE_DIR) do (
        if not defined %%S (
            echo %%S is not set in the SETTINGS.
            pause >nul
            exit /b 1
        )
    )
)

:: Copy and execution script starts here
:a
:: Deletes old Shop UUID.yaml files from the Data folder
del "%PYTHON_SCRIPT_PATH%\data\*.yml" >nul
echo Old data has been deleted
TIMEOUT /T 2 /nobreak >nul

:: Copies new Shop UUID.yaml files from Villagermarket to the Data folder
xcopy /s/y/i "%SERVER_PATH%\plugins\VillagerMarket\Shops" "%PYTHON_SCRIPT_PATH%\data" >nul
echo Data has been updated

:: The python script that is being executed
python "%PYTHON_SCRIPT_PATH%\data-yml2json.py"
echo Data has been converted

:: Transfer output.json either via FTP or SFTP or internally based on MODE
if /i "%MODE%"=="INTERNAL" (
    copy "%PYTHON_SCRIPT_PATH%\output.json" "%INTERNAL_PATH%"
    echo Data has been transferred internally
) else (
    if /i "%MODE%"=="FTP" (
        echo user %FTP_USERNAME%> ftpcmd.dat
        echo %FTP_PASSWORD%>> ftpcmd.dat
        echo bin>> ftpcmd.dat
        echo put "%PYTHON_SCRIPT_PATH%\output.json" "%FTP_REMOTE_DIR%" >> ftpcmd.dat
        echo quit>> ftpcmd.dat
        ftp -n -s:ftpcmd.dat %FTP_SERVER%
        del ftpcmd.dat
        echo Data has been transferred via FTP
    ) else (
        if /i "%MODE%"=="SFTP" (
            echo put "%PYTHON_SCRIPT_PATH%\output.json" "%SFTP_REMOTE_DIR%" | psftp -l %SFTP_USERNAME% -pw %SFTP_PASSWORD% %SFTP_SERVER%
            echo Data has been transferred via SFTP
        ) else (
            echo Data has been stored in the script folder
        )
    )
)

TIMEOUT /T %UPDATETIME% /nobreak >nul

:: Repeat the script
GOTO a
