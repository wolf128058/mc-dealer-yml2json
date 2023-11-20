# Readme

## Function

This tool converts your yml-Files from the Minecraft plugin [Villager Market](https://www.spigotmc.org/resources/villager-market-the-ultimate-shop-plugin.82965/) [(github)](https://github.com/Bestem0r/VillagerMarket) to a json-array and provides a html-file that shows offers and demands of the players out of the generated json data.

## Prerequisites

- Python3 (see [requirements.txt](requirements.txt) for neccesary plugins )
- a scheduled job providing the yml-files in the subdirectory "data"
- a scheduled job that runs the python script data-yml2json.py to generate the json data. You can use the same job to run those two tasks one after another. See [example-batch-script](mc-dealer-copy-execute.bat)
- a webserver, that provides all the files. You may want to protect the data-Subdirectory. Feel free to use htacccess or similiar.