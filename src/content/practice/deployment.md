---
title: Deployment — Practice Quiz
articleSlug: deployment
difficulty: Intermediate
estimatedTime: 15 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: environment-variables, production

Why should secrets like database passwords never be hardcoded in source code?

<!-- ANSWER -->
Hardcoding secrets is dangerous for several reasons:

1. **Version control exposure** — If committed to Git, the secret is in the history forever. Even deleting the file doesn't remove it from previous commits. Public repos = immediate compromise.
2. **Can't rotate secrets** — You'd need to push a new commit to change a password. You want to rotate DB passwords without a deployment.
3. **Can't differ per environment** — Dev should use a dev DB; production should use the prod DB. Hardcoded values force one value for all.
4. **Team access** — Not everyone on the team should see production credentials, but everyone can see the code.

**Correct approach:**
```typescript
// ❌ Never
const db = new Pool({ password: 'super_secret_prod_password' });

// ✅ Always — read from environment at runtime
const db = new Pool({ password: process.env.DB_PASSWORD });
```

Store secrets in: CI/CD secret management, cloud provider secret manager (AWS Secrets Manager, GCP Secret Manager), or platform-level env var injection.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: docker, containerization

What does a Dockerfile do, and what do the `FROM`, `COPY`, `RUN`, and `CMD` instructions mean?

<!-- ANSWER -->
A **Dockerfile** is a recipe for building a Docker image — a reproducible, portable snapshot of your application and its environment.

```dockerfile
# FROM — base image to start from (Node.js 20 on minimal Alpine Linux)
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# COPY — copy files from host into the container image
COPY package.json pnpm-lock.yaml ./

# RUN — execute a command during the image build (install dependencies)
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy remaining source code
COPY . .

# Build the app
RUN pnpm build

# Expose the port the app listens on (documentation only — doesn't actually open it)
EXPOSE 3000

# CMD — command that runs when a container starts from this image
CMD ["node", "dist/server.js"]
```

**Key distinction — RUN vs CMD:**
- `RUN` runs during **build time** → baked into the image
- `CMD` runs at **container start time** → can be overridden
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: ci-cd, pipeline, deployment

Describe a simple CI/CD pipeline for a Node.js app. What happens on each step?

<!-- ANSWER -->
```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  # Step 1: Continuous Integration
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm install -g pnpm && pnpm install
      - run: pnpm run typecheck    # Type checking
      - run: pnpm run lint         # Linting
      - run: pnpm run test         # Unit + integration tests
      - run: pnpm run build        # Ensure it builds

  # Step 2: Continuous Deployment (only if tests pass)
  deploy:
    needs: test  # only runs if test job succeeds
    runs-on: ubuntu-latest
    steps:
      - run: pnpm build --prod
      - run: docker build -t myapp:${{ github.sha }} .
      - run: docker push registry.example.com/myapp:${{ github.sha }}
      - run: kubectl set image deployment/myapp app=myapp:${{ github.sha }}
```

**Pipeline stages:**
1. **Checkout** — get the latest code
2. **Install** — restore dependencies from lockfile
3. **Typecheck** — catch TypeScript errors
4. **Lint** — enforce code style
5. **Test** — run test suite
6. **Build** — verify the app compiles
7. **Containerize** — build Docker image tagged with commit SHA
8. **Deploy** — rolling update to production cluster
<!-- END -->
