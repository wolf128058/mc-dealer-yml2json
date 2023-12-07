# Villager Market HTML Converter

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
- **Batch Script Example:** Configure the provided batch script ([example-batch-script](mc-dealer-copy-execute.bat)) for optional Python installation, library setup, and file export to a web server via XCOPY, FTP, or SFTP.
- **Web Server:** Host all generated files on an internal or external web server. For Bukkit users, consider plugins offering internal web server functionality.
- **Data Subdirectory Protection:** Secure the data subdirectory using tools like .htaccess or similar methods.
- **Josh's More Foods Compatibility:** If using [Josh's More Foods](https://modrinth.com/datapack/joshs-more-foods/), utilize the available [script](assets/items/joshs-more-foods/rp-downloader.py) for necessary image downloads.

## Usage Instructions:

Follow these steps to efficiently convert Villager Market YAML files into a user-friendly HTML format:

1. **Install Python3 and Plugins:** Ensure Python3 and required plugins are installed.
2. **Set Up Scheduled Jobs:** Create jobs for YAML file provision and script execution.
3. **Configure Batch Script:** Optionally configure the provided batch script for automated tasks and file export.
4. **Deploy a Web Server:** Host all generated files, considering Bukkit plugins for internal hosting.
5. **Data Subdirectory Protection:** Secure sensitive subdirectories using measures like .htaccess.
6. **Josh's More Foods Integration:** If applicable, run the script for image downloads.

*By following these instructions, users can effectively manage Minecraft in-game economies by converting Villager Market YAML files into an accessible HTML format.*

## Demo

Explore the live demo at [ullrichcraft.de/vmshop/](https://ullrichcraft.de/vmshop/).