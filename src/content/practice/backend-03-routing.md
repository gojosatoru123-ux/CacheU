````md id="7m2qva"
<!-- QUESTION -->
difficulty: Easy
tags: routing, backend, web-development

What is backend routing?

<!-- ANSWER -->
Backend routing is the process of mapping incoming HTTP requests to specific server-side handlers or functions.

Example:

```http
GET /users
````

may map to:

```js
getUsersHandler()
```

Routing allows backend applications to:

* organize endpoints
* handle requests
* execute business logic
* return responses

Example routing table:

| Route      | Method | Action      |
| ---------- | ------ | ----------- |
| /users     | GET    | Fetch users |
| /users     | POST   | Create user |
| /users/:id | DELETE | Delete user |

Example Express.js route:

```js
app.get('/users', getUsersHandler)
```

Routing is a core part of every backend framework.

<!-- END -->

````id="4x9kpd"

```md id="1v7qzt"
<!-- QUESTION -->
difficulty: Easy
tags: routing, http-methods, rest

Why do backend routes use different HTTP methods?

<!-- ANSWER -->
Different HTTP methods represent different operations on resources.

Example:

| Method | Purpose |
|---|---|
| GET | Retrieve data |
| POST | Create data |
| PUT | Replace data |
| PATCH | Update partial data |
| DELETE | Remove data |

Example routes:

```http
GET /users
POST /users
DELETE /users/1
````

Benefits:

* standardized API design
* predictable behavior
* RESTful architecture
* clear semantics

Example Express routes:

```js
app.get('/users', getUsers)
app.post('/users', createUser)
```

Using proper HTTP methods improves:

* API consistency
* maintainability
* client understanding

<!-- END -->

````id="6n3xqe"

```md id="8p1vkc"
<!-- QUESTION -->
difficulty: Easy
tags: dynamic-routing, backend, api

What are route parameters in backend routing?

<!-- ANSWER -->
Route parameters are dynamic values embedded inside URLs.

Example route:

```http
GET /users/:id
````

Example request:

```http id="4v8mpt"
GET /users/42
```

Here:

```text id="1k5qzx"
id = 42
```

Example Express.js route:

```js
app.get('/users/:id', (req, res) => {
  console.log(req.params.id)
})
```

Benefits:

* dynamic routing
* cleaner URLs
* flexible APIs

Common use cases:

* user profiles
* product pages
* blog posts
* resource identifiers

Route parameters are heavily used in REST APIs.

<!-- END -->

````id="2m7qtw"

```md id="5x9vpa"
<!-- QUESTION -->
difficulty: Medium
tags: query-parameters, routing, backend

What is the difference between route parameters and query parameters?

<!-- ANSWER -->
Route parameters identify a specific resource.

Query parameters modify request behavior.

Comparison:

| Route Parameters | Query Parameters |
|---|---|
| Part of URL path | Added after `?` |
| Identify resource | Filter/sort/paginate |
| Required | Usually optional |

Examples:

Route parameter:

```http
GET /users/42
````

Query parameter:

```http id="5m2xqr"
GET /users?page=2&limit=10
```

Example Express.js usage:

```js
req.params.id
req.query.page
```

Common query parameter uses:

* filtering
* sorting
* searching
* pagination

Both are essential for backend API design.

<!-- END -->

````id="7w3kpm"

```md id="9n2xqe"
<!-- QUESTION -->
difficulty: Medium
tags: middleware, routing, express

What is middleware in backend routing?

<!-- ANSWER -->
Middleware is a function that executes during the request-response cycle before the final route handler.

Flow:

```text
Request → Middleware → Route Handler → Response
````

Example Express middleware:

```js
app.use((req, res, next) => {
  console.log(req.method)
  next()
})
```

Common middleware responsibilities:

| Responsibility | Example                       |
| -------------- | ----------------------------- |
| Authentication | Verify JWT                    |
| Logging        | Log requests                  |
| Validation     | Validate input                |
| CORS           | Configure cross-origin access |

Example protected route:

```js
app.get('/admin', authMiddleware, adminHandler)
```

Middleware improves:

* code reuse
* modularity
* request processing
* security enforcement

<!-- END -->

````id="4v8xyt"

```md id="3q1mpd"
<!-- QUESTION -->
difficulty: Medium
tags: restful-api, backend-routing, api-design

What is RESTful routing?

<!-- ANSWER -->
RESTful routing follows REST principles by mapping HTTP methods to resource operations.

Example resource:

