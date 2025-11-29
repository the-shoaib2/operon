# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- End-to-end testing for download page
- GitHub releases integration
- Automated version control with Changesets
- Download flow testing with platform detection

### Changed
- Enhanced download configuration with dynamic GitHub releases
- Improved error handling for API failures

### Fixed
- Download link validation
- Platform detection accuracy

---

## How to Update This Changelog

This changelog is automatically generated from changesets. To add an entry:

1. Create a changeset:
   ```bash
   pnpm changeset:add
   ```

2. Follow the prompts to describe your changes

3. Commit the changeset file

4. When ready to release, run:
   ```bash
   pnpm version
   ```

This will consume all changesets and update this CHANGELOG.md file automatically.
