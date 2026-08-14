# Facebook login — how it works and how it was set up

Set up August 2026. Google login uses the identical mechanism; only the provider
name and the credentials differ.

---

## 1. The idea

The site never talks to Facebook directly. **Supabase Auth sits in the middle** and
does all the work. Our code doesn't handle tokens, doesn't hold the app secret, and
doesn't have a server of its own.

```
Browser  ──1──▶  Supabase  ──2──▶  Facebook
                                      │
Browser  ◀──4──  Supabase  ◀──3──────┘
```

1. User clicks "გაგრძელება Facebook-ით". `oauthSignIn('facebook')` in
   `src/context/AuthContext.jsx` calls `supabase.auth.signInWithOAuth()`. This does
   **not** contact Facebook — it just redirects the browser to Supabase.
2. Supabase redirects on to facebook.com, identifying the app by its **App ID** and
   asking for the `public_profile` and `email` permissions.
3. The user approves. Facebook redirects back to **Supabase's** callback URL with a
   one-time code. Supabase exchanges that code for the user's profile using the
   **App secret**, server-to-server.
4. Supabase creates the account (first time) or finds it, then sends the browser
   back to our site with a session attached.

**The single most important consequence:** Facebook only ever needs to know
Supabase's address. Our own site URL never appears in the Facebook configuration.
Changing hosts cannot break the handshake.

The App secret lives only in Supabase's dashboard. It is never in the repo, never in
`.env`, and never in the browser bundle — because step 3 happens on Supabase's
servers, not ours.

---

## 2. What we configured, and where

### Meta (developers.facebook.com) — app "G&M accessories", App ID `881117698411354`

| Where | Setting | Value |
|---|---|---|
| App settings → Basic | App ID / App secret | copied into Supabase |
| App settings → Basic | App domains | `g-maccessories.vercel.app` (bare host, no scheme) |
| App settings → Basic | Privacy policy URL | `https://g-maccessories.vercel.app/privacy.html` |
| App settings → Basic | Data deletion instructions URL | `https://g-maccessories.vercel.app/privacy.html#delete` |
| App settings → Basic | Category | საყიდლები (Shopping) |
| Use cases → Customize → Settings | **Valid OAuth Redirect URIs** | `https://vuyclkuwgesbacfwbrvx.supabase.co/auth/v1/callback` |
| Use cases → Customize → Permissions | `public_profile`, `email` | both added |

### Supabase — project `vuyclkuwgesbacfwbrvx`

**Authentication → Providers → Facebook**
- Enabled
- Facebook client ID = the Meta App ID
- Facebook secret = the Meta App secret
- **Allow users without an email: ON** — see §4

**Authentication → URL Configuration**
- Site URL: `https://g-maccessories.vercel.app`
- Redirect URLs: the same, plus `http://localhost:5173`

This second block is what our own `redirectTo` is checked against. `oauthSignIn`
passes `redirectTo: window.location.origin`, so whatever origin the user is on must
appear in this allow list or Supabase drops them on the Site URL instead.

### Code

Nothing was written for Facebook specifically. `AuthModal.jsx` calls
`oauthSignIn('facebook')`; `AuthContext.jsx` passes the provider name straight
through to Supabase. Adding a provider is pure configuration.

---

## 3. Problems we hit, and what they meant

Each failure happens at a different point in the chain, so **the URL in the address
bar when it breaks identifies the culprit**.

### `{"error":"requested path is invalid"}`

Cause: the Site URL and Redirect URL had been entered as `g-maccessories.vercel.app`
with **no `https://`**. Supabase can't parse a URL without a scheme, so nothing
matched the allow list.

Fix: always include the scheme. Compare against the entries that already worked —
`http://localhost:5173` and `https://gm-accessories.netlify.app` both have one.

### `Invalid Scopes: email`

Cause: under Meta's "Use cases" system, `public_profile` is granted automatically but
**`email` must be added explicitly**. Supabase asks for `email` by default, and
Facebook rejected the request.

Fix: Use cases → Customize → Permissions → **Add** on the `email` row. No app review
needed; both are standard-access permissions.

Note: this error appearing is actually a *good* sign — it means the App ID and the
redirect URI were already correct, since Facebook got far enough to evaluate the
requested permissions.

---

## 4. "Allow users without an email"

Some Facebook accounts have no email address (people who signed up with only a phone
number). With this **off**, those users cannot log in at all — they hit a generic
error and leave. With it **on** they get an account with no email recorded.

We turned it on, because the code already copes:

- `supabase/functions/notify-order/index.ts` sets `reply_to: customerEmail ?? undefined`
- the email row in the notification is rendered by `contactRow`, which emits nothing
  when the value is empty
- the cart form requires **name and phone** before an order can be submitted, so
  there is always a way to reach the customer

---

## 5. Development mode vs published

The Facebook app is currently **unpublished** (Development mode).

This restricts **only the Facebook login button**, and only to accounts listed under
Meta → **App roles**. The website itself is fully public — anyone can browse, use
Google login, and place orders. This is a common source of confusion.

To let someone else test Facebook login: App roles → Roles → Add People → Tester.
They must **accept the invitation on Facebook** before it takes effect.

Publishing requires: app icon (1024×1024), category, privacy policy URL, data
deletion URL, and business verification.

---

## 6. Verifying it worked

Facebook login creates a row in `auth.identities` with `provider = 'facebook'`:

```sql
select u.email,
       i.provider,
       i.last_sign_in_at,
       (i.identity_data->>'email') is not null as provider_returned_email,
       i.identity_data->>'name' as name_from_provider
from auth.users u
join auth.identities i on i.user_id = u.id
order by i.last_sign_in_at desc;
```

`provider_returned_email` is worth checking — Facebook can withhold the email even
when the permission is granted, and order notifications use it as the reply-to.

### One known wrinkle

Accounts are keyed by email address. A customer who signs in with Google and later
with Facebook using a *different* email gets **two separate accounts**, with separate
carts and order histories — and will likely think their order disappeared. Not
currently handled; Supabase supports linking identities if it becomes a problem.