```text
/users
````

RESTful routes:

| Method | Route    | Action       |
| ------ | -------- | ------------ |
| GET    | /users   | Fetch users  |
| GET    | /users/1 | Fetch user   |
| POST   | /users   | Create user  |
| PUT    | /users/1 | Replace user |
| PATCH  | /users/1 | Update user  |
| DELETE | /users/1 | Delete user  |

RESTful APIs use:

* nouns instead of verbs
* predictable URL structures
* standard HTTP semantics

Bad example:

```http id="1w9xpc"
GET /deleteUser
```

Good example:

```http id="5n2vzy"
DELETE /users/1
```

RESTful routing improves:

* API consistency
* readability
* scalability
* client integration

<!-- END -->

````id="8p4mqt"

```md id="6x1qke"
<!-- QUESTION -->
difficulty: Hard
tags: route-order, express, backend

Why does route order matter in backend frameworks like Express.js?

<!-- ANSWER -->
In frameworks like Express.js, routes are matched in the order they are defined.

Example:

```js
app.get('/users/:id', dynamicHandler)

app.get('/users/admin', adminHandler)
````

Problem:

```text id="2k8vpa"
/users/admin
```

matches:

```text id="7m5xqd"
/users/:id
```

instead of the intended admin route.

Correct ordering:

```js
app.get('/users/admin', adminHandler)

app.get('/users/:id', dynamicHandler)
```

Why order matters:

| Reason                    | Impact                             |
| ------------------------- | ---------------------------------- |
| First match wins          | Earlier routes override later ones |
| Dynamic routes are greedy | May capture unintended paths       |
| Middleware order matters  | Request flow changes               |

Improper route ordering can cause:

* incorrect handlers
* security issues
* broken APIs

Specific routes should usually appear before dynamic routes.

<!-- END -->

````id="9v2xmc"

```md id="2w7qpa"
<!-- QUESTION -->
difficulty: Hard
tags: versioning, api-routing, backend

Why is API versioning important in backend routing?

<!-- ANSWER -->
API versioning allows backend systems to evolve without breaking existing clients.

Example:

```http
/api/v1/users
/api/v2/users
````

Why versioning is needed:

| Reason                 | Explanation                        |
| ---------------------- | ---------------------------------- |
| Backward compatibility | Older clients continue working     |
| Safe upgrades          | New features without breaking APIs |
| Incremental migration  | Gradual client adoption            |

Example:

```text
v1:
name

v2:
firstName + lastName
```

Without versioning:

* frontend applications may break
* mobile apps may fail
* integrations become unstable

Common versioning strategies:

| Strategy          | Example                    |
| ----------------- | -------------------------- |
| URL Versioning    | /api/v1/users              |
| Header Versioning | Accept: application/vnd.v1 |
| Query Versioning  | ?version=1                 |

Versioning is essential for production-grade backend APIs.

<!-- END -->

````id="3n8vyt"

```md id="5m1qxe"
<!-- QUESTION -->
difficulty: Hard
tags: nested-routing, api-design, backend

What is nested routing in backend APIs?

<!-- ANSWER -->
Nested routing represents relationships between resources using hierarchical URLs.

Example:

```http
/users/42/orders
````

Meaning:

```text id="9v5xqd"
Orders belonging to user 42
```

Nested route examples:

| Route              | Meaning       |
| ------------------ | ------------- |
| /users/42/orders   | User orders   |
| /posts/10/comments | Post comments |
| /projects/5/tasks  | Project tasks |

Benefits:

* expresses relationships clearly
* improves API readability
* organizes resources logically

Example Express.js route:

```js
app.get('/users/:id/orders', getUserOrders)
```

Potential downside:

```text id="1k9qwc"
Overly deep nesting increases complexity.
```

Bad example:

```text id="5m3vpa"
/users/1/orders/5/items/2/reviews
```

Best practice:

* keep routes readable
* avoid excessive nesting
* balance clarity and simplicity

<!-- END -->

````id="7x4mqp"

```md id="1p8vza"
<!-- QUESTION -->
difficulty: Hard
tags: route-protection, authentication, backend-security

How are protected routes implemented in backend systems?

<!-- ANSWER -->
Protected routes restrict access to authenticated or authorized users.

Typical flow:

```text
Request → Authentication Middleware → Route Handler
````

Example Express.js route:

```js
app.get('/admin', authMiddleware, adminHandler)
```

Authentication middleware:

```js
function authMiddleware(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).send('Unauthorized')
  }

  next()
}
```

Protected routes commonly verify:

* JWT tokens
* sessions
* API keys
* user roles

Authorization example:

| Role  | Access         |
| ----- | -------------- |
| Admin | Full access    |
| User  | Limited access |

Common protected endpoints:

* admin dashboards
* payment APIs
* user settings
* private data

Route protection is a critical backend security practice.

<!-- END -->