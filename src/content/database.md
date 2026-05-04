---
title: Database
description: Integrate with PostgreSQL, MySQL, SQLite and more using our ORM layer.
category: Guides
order: 3
---

# Database

## Connecting to a Database

```typescript
import { createDatabase } from 'my-project/db';

const db = createDatabase({
  url: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 },
});
```

## Defining Models

```typescript
import { model, field } from 'my-project/db';

const User = model('users', {
  id: field.uuid().primaryKey().default('gen_random_uuid()'),
  name: field.text().notNull(),
  email: field.text().unique().notNull(),
  role: field.enum(['admin', 'user', 'guest']).default('user'),
  createdAt: field.timestamp().default('now()'),
});

export type User = typeof User.$inferSelect;
export type NewUser = typeof User.$inferInsert;
```

## Querying

```typescript
// Find all users
const users = await db.select().from(User);

// Find with conditions
const admins = await db
  .select()
  .from(User)
  .where(eq(User.role, 'admin'))
  .orderBy(desc(User.createdAt))
  .limit(10);

// Find one
const user = await db
  .select()
  .from(User)
  .where(eq(User.id, userId))
  .then(rows => rows[0]);
```

## Mutations

```typescript
// Insert
const [newUser] = await db
  .insert(User)
  .values({ name: 'Jane Doe', email: 'jane@example.com' })
  .returning();

// Update
await db
  .update(User)
  .set({ name: 'Jane Smith' })
  .where(eq(User.id, userId));

// Delete
await db
  .delete(User)
  .where(eq(User.id, userId));
```

## Migrations

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Reset (dev only)
pnpm db:reset
```

## Transactions

```typescript
await db.transaction(async (tx) => {
  const [user] = await tx.insert(User).values(userData).returning();
  await tx.insert(Profile).values({ userId: user.id, ...profileData });
});
```

## Connection Pooling

For production, configure the connection pool:

```typescript
const db = createDatabase({
  url: process.env.DATABASE_URL,
  pool: {
    min: 5,
    max: 20,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
  },
});
```
