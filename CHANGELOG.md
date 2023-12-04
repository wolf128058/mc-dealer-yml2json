# Change Log

All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [NEXT]

### Added

- [Copy-Script](mc-dealer-copy-execute.bat):
  - added internal/ftp/sftp/none-mode for doing copy-jobs
  - added python-setup-job

### Changed

- Fixed an error with shops offering items for items (amount-key error)
- Copy-Script: Clear target data-directory before pushing new files there. And suddenly deletions magically work :) 

## [0.6.4] - 2020-11-30

### Added

- Display enchantments and effects on items.

## [0.6.3] - 2020-11-27

### Added

- Display shop locations.
- Introduced a background image.
- Added translation for harming potion.

## [0.6.2] - 2020-11-25

### Added

- Implemented admin shops with distinct icon (robot) for stock status.
- Modified price calculation to prevent rounding to 2 decimals by Python for better best-price calculation. (Still rounded by Frontend-JS)

## [0.6.1] - 2020-11-25

### Added

- Additional translations available in IT, FR, and CN.
- Simplified the font for display of CN translations.

## [0.6.0] - 2020-11-25

### Added

- Providing translations in DE, EN, and ES now.
- Included default language settings and of offered languages in the config.
- Integrated a language selector in the HTML-GUI.
- Cookie now saves the last language selection of users.

## [0.5.1] - 2020-11-25

### Changed

- Renamed current translations file with iso2alpha suffix for German.
- Implemented translation of headlines via a JSON file for Translations.

## [0.5.0] - 2020-11-25

### Added

- Initial release.
