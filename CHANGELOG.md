# Change Log

All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [0.7.0] - 2023-12-11

### Added

- Search function: Display shops matching search terms.
- Language selector now shows flag color for current language and displays text in uppercase.
- Translations for player and admin shop indexes
- Translations for 1.20.3 Items
- Icons for 1.20.3 Items (Tinyfied)

### Changed

- Already stocked amounts of player shops are subtracted from demands.
- Separated players and admin shops
- Fixed chinese index header alignment 

## [0.6.5] - 2023-12-04

### Added

- [Copy-Script](mc-dealer-copy-execute.bat):
  - Added internal/ftp/sftp/none-mode for copy jobs.
  - Included Python setup job.
- New Translations:
  - PL, PT, UA

### Changed

- Fixed an error with shops offering items for items (amount-key error)
- Copy-Script now clears target data directory before transferring new files, resolving deletion issues.
- Translations moved to a separate subdirectory.

## [0.6.4] - 2023-11-30

### Added

- Display enchantments and effects on items.

## [0.6.3] - 2023-11-27

### Added

- Show shop locations.
- Introduced a background image.
- Added translation for harming potion.

## [0.6.2] - 2023-11-25

### Added

- Implemented admin shops with distinct robot icon for stock status.
- Adjusted price calculation to prevent Python's rounding to 2 decimals for better pricing accuracy (still rounded by Frontend-JS).

## [0.6.1] - 2023-11-25

### Added

- Additional translations available in IT, FR, and CN.
- Simplified font for displaying CN translations.

## [0.6.0] - 2023-11-25

### Added

- Translations provided in DE, EN, and ES.
- Default language settings and offered languages integrated into the config.
- HTML-GUI includes a language selector.
- User's last language selection saved in a cookie.

## [0.5.1] - 2023-11-25

### Changed

- Renamed current translations file with iso2alpha suffix for German.
- Implemented headline translations via a JSON file for Translations.

## [0.5.0] - 2023-11-25

### Added

- Initial release.
