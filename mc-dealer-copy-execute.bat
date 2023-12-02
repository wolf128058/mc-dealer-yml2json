:: Batch script to copy/update VillagerMarket Shop files and execute data-yml2json.py
::Note that this batch script only works if all data has been entered correctly

@ECHO OFF
TITLE WindowsVMCopieScript

:: If the batch file is in the same folder as "data-yml2json.py", do not change anything in the following line
:: If the batch file is NOT in the same folder as "data-yml2json.py", then change the following line to "cd path\wherethescriptis\located"
cd /d %~dp0

:: Copy and execution script starts here
:a
	:: Deletes old Shop UUID.yaml files from the Data folder and
	:: Copies new Shop UUID.yaml files from Villagermarket to the Data folder
	:: Change path1 to the path of your Minecraft plugin folder
	:: Change path2 to your Shop Info webfiles folder
	del "path2\data\*.yml" >nul
	Echo Old Data has been deleted
	TIMEOUT /T 2 >nul
	xcopy /s/y/i "path1\VillagerMarket\Shops" "path2\data" >nul
	Echo Data has been updated

	:: The python script that is being executed (Don't change this!)
	python data-yml2json.py
	Echo data-yml2json.py has been executed

	:: Time in seconds how often the files should be updated
	:: Villagermarket only updates its data every 10 minutes by default
	:: A similar update time should be selected here as in the Villagermarket configuration
	TIMEOUT /T 600 >nul

::Repeat the script
GOTO a
