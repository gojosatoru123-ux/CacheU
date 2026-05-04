---
title: Examples
description: Real-world examples and starter templates to get you building fast.
category: Community
order: 3
---

# Examples

## Todo App

A simple CRUD application demonstrating the basics:

```typescript
import { createClient } from 'my-project';
import { useQuery, useMutation } from 'my-project/hooks';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const client = createClient({ apiKey: process.env.API_KEY });

function TodoApp() {
  const { data: todos, refetch } = useQuery<Todo[]>(
    () => client.get('/todos'),
    { key: 'todos' }
  );

  const { mutate: createTodo } = useMutation(
    (title: string) => client.post<Todo>('/todos', { title }),
    { onSuccess: refetch }
  );

  const { mutate: toggleTodo } = useMutation(
    (todo: Todo) => client.put<Todo>(`/todos/${todo.id}`, {
      completed: !todo.completed
    }),
    { onSuccess: refetch }
  );

  return (
    <div>
      <TodoForm onSubmit={(title) => createTodo(title)} />
      {todos?.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => toggleTodo(todo)}
        />
      ))}
    </div>
  );
}
```

## Authentication Flow

```typescript
import { OAuthProvider } from 'my-project/auth';

const github = new OAuthProvider({
  provider: 'github',
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: `${process.env.APP_URL}/auth/callback`,
  scopes: ['user:email'],
});

// Login route
app.get('/auth/login', (req, res) => {
  const url = github.getAuthorizationUrl({
    state: generateState(),
  });
  res.redirect(url);
});

// Callback route
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!verifyState(state)) {
    return res.status(400).json({ error: 'Invalid state' });
  }

  const tokens = await github.exchangeCode(code);
  const user = await github.getUser(tokens.accessToken);
  
  const session = await createSession(user);
  res.cookie('session', session.token, { httpOnly: true, secure: true });
  res.redirect('/dashboard');
});
```

## Paginated List

```typescript
function UserList() {
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery(
    () => client.get<{ users: User[]; total: number }>('/users', {
      params: { page, limit: 20 },
    }),
    { key: `users-page-${page}` }
  );

  return (
    <div>
      {loading ? <Skeleton count={20} /> : (
        data?.users.map((user) => <UserCard key={user.id} user={user} />)
      )}
      <Pagination
        current={page}
        total={Math.ceil((data?.total ?? 0) / 20)}
        onChange={setPage}
      />
    </div>
  );
}
```

## File Upload

```typescript
import { useUpload } from 'my-project/hooks';

function AvatarUpload({ userId }: { userId: string }) {
  const { upload, progress, loading } = useUpload({
    url: `/users/${userId}/avatar`,
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    onSuccess: (url) => updateAvatar(url),
  });

  return (
    <div>
      <input type="file" onChange={(e) => upload(e.target.files[0])} />
      {loading && <ProgressBar value={progress} />}
    </div>
  );
}
```

## WebSocket Real-time

```typescript
import { useWebSocket } from 'my-project/hooks';

function LiveChat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const { send } = useWebSocket(`/ws/chat/${roomId}`, {
    onMessage: (msg) => setMessages((prev) => [...prev, msg]),
  });

  return (
    <div>
      <MessageList messages={messages} />
      <MessageInput onSend={send} />
    </div>
  );
}
```
