---
title: CLI Reference
description: Full reference for the command-line interface.
category: Reference
order: 4
---

# CLI Reference

## Installation

```bash
pnpm add -g my-project-cli
```

Verify installation:

```bash
my-project --version
# 2.4.1
```

## Commands

### `init`

Scaffold a new project:

```bash
my-project init [name] [options]
```

**Options:**

| Flag | Description |
|------|-------------|
| `--template` | Starter template (`default`, `minimal`, `full`) |
| `--typescript` | Enable TypeScript (default: true) |
| `--git` | Initialize a Git repo (default: true) |
| `--install` | Install dependencies after scaffolding (default: true) |

**Example:**

```bash
my-project init my-app --template full
cd my-app
```

### `dev`

Start the development server:

```bash
my-project dev [options]
```

**Options:**

| Flag | Default | Description |
|------|---------|-------------|
| `--port` | `3000` | Port to listen on |
| `--host` | `localhost` | Host to bind to |
| `--open` | `false` | Open browser on start |

### `build`

Build for production:

```bash
my-project build [options]
```

**Options:**

| Flag | Description |
|------|-------------|
| `--analyze` | Open bundle analyzer |
| `--no-minify` | Disable minification |
| `--sourcemap` | Generate source maps |

### `generate`

Code generation commands:

```bash
# Generate a new component
my-project generate component Button

# Generate a new page
my-project generate page settings

# Generate a new API route
my-project generate route api/users

# Generate database migration
my-project generate migration add-user-role
```

### `db`

Database management:

```bash
# Push schema changes to the database
my-project db push

# Generate a migration
my-project db generate

# Run pending migrations
my-project db migrate

# Open database studio
my-project db studio

# Seed the database
my-project db seed
```

### `deploy`

Deploy your application:

```bash
my-project deploy [--production] [--preview]
```

## Configuration File

The CLI reads `my-project.config.ts` from the project root. Global defaults can be set in `~/.my-project/config.json`:

```json
{
  "telemetry": false,
  "preferredPackageManager": "pnpm"
}
```
