# Feedback

1. No .env in github
2. Group imports, config vars, instatiating and routes
3. Prefer config var over magic number

```js
// magic!
new Date(+now + 30 * 1000);

// config var
const SESSION_EXPIRATION_TIME_SECONDS = 30;
new Date(+now + SESSION_EXPIRATION_TIME_SECONDS * 1000);
```

4. Assume the user is drunk - therefore validate at the start of each request
5. Prefer early exit on error (no Pyramid of DOOM)

```js
if (req.body.email) {
  if (user) {
    if (passwordmatch === true) {
      // handle happy path
    } else {
      // handle no match
    }
  } else {
    // handle no user
  }
} else {
  // handle  no email
}
```

```js
if (!req.body.email) {
  // handle  no email
}
if (user) {
  // handle no user
}
if (passwordmatch !== true) {
  // handle no match
}

// handle happy path
```

6. Move logic out to dedicated functions

```js
const sessionToken = uuidv4();
const now = new Date();
const expiresAt = new Date(+now + SESSION_EXPIRATION_TIME_SECONDS * 1000);
const sessionData = {
  token: sessionToken,
  email: user.email,
  expiry: expiresAt,
};

const newSession = await prisma.session.create({
  data: sessionData,
});

// prefer

const session = await createSession(user.email);
```
