````md id="8m2qva"
<!-- QUESTION -->
difficulty: Easy
tags: authentication, authorization, security

What is authentication?

<!-- ANSWER -->
Authentication is the process of verifying the identity of a user or system.

It answers the question:

```text id="3v7xpd"
Who are you?
````

Common authentication methods:

| Method     | Example                |
| ---------- | ---------------------- |
| Passwords  | Username + password    |
| OTP        | SMS/email verification |
| Biometrics | Fingerprint/Face ID    |
| Tokens     | JWT/OAuth              |

Example login flow:

```text
User → Login Credentials → Server → Identity Verification
```

If credentials are valid:

* access is granted
* session/token is created

Authentication is the first step in securing applications.

<!-- END -->

````id="5x1qzt"

```md id="2n7vke"
<!-- QUESTION -->
difficulty: Easy
tags: authorization, security, backend

What is authorization?

<!-- ANSWER -->
Authorization determines what an authenticated user is allowed to access or perform.

It answers the question:

```text id="7m3xqc"
What are you allowed to do?
````

Example:

| User Role | Permission     |
| --------- | -------------- |
| Admin     | Manage users   |
| User      | View profile   |
| Guest     | Limited access |

Example flow:

```text
Authenticated User → Permission Check → Resource Access
```

Authorization commonly controls:

* API access
* admin panels
* file permissions
* database operations

Authorization happens after successful authentication.

<!-- END -->

````id="9p4xma"

```md id="4v8qpd"
<!-- QUESTION -->
difficulty: Easy
tags: authentication, authorization, security-basics

What is the difference between authentication and authorization?

<!-- ANSWER -->
Authentication verifies identity.

Authorization verifies permissions.

Comparison:

| Authentication | Authorization |
|---|---|
| Who are you? | What can you access? |
| Login process | Permission enforcement |
| Verifies identity | Verifies privileges |

Example:

```text
Authentication:
User logs into account

Authorization:
User allowed to access admin dashboard
````

Typical flow:

```text
Login → Authentication → Authorization → Access
```

Both are essential for secure backend systems.

<!-- END -->

````id="1w5qxy"

```md id="7x2vke"
<!-- QUESTION -->
difficulty: Medium
tags: sessions, authentication, backend

How does session-based authentication work?

<!-- ANSWER -->
Session-based authentication stores user state on the server after login.

Flow:

1. user logs in
2. server validates credentials
3. server creates session
4. session ID stored in cookie

Example cookie:

```http
Set-Cookie: session=abc123
````

Future requests include:

```http id="5m8qwc"
Cookie: session=abc123
```

Server checks the session store:

```text
session ID → user data
```

Advantages:

* simple implementation
* centralized session control
* easy logout/invalidation

Disadvantages:

* server-side session storage
* scaling complexity
* session synchronization in distributed systems

Session authentication is common in traditional web applications.

<!-- END -->

````id="6k1xpd"

```md id="3m7qza"
<!-- QUESTION -->
difficulty: Medium
tags: jwt, token-authentication, security

What is JWT authentication?

<!-- ANSWER -->
JWT (JSON Web Token) authentication uses signed tokens to verify users without server-side sessions.

Example JWT structure:

```text
Header.Payload.Signature
````

Authentication flow:

1. user logs in
2. server generates JWT
3. client stores token
4. token sent with requests

Example header:

```http id="2v9qxt"
Authorization: Bearer <jwt>
```

JWT payload may contain:

```json id="7n4xqc"
{
  "userId": 1,
  "role": "admin"
}
```

Advantages:

| Benefit   | Explanation               |
| --------- | ------------------------- |
| Stateless | No server session storage |
| Scalable  | Easier horizontal scaling |
| Portable  | Works across services     |

Disadvantages:

* harder token revocation
* token leakage risks
* larger request headers

JWT is widely used in APIs and microservices.

<!-- END -->

````id="8p2vma"

```md id="5q9xke"
<!-- QUESTION -->
difficulty: Medium
tags: oauth, authentication, api-security

What is OAuth?

<!-- ANSWER -->
OAuth is an authorization framework that allows applications to access user resources without sharing passwords.

Example:

