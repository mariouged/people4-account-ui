# DEV.md — Development Guide

## Prerequisites

- **Node.js** 20 LTS or later
- **npm** 10+

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| UI | React | 19 |
| Routing | React Router | 7 |
| Build & Dev Server | Vite | 6 |
| Test Runner | Vitest | 2 |
| Component Tests | React Testing Library | 16 |

---

## Install dependencies

```bash
npm install
```

---

## Development

Start the local dev server with hot module reload:

```bash
npm run dev
```

Runs at **http://localhost:5173**

---

## Tests

### Watch mode (during development)

```bash
npm test
```

### Single run (CI / pre-commit)

```bash
npm run test:run
```

### With coverage report

```bash
npm run test:coverage
```

Coverage output goes to `coverage/`.  
Feature tests are in `src/__tests__/` — currently the **signup form** is covered.

---

## Production build

Compile and optimise for production:

```bash
npm run build
```

Output goes to `dist/` — minified, tree-shaken, ready to deploy.

### Preview the production build locally

```bash
npm run preview
```

Serves `dist/` at **http://localhost:4173**

---

## Project Structure

```
account-ui/
├── index.html
├── vite.config.js          # Vite + Vitest config
├── vitest.setup.js         # jest-dom matchers setup
├── src/
│   ├── main.jsx            # Entry point
│   ├── App.jsx             # Router + layout
│   ├── App.css             # Global styles
│   ├── services/
│   │   └── api.js          # Mock API — swap for real fetch calls
│   ├── components/
│   │   ├── SignupForm.jsx   # Register (legalName, vatId, domain, email, password)
│   │   ├── SigninForm.jsx   # Login (email, password)
│   │   ├── TwoFactorForm.jsx # 2FA code entry
│   │   └── Dashboard.jsx   # Home (TODO)
│   └── __tests__/
│       └── SignupForm.test.jsx
```

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | — | Redirects to `/signin` |
| `/signin` | `SigninForm` | Email + password login |
| `/signup` | `SignupForm` | Account registration |
| `/two-factor` | `TwoFactorForm` | 2FA code verification |
| `/dashboard` | `Dashboard` | Home (TODO) |

---

## Mock API (`src/services/api.js`)

All functions simulate network latency and return fixed data.  
Replace them with `fetch` calls to the real **account-api** when it is available.

| Function | Future endpoint | Mock behaviour |
|---|---|---|
| `signup(data)` | `POST /accounts` | Succeeds for any valid input; throws 409 for `taken@example.com` |
| `signin(creds)` | `POST /sessions` | Succeeds for any input; throws 401 for `wrong@example.com` |
| `verifyTwoFactor({ code })` | `POST /2fa/verify` | Accepts any 6-digit numeric string |
