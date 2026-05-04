---
title: Database — Practice Quiz
articleSlug: database
difficulty: Intermediate
estimatedTime: 25 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: sql, schema, migrations

What is a database migration, and why is it better than manually altering production tables?

<!-- ANSWER -->
A **database migration** is a versioned, script-based change to a database schema that can be applied and (often) reversed automatically.

**Example migration file:**
```typescript
// migrations/20241201_add_phone_to_users.ts
export async function up(db: Database) {
  await db.schema.alterTable('users', (table) => {
    table.string('phone', 20).nullable();
    table.index('phone');
  });
}

export async function down(db: Database) {
  await db.schema.alterTable('users', (table) => {
    table.dropIndex('phone');
    table.dropColumn('phone');
  });
}
```

**Why migrations over manual `ALTER TABLE`:**
1. **Reproducibility** — run `pnpm migrate` in any environment to reach the exact same schema
2. **Version history** — git log shows who made every schema change and why
3. **Team coordination** — everyone applies the same changes; no "I forgot to add the index"
4. **CI/CD** — migrations run automatically before each deployment
5. **Rollback** — if something breaks, `pnpm migrate:rollback` reverts the last change
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: query, joins, sql

Write a SQL query to find all users who have placed at least 3 orders in the last 30 days, sorted by order count descending.

<!-- ANSWER -->
```sql
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(o.id) AS order_count,
  SUM(o.total) AS total_spent
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE 
  o.created_at >= NOW() - INTERVAL '30 days'
  AND o.status != 'cancelled'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) >= 3
ORDER BY order_count DESC, total_spent DESC;
```

**Query breakdown:**
- `INNER JOIN` — only include users who have at least one matching order
- `WHERE` — filters orders to the last 30 days and excludes cancelled ones
- `GROUP BY` — aggregate one row per user
- `HAVING` — filter on the aggregated count (can't use `WHERE` with aggregate functions)
- `ORDER BY` — sort by order count; break ties by total spent

**Add index for performance:**
```sql
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);
```
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: transactions, acid, isolation

Explain ACID properties. Write a transaction that transfers money between accounts and handles failure atomically.

<!-- ANSWER -->
**ACID properties:**

| Property | Meaning |
|---|---|
| **Atomicity** | All operations succeed, or none do — no partial updates |
| **Consistency** | Transaction leaves the DB in a valid state (constraints, foreign keys) |
| **Isolation** | Concurrent transactions don't interfere with each other |
| **Durability** | Committed transactions survive crashes (written to disk) |

**Money transfer with transaction:**
```typescript
async function transfer(fromId: string, toId: string, amount: number): Promise<void> {
  await db.transaction(async (trx) => {
    // Lock both rows to prevent concurrent modifications (SELECT FOR UPDATE)
    const from = await trx('accounts')
      .where({ id: fromId })
      .forUpdate()  // row-level lock
      .first();

    const to = await trx('accounts')
      .where({ id: toId })
      .forUpdate()
      .first();

    if (!from || !to) throw new Error('Account not found');
    if (from.balance < amount) throw new Error('Insufficient funds');

    // Both updates happen atomically — if either fails, both are rolled back
    await trx('accounts')
      .where({ id: fromId })
      .update({ balance: from.balance - amount });

    await trx('accounts')
      .where({ id: toId })
      .update({ balance: to.balance + amount });

    // Audit trail
    await trx('transfers').insert({
      from_account_id: fromId,
      to_account_id: toId,
      amount,
      created_at: new Date(),
    });

    // If any of the above throws, ALL changes are automatically rolled back
    // The balances return to their original values
  });
}
```

**Key:** `forUpdate()` (SELECT FOR UPDATE) locks the rows until the transaction completes, preventing another transaction from reading stale balances in parallel.
<!-- END -->
