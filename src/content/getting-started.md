---
title: Getting Started
description: Learn how to set up and run the project in minutes.
category: Introduction
order: 1
---

# Getting Started

Welcome to the documentation! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** v18 or higher
- **pnpm** v8 or higher
- A modern browser (Chrome, Firefox, Safari, Edge)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/example/my-project.git
cd my-project
pnpm install
```

## Running Locally

Start the development server:

```bash
pnpm dev
```

Open your browser and navigate to `http://localhost:3000`.

## Building for Production

```bash
pnpm build
pnpm preview
```

## Project Structure

```
my-project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/
│   └── index.ts
├── public/
├── package.json
└── README.md
```

## Next Steps

- Read the [Configuration](/docs/configuration) guide
- Explore the [API Reference](/docs/api-reference)
- Check out [Examples](/docs/examples)
