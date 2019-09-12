# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [0.3.0] - 2019-09-12
### Added
- Added ability to set FS favorites manually using data attributes
- Selecting a file now emits a `keyup` event for the targeted input element

## [0.2.0] - 2019-08-23
### Added
- Added fallback for FS favorites: set manually using window.file_picker_favorites, Dashboard (with an attempted Fetch if necessary), and finally '/'

### Changed
- Reduced bundle size by removing Bootstrap modal components
- FS favorites are not shown if no favorites are available

### Fixed
- Fix logic with blank input

## [0.1.1] - 2019-08-08
### Fixed
- Fixed issue where file filter input would be blanked but the filter itself would still be active

## [0.1.0] - 2019-07-24
### Added

- Improved user-visible error messaging
- Added filtering
- Improved look and feel

### Changed

- Changed FileExplorer to use the current page's File menu to initialize the favorites menu
- Reduced form.js size

### Fixed

- Fixed credential error

## [0.0.1] - 2019-07-20
### Added
- Initial release!

[Unreleased]: https://github.com/OSC/ood_js_filepicker/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/OSC/ood_js_filepicker/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/OSC/ood_js_filepicker/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/OSC/ood_js_filepicker/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/OSC/ood_js_filepicker/compare/v0.0.1...v0.1.0