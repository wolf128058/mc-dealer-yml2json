# Readme

## Function

The Villager Market HTML Converter is a tool designed to streamline the process of converting YAML files from the Minecraft plugin Villager Market [Villager Market](https://www.spigotmc.org/resources/villager-market-the-ultimate-shop-plugin.82965/) [(github)](https://github.com/Bestem0r/VillagerMarket) into a JSON array. Additionally, it provides an HTML file that comprehensively displays offers and demands from players and admin shops, utilizing the processed JSON data.

## Contents displayed of HTML-Frontend

- Stock Quantities
- Prices of Offers and Demands
- Price per Unit
- Best-Price Tags
- Discounts
- Separate Tables for Buying and Selling
- Enchantments and Effects on Items
- Table of Contents *(with scroll links to each shop)*
- Locations of the Shops
- Custom Currency Symbol
- Translations *available in German, English, French, Italian, Spanish, Polish, Ukrainian, Portuguese (Brazilian), and Simplified Chinese.*

## Prerequisites

- Python3:
*Ensure that Python3 is installed. Refer to the [requirements.txt](requirements.txt) file for necessary plugins.*

- Scheduled Jobs:
*A scheduled job should provide the YAML files in the subdirectory "data".*
Another scheduled job should run the Python script data-yml2json.py to generate JSON data. These tasks can be combined in a single job.*

- Batch Script Example:
*A [example-batch-script](mc-dealer-copy-execute.bat) is provided, containing optional Python installation, required libraries, and exporting output files to an external or internal web server via XCOPY, FTP, or SFTP. Configure the script for proper functionality.*

- Web Server:
*An internal or external web server is required to host all generated files. For Bukkit users, consider using plugins that provide internal web server functionality.*

- Data Subdirectory Protection:
*Consider securing the data subdirectory using tools like .htaccess or similar methods.*

- Josh's More Foods Compatibility:
*If [Josh's More Foods](https://modrinth.com/datapack/joshs-more-foods/) is installed, a [script](assets/items/joshs-more-foods/rp-downloader.py) is available to download necessary images. Run it once to ensure compatibility.*

## Usage Instructions:

1. Install Python3 and required plugins.
2. Set up scheduled jobs for providing YAML files and running the conversion script.
3. Optionally configure the batch script for automated tasks and file export.
4. Deploy an internal or external web server, considering Bukkit plugins for internal hosting. *(You can find many instructions on the internet on how to host a web server)*
5. Optionally, protect sensitive subdirectories using security measures like .htaccess.
6. If using Josh's More Foods, run the provided script for image downloads.

*By following these instructions, users can efficiently convert Villager Market YAML files into a user-friendly HTML format, enhancing the management of Minecraft in-game economies.*

## Demo
- see [ullrichcraft.de/vmshop/](https://ullrichcraft.de/vmshop/)