```text
Login with Google
````

OAuth roles:

| Role                 | Purpose           |
| -------------------- | ----------------- |
| Resource Owner       | User              |
| Client               | Application       |
| Authorization Server | Identity provider |
| Resource Server      | API server        |

OAuth flow:

```text
User → Google Login → Access Token → Application
```

Applications receive:

```text id="1x8vyt"
Access Tokens
```

instead of user passwords.

Benefits:

* delegated access
* safer third-party integrations
* centralized identity management

OAuth is commonly used with:

* Google
* GitHub
* Microsoft
* Facebook authentication

<!-- END -->

````id="9m3qpd"

```md id="2v7xza"
<!-- QUESTION -->
difficulty: Hard
tags: rbac, authorization, access-control

What is Role-Based Access Control (RBAC)?

<!-- ANSWER -->
RBAC is an authorization model where permissions are assigned to roles instead of individual users.

Example roles:

| Role | Permissions |
|---|---|
| Admin | Full access |
| Editor | Modify content |
| Viewer | Read-only access |

Example mapping:

```text
User → Role → Permissions
````

Advantages:

* simpler permission management
* scalable access control
* centralized authorization logic

Example:

```text id="8w1qke"
Admin:
Create/Delete Users

Viewer:
Read Content Only
```

Backend systems commonly implement RBAC using:

* middleware
* permission tables
* JWT role claims

RBAC is widely used in enterprise systems.

<!-- END -->

````id="4n6xqc"

```md id="7p1vke"
<!-- QUESTION -->
difficulty: Hard
tags: mfa, authentication, security

What is Multi-Factor Authentication (MFA)?

<!-- ANSWER -->
Multi-Factor Authentication (MFA) requires multiple verification factors during login.

Authentication factors:

| Factor Type | Example |
|---|---|
| Something you know | Password |
| Something you have | Phone/OTP |
| Something you are | Fingerprint |

Example flow:

```text
Password → OTP Verification → Access Granted
````

Benefits:

* stronger security
* reduced account compromise
* protection against stolen passwords

Common MFA methods:

* authenticator apps
* SMS OTP
* hardware security keys
* biometrics

Example TOTP code:

```text id="6m2xqa"
482193
```

MFA is critical for:

* banking systems
* enterprise accounts
* admin dashboards
* cloud infrastructure

<!-- END -->

````id="1k8qwr"

```md id="6x4vpa"
<!-- QUESTION -->
difficulty: Hard
tags: authentication-security, password-storage, hashing

Why should passwords never be stored in plain text?

<!-- ANSWER -->
Plain text password storage is extremely dangerous because leaked databases expose user credentials directly.

Bad example:

```text
password123
````

Instead, passwords should be:

```text id="4m9xyt"
Hashed + Salted
```

Common password hashing algorithms:

| Algorithm    | Status               |
| ------------ | -------------------- |
| bcrypt       | Recommended          |
| Argon2       | Recommended          |
| scrypt       | Recommended          |
| SHA256 alone | Unsafe for passwords |

Example hashing flow:

```text
Password → Hash Function → Stored Hash
```

Benefits:

* passwords are not directly recoverable
* reduces impact of database breaches
* protects user accounts

Important rule:

```text id="9w3qza"
Never implement custom password hashing.
```

Use proven cryptographic libraries instead.

<!-- END -->

````id="5n2xmc"

```md id="3q7vpd"
<!-- QUESTION -->
difficulty: Hard
tags: access-control, authorization, security-vulnerabilities

What is Broken Access Control?

<!-- ANSWER -->
Broken Access Control occurs when users can access resources or actions beyond their intended permissions.

Example vulnerability:

```http
GET /admin/users
````

Accessible by normal users.

Common causes:

| Cause                             | Example                               |
| --------------------------------- | ------------------------------------- |
| Missing authorization checks      | No role validation                    |
| Insecure direct object references | Accessing other users' data           |
| Client-side-only enforcement      | Hidden buttons without backend checks |

Dangerous example:

```http id="7v1xke"
GET /orders/1001
```

Attacker changes:

```http id="4m2qza"
GET /orders/1002
```

and accesses another user's order.

Prevention techniques:

* enforce server-side authorization
* validate ownership
* implement RBAC/ABAC
* deny by default

Broken Access Control is one of the most critical web security vulnerabilities.

<!-- END -->