---
title: Deployment
description: Deploy your application to any cloud platform in minutes.
category: Guides
order: 2
---

# Deployment

## Vercel

The fastest way to deploy — connect your GitHub repository:

```bash
pnpm install -g vercel
vercel deploy
```

Or use the Vercel dashboard to import your project directly.

**Environment Variables:**

Set these in the Vercel dashboard under Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
API_SECRET=...
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Docker

Build and run with Docker:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
RUN npm install -g pnpm && pnpm install --prod
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```bash
docker build -t my-project .
docker run -p 3000:3000 --env-file .env my-project
```

## Railway

Deploy with a single command:

```bash
railway login
railway init
railway up
```

## AWS

### EC2

```bash
# SSH into your instance
ssh -i key.pem ubuntu@your-ec2-ip

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm pm2

# Deploy
git clone your-repo && cd your-repo
pnpm install && pnpm build
pm2 start dist/index.js --name my-project
pm2 save && pm2 startup
```

### ECS / Fargate

Use the provided `docker-compose.aws.yml` for containerized deployments on ECS.

## Health Checks

Your deployed app exposes a health endpoint:

```bash
curl https://your-app.com/api/healthz
# {"status":"ok","uptime":3600,"version":"1.2.3"}
```

## CI/CD

Example GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```
