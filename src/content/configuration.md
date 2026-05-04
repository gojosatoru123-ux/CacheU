---
title: Configuration
description: Configure every aspect of your project with a simple config file.
category: Introduction
order: 2
---

# Configuration

The project uses a single configuration file at the root: `my-project.config.ts`.

## Basic Configuration

```typescript
import { defineConfig } from 'my-project';

export default defineConfig({
  title: 'My Project',
  description: 'An awesome project',
  baseUrl: 'https://example.com',
  theme: 'light',
});
```

## Theme Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color scheme |
| `primaryColor` | `string` | `'#6366f1'` | Brand color |
| `fontFamily` | `string` | `'Inter'` | Primary font |

## Advanced Options

### Custom Plugins

```typescript
import { defineConfig } from 'my-project';
import { analyticsPlugin } from './plugins/analytics';

export default defineConfig({
  plugins: [
    analyticsPlugin({ trackingId: 'UA-XXXXXXXX' }),
  ],
});
```

### Environment Variables

Create a `.env` file at the root:

```bash
DATABASE_URL=postgresql://localhost:5432/mydb
API_SECRET=your-secret-key
PUBLIC_API_URL=https://api.example.com
```

## Validation

The config is validated at startup. Invalid values throw descriptive errors:

```
Error: Invalid config option "theme": expected 'light' | 'dark' | 'auto', got 'midnight'
```
