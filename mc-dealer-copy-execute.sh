#!/bin/bash

# SETTINGS
# Path to the main folder of the script
PYTHON_SCRIPT_PATH="scriptfolder"
# Path to your Bukkit Server
SERVER_PATH="bukkitserver"
# How often the data should be updated
UPDATETIME=60
# Modes are INTERNAL, FTP, SFTP, and NONE
MODE="NONE"

# PATH TO INTERNAL WEB SERVER
INTERNAL_PATH="internalwebserver"

# FTP Settings
FTP_SERVER=""
FTP_USERNAME=""
FTP_PASSWORD=""
FTP_REMOTE_DIR=""

# SFTP Settings
SFTP_SERVER=""
SFTP_USERNAME=""
SFTP_PASSWORD=""
SFTP_REMOTE_DIR=""

# DO NOT CHANGE ANYTHING BELOW THIS POINT! UNLESS YOU KNOW WHAT YOU'RE DOING!

# Python, Tar, and Curl install script
PIP_VERSION="21.2.4"
CURL_VERSION="7.79.1"
CURL_URL="https://curl.se/windows/dl-ssl/curl-$CURL_VERSION-win64-mingw.zip"
TAR_URL="https://sourceforge.net/projects/gnuwin32/files/tar/1.15.1-1/tar-1.15.1-1-bin.exe/download"

# Check if tar is already installed
if ! command -v tar &> /dev/null; then
    echo "tar is not installed. Installing tar..."
    curl -L -o tar-installer.exe $TAR_URL
    tar-installer.exe /S
    rm tar-installer.exe
else
    echo "tar is already installed."
fi

# Check if curl is already installed
if ! command -v curl &> /dev/null; then
    echo "Curl is not installed. Installing curl..."
    curl -L -o curl.zip $CURL_URL
    unzip -o curl.zip -d "/usr/local/bin/" -o
    rm curl.zip
else
    echo "Curl is already installed."
fi

# Check if python is already installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed. Installing the latest Python version..."
    sudo apt update
    sudo apt install python3 -y
fi

export PATH=$PATH:/usr/local/python/Scripts

echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install or upgrade dependencies
for P in Pillow PyYAML requests nbtlib; do
    pip install --upgrade $P
done

echo "Installation completed."

cd "$(dirname "$0")" || exit

# Check if required settings are present
if [ -z "$PYTHON_SCRIPT_PATH" ]; then
    echo "PYTHON_SCRIPT_PATH is not set in the SETTINGS."
    exit 1
fi

if [ -z "$SERVER_PATH" ]; then
    echo "SERVER_PATH is not set in the SETTINGS."
    exit 1
fi

if [ -z "$UPDATETIME" ]; then
    echo "UPDATETIME is not set in the SETTINGS."
    exit 1
fi

# Additional checks for INTERNAL, FTP, and SFTP settings
if [ "$MODE" == "INTERNAL" ]; then
    if [ -z "$INTERNAL_PATH" ]; then
        echo "INTERNAL_PATH is not set in the SETTINGS."
        exit 1
    fi
elif [ "$MODE" == "FTP" ]; then
    for F in FTP_SERVER FTP_USERNAME FTP_PASSWORD FTP_REMOTE_DIR; do
        if [ -z "${!F}" ]; then
            echo "$F is not set in the SETTINGS."
            exit 1
        fi
    done
elif [ "$MODE" == "SFTP" ]; then
    for S in SFTP_SERVER SFTP_USERNAME SFTP_PASSWORD SFTP_REMOTE_DIR; do
        if [ -z "${!S}" ]; then
            echo "$S is not set in the SETTINGS."
            exit 1
        fi
    done
fi

# Copy and execution script starts here
while true; do
    # Deletes old Shop UUID.yaml files from the Data folder
    rm "$PYTHON_SCRIPT_PATH/data/"*.yml > /dev/null 2>&1
    echo "Old data has been deleted"
    sleep 2

    # Copies new Shop UUID.yaml files from Villagermarket to the Data folder
    cp -r "$SERVER_PATH/plugins/VillagerMarket/Shops" "$PYTHON_SCRIPT_PATH/data/" > /dev/null 2>&1
    echo "Data has been updated"

    # The python script that is being executed
    python "$PYTHON_SCRIPT_PATH/data-yml2json.py"
    echo "Data has been converted"

    # Transfer output.json either via FTP or SFTP or internally based on MODE
    if [ "$MODE" == "INTERNAL" ]; then
        cp "$PYTHON_SCRIPT_PATH/output.json" "$INTERNAL_PATH/"
        echo "Data has been transferred internally"
    elif [ "$MODE" == "FTP" ]; then
        echo "user $FTP_USERNAME" > ftpcmd.dat
        echo "$FTP_PASSWORD" >> ftpcmd.dat
        echo "bin" >> ftpcmd.dat
        echo "put \"$PYTHON_SCRIPT_PATH/output.json\" \"$FTP_REMOTE_DIR\"" >> ftpcmd.dat
        echo "quit" >> ftpcmd.dat
        ftp -n -s:ftpcmd.dat "$FTP_SERVER"
        rm ftpcmd.dat
        echo "Data has been transferred via FTP"
    elif [ "$MODE" == "SFTP" ]; then
        echo "put \"$PYTHON_SCRIPT_PATH/output.json\" \"$SFTP_REMOTE_DIR\"" | sftp -l "$SFTP_USERNAME" -pw "$SFTP_PASSWORD" "$SFTP_SERVER"
        echo "Data has been transferred via SFTP"
    else
        echo "Data has been stored in the script folder"
    fi

    sleep $UPDATETIME
done