---
title: Components
description: Explore the full library of reusable UI components.
category: Reference
order: 2
---

# Components

## Button

The core interactive element. Supports multiple variants and sizes.

```tsx
import { Button } from 'my-project/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

<Button variant="outline" disabled>
  Disabled
</Button>

<Button variant="ghost" loading>
  Loading...
</Button>
```

**Props:**

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `loading` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |

## Input

```tsx
import { Input } from 'my-project/ui';

<Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

## Card

```tsx
import { Card, CardHeader, CardBody, CardFooter } from 'my-project/ui';

<Card>
  <CardHeader>
    <h3>Card Title</h3>
    <p>Subtitle text</p>
  </CardHeader>
  <CardBody>
    Main content goes here.
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Modal

```tsx
import { Modal } from 'my-project/ui';

const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
>
  <div className="flex gap-2 justify-end">
    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
  </div>
</Modal>
```

## Table

```tsx
import { Table } from 'my-project/ui';

<Table
  data={users}
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (val) => <Badge>{val}</Badge> },
    { key: 'actions', label: '', render: (_, row) => (
      <Button size="sm" onClick={() => editUser(row)}>Edit</Button>
    )},
  ]}
  pagination={{ pageSize: 20, total: users.length }}
/>
```
