# Villager Market HTML Converter

[![CodeFactor](https://www.codefactor.io/repository/github/wolf128058/mc-dealer-yml2json/badge)](https://www.codefactor.io/repository/github/wolf128058/mc-dealer-yml2json)

## Function

The Villager Market HTML Converter is a tool designed to streamline the process of converting YAML files from the Minecraft plugin [Villager Market](https://www.spigotmc.org/resources/villager-market-the-ultimate-shop-plugin.82965/) ([GitHub](https://github.com/Bestem0r/VillagerMarket)) into a JSON array. Additionally, it provides an HTML file that comprehensively displays offers and demands from players and admin shops, utilizing the processed JSON data.

## HTML-Frontend Contents

- Stock Quantities
- Offer and Demand Prices
- Price per Unit
- Best-Price Tags
- Discounts
- Separate Buying and Selling Tables
- Enchantments and Effects on Items
- Table of Contents *(with scroll links to each shop)*
- Shop Locations
- Custom Currency Symbol
- Search function: Display shops matching search terms
- Translations available in:
  - German
  - English
  - French
  - Italian
  - Spanish
  - Polish
  - Ukrainian
  - Portuguese (Brazilian)
  - Simplified Chinese

## Prerequisites

- **Python3:** Verify Python3 installation and review required plugins in [requirements.txt](requirements.txt).
- **Scheduled Jobs:** A scheduled job should provide the YAML files in the subdirectory "data". Another scheduled job should run the Python script [data-yml2json.py](data-yml2json.py)  to generate JSON data. These tasks can be combined in a single job.
- **Batch Script Example:** Configure the provided batch script ([Windows example-batch-script](mc-dealer-copy-execute.bat))/([Linux example-batch-script](mc-dealer-copy-execute.sh)) for optional Python installation, library setup, and file export to a web server via XCOPY, FTP, or SFTP.
- **Web Server:** Host the files in web/ on an internal or external web server. For Bukkit users, consider plugins offering internal web server functionality.
- **Josh's More Foods Compatibility:** If using [Josh's More Foods](https://modrinth.com/datapack/joshs-more-foods/), utilize the available [script](assets/items/joshs-more-foods/rp-downloader.py) for necessary image downloads.

## Usage

### Without including Batch/SH file:
1. **Install Python3 and Plugins:** Ensure Python3 and [required plugins](https://github.com/CptGummiball/mc-dealer-yml2json-fork/blob/main/requirements.txt) are installed.
2. **Set Up Scheduled Jobs:** Create jobs for YAML file provision and script execution.
3. **Configure the config.json:** located in `/web/assets`
4. **Deploy a Web Server:** Host all generated files, considering Bukkit plugins for internal hosting.
5. **Josh's More Foods Integration:** If applicable, run the script for image downloads.

### Using the included Batch/SH file:
1. **Configure the config.json:** located in `/web/assets`
2. **Configure the included Batch/SH file:** Make shure you configure it correctly otherwise it will do nothing
3. **Run the included Batch/SH File:** It will install all the requirements and run the a scheduled job for converting and deployment of the shopdata.

### Joshs-More-Food and more
**Simply run the script from the associated folder of the desired data pack**

*By following these instructions, users can effectively manage Minecraft in-game economies by converting Villager Market YAML files into an accessible HTML format.*

## Demo

Explore the live demo at [ullrichcraft.de/vmshop/](https://ullrichcraft.de/vmshop/).

