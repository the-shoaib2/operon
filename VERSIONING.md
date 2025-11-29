# Versioning Guide

## Overview

Operone uses [Changesets](https://github.com/changesets/changesets) for version management and [Semantic Versioning](https://semver.org/) for version numbers.

## Semantic Versioning

We follow the SemVer specification: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0): Breaking changes that require user action
- **MINOR** (0.1.0): New features that are backward compatible
- **PATCH** (0.0.1): Bug fixes that are backward compatible

### Examples

- `0.1.0 → 1.0.0`: Breaking API change (major)
- `1.0.0 → 1.1.0`: New feature added (minor)
- `1.1.0 → 1.1.1`: Bug fix (patch)

## Changeset Workflow

### For Contributors

#### 1. Making Changes

```bash
# Create a feature branch
git checkout -b feature/my-feature

# Make your changes
# ... edit files ...

# Add a changeset
pnpm changeset:add
```

#### 2. Creating a Changeset

When you run `pnpm changeset:add`, you'll be prompted:

```
🦋  Which packages would you like to include?
◯ @repo/operone
◯ @repo/ai
◯ apps/web
◯ apps/operone
```

Select the packages your changes affect.

```
🦋  Which type of change is this for @repo/operone?
◯ patch (0.0.1)
◯ minor (0.1.0)
◯ major (1.0.0)
```

Choose the appropriate version bump type.

```
🦋  Please enter a summary for this change (this will be in the changelog)
```

Write a clear, user-facing description of your change.

#### 3. Committing

```bash
# Commit your changes AND the changeset
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

#### 4. Pull Request

Create a PR. The changeset will be reviewed along with your code.

### For Maintainers

#### Releasing a New Version

```bash
# 1. Ensure you're on main branch
git checkout main
git pull origin main

# 2. Run version command
pnpm version

# This will:
# - Consume all changesets
# - Update package.json versions
# - Update CHANGELOG.md
# - Delete consumed changeset files

# 3. Review changes
git diff

# 4. Commit version bump
git add .
git commit -m "chore: version packages"
git push origin main

# 5. Create GitHub release (manual or automated)
# Tag format: v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## Changeset Types

### Patch (Bug Fixes)

Use for:
- Bug fixes
- Performance improvements
- Documentation updates
- Internal refactoring

Example:
```markdown
---
"@repo/operone": patch
---

Fix memory leak in AI service
```

### Minor (New Features)

Use for:
- New features
- New API endpoints
- New UI components
- Deprecations (with backward compatibility)

Example:
```markdown
---
"apps/web": minor
---

Add download page with platform detection
```

### Major (Breaking Changes)

Use for:
- Breaking API changes
- Removed features
- Changed behavior that breaks existing usage
- Major architecture changes

Example:
```markdown
---
"@repo/ai": major
---

BREAKING: Change AI provider interface to use async/await
```

## Version Policies

### Apps (web, operone, docs)

- **Independent versioning**: Each app has its own version
- **User-facing changes**: Focus on features users will notice
- **Major versions**: Reserve for significant UI/UX changes

### Packages (shared libraries)

- **Linked versioning**: Related packages bump together
- **API stability**: Major version for breaking API changes
- **Internal changes**: Patch for refactoring

## Linked Packages

These packages are versioned together:
- `@repo/operone`
- `@repo/ai`
- `@repo/mcp`

When one gets a version bump, all get the same bump.

## Ignored Packages

These packages don't participate in versioning:
- `@repo/eslint-config`
- `@repo/typescript-config`

## Best Practices

### Writing Good Changeset Descriptions

✅ **Good**:
```markdown
Add GitHub releases integration to download page

Users can now download the latest version directly from GitHub releases.
The page automatically fetches and displays the latest release assets.
```

❌ **Bad**:
```markdown
Update download page
```

### When to Create a Changeset

**Always create a changeset for**:
- New features
- Bug fixes
- Breaking changes
- Deprecations

**Don't create a changeset for**:
- Documentation-only changes (unless in a package)
- Test updates
- CI/CD changes
- Development tooling updates

### Multiple Changes

If your PR includes multiple types of changes, create multiple changesets:

```bash
# First changeset for feature
pnpm changeset:add
# Select: minor, describe feature

# Second changeset for bug fix
pnpm changeset:add
# Select: patch, describe fix
```

## Automation

### GitHub Actions

Our CI/CD automatically:
1. Validates changesets on PRs
2. Creates release PRs when changesets are merged
3. Publishes releases when version PR is merged
4. Uploads release assets (desktop apps)

### Version Check

Check if changesets are needed:
```bash
pnpm version:check
```

This compares your branch with `origin/main` and shows if changesets are required.

## FAQ

### Q: I forgot to add a changeset, what do I do?

A: Add it before merging:
```bash
pnpm changeset:add
git add .changeset/
git commit -m "chore: add changeset"
git push
```

### Q: Can I edit a changeset after creating it?

A: Yes! Changesets are just markdown files in `.changeset/`. Edit them directly.

### Q: What if I need to release immediately?

A: For hotfixes:
```bash
pnpm changeset:add  # Create patch changeset
pnpm version        # Bump version
pnpm release        # Publish immediately
```

### Q: How do I see what will be released?

A: Run:
```bash
pnpm changeset:status
```

This shows pending changesets and version bumps.

### Q: Can I skip the changelog entry?

A: No. Every version bump should have a changelog entry for transparency.

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Support

For questions about versioning:
1. Check this guide
2. Review existing changesets in `.changeset/`
3. Ask in PR comments
4. Contact maintainers
