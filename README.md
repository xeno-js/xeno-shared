<div align="center">
  <img src="logo/logo.png" alt="Xeno Shared Logo" width="140" />

  <h1>Xeno Shared</h1>

  <p><em>Enterprise-grade primitive types, constants, and utilities for the Xeno ecosystem</em></p>

  <p>
    <a href="https://github.com/xeno-js/xeno-js">
      <img src="https://img.shields.io/badge/Powered%20by-Xeno-blueviolet?style=flat-square" alt="Powered by Xeno" />
    </a>
    <a href="https://github.com/xeno-js/xeno-shared/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@xeno-js/shared?style=flat-square" alt="License: ISC" />
    </a>
    <a href="https://www.npmjs.com/package/@xeno-js/shared">
      <img src="https://img.shields.io/npm/v/@xeno-js/shared?style=flat-square" alt="NPM Version" />
    </a>
    <a href="https://buymeacoffee.com/xenojs">
      <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFdd00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
    </a>
  </p>
</div>

---

## What is Xeno Shared?

**Xeno Shared** (`@xeno-js/shared`) is the foundational package for the entire
Xeno framework ecosystem. It acts as the core dependency bridging both the
backend (`@xeno-js/core`) and frontend (`@xeno-js/vue`) implementations.

This package is meticulously designed to provide zero-dependency (where
possible), highly optimized primitives, enforcing structural consistency, type
safety, and architectural boundaries across all Xeno modules. It guarantees that
constants, interfaces, and utilities behave identically whether executed in a
Node.js server or a browser environment.

---

## 💡 Key Features & Offerings

- **Universal Type Definitions**: Centralizes critical `TypeScript` interfaces
  and types (`ResponseDto`, `IPaginatedResult`, `ICommand`, `IQuery`,
  `InjectionToken`) to ensure a unified contract between the client and server.
- **Agnostic Constants**: Exports canonical constants (`STATUS_CODES`,
  `ERROR_CODES`, `LOG_LEVEL`, `REQUEST_TYPE`) preventing magic strings/numbers
  and maintaining unified semantics across the infrastructure.
- **Validation & Guards**: Provides the `Guards` utility object for robust,
  zero-magic runtime type checking and validation (e.g., `isDefined`,
  `isNullOrEmpty`, `isDate`).
- **Resiliency & Async Utilities**: Includes `PromiseHelper` for advanced async
  timing logic (delays, jitter for mitigating thundering herds) and constants
  for `Cockatiel` resilience policies (`RESILIENCE_DEFAULTS`).
- **Security Primitives**: Features `SanitizeHelper` to enforce OWASP guidelines
  against Log Injection (CWE-117) and unsafe URIs.
- **Shared Infrastructural Adapters**: Includes base infrastructural classes and
  mappers (e.g., `ReadDao`, `Repository`, `ConsoleLogger`, `AxiosHttpClient`,
  `SupabaseClaimsMapper`) allowing downstream packages to extend them.

---

## 📦 Installation

This package is typically installed automatically as a dependency of
`@xeno-js/core` or `@xeno-js/vue`. If you need to install it directly for shared
domain logic in a monorepo:

```bash
npm install @xeno-js/shared

```

Xeno uses **Optional Peer Dependencies**. You only install the external
libraries you actually need.

```bash
# Example: Install tools only if you enable them
npm install axios cockatiel zod @supabase/supabase-js

```

---

## 📖 Core Usage Examples

### 1. Unified API Responses

Use `HttpHelper` to generate standardized success and error payloads.

```typescript
import { HttpHelper, STATUS_CODES, ERROR_CODES } from '@xeno-js/shared'

// Success Response
const response = HttpHelper.success(
  { id: 1, name: 'Xeno' },
  STATUS_CODES.CREATED,
)

// Error Response
const errorResponse = HttpHelper.error(
  {
    success: false,
    error: {
      code: ERROR_CODES.VALIDATION_FAILED,
      message: 'Invalid input provided',
    },
    correlationId: '...',
    requestId: '...',
    spanId: '...',
    timestamp: new Date().toISOString(),
  },
  STATUS_CODES.BAD_REQUEST,
)
```

### 2. Runtime Type Guards

Use the `Guards` namespace to ensure bulletproof runtime checks.

```typescript
import { Guards } from '@xeno-js/shared'

function processData(payload: unknown) {
  if (Guards.isNullOrEmpty(payload)) {
    throw new Error('Payload cannot be empty')
  }

  if (Guards.isString(payload)) {
    console.log(payload.toUpperCase())
  }
}
```

### 3. Asynchronous Jitter

Use `PromiseHelper` to stagger requests and avoid network congestion.

```typescript
import { PromiseHelper } from '@xeno-js/shared'

async function fetchWithRetry() {
  const BASE_DELAY = 100
  const MAX_JITTER = 50

  // Wait for 100ms + a random value up to 50ms
  await PromiseHelper.delayWithJitter(BASE_DELAY, MAX_JITTER)
  return performNetworkCall()
}
```

---

## 🤝 For Contributors

We welcome contributions to Xeno! To maintain the highest code quality and
stability of the core framework, **direct pushes to the `main` and `develop`
branches are strictly prohibited.** Please follow this Git Flow to contribute:

1. **Branch off from `develop**`: Create a new branch for your feature or
   bugfix.

```bash
git checkout develop
git pull origin develop
git checkout -b feat/your-awesome-feature

```

2. **Make your changes**: Write your code and ensure it passes all local checks
   (linting, types, and tests).

```bash
npm run check

```

3. **Commit your changes**: We enforce
   [Conventional Commits](https://www.conventionalcommits.org/?utm_source=gemini).
   Husky will verify your commit message format.

4. **Commit Format:**

```bash
feat(scope): add new feature
fix(scope): resolve bug
chore(scope): update dependencies

```

5. **Submit a Pull Request (PR)**: Push your branch to GitHub and open a Pull
   Request targeting the **`develop`** branch.
6. **Review**: The repository owner will review your code, run pipeline tests,
   and merge it into `develop`.

_Note: The `main` branch is strictly reserved for production releases. Code
flows from feature branches ➡️ `develop` ➡️ `main`._

### Scripts

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run build`     | Builds the TypeScript source code into `dist/`<br> |
| `npm run typecheck` | Checks types without emitting files                |

| | `npm run lint` | Runs ESLint

| | `npm run format` | Formats code with Prettier

| | `npm run test` | Runs the Vitest test suite

| | `npm run test:coverage` | Runs tests and generates a coverage report

|

### Code Quality (Husky & Git Hooks)

This project strictly enforces code quality rules before pushing to the
repository:

- **`pre-commit`**: Runs `lint-staged` on staged files (ESLint + Prettier).

- **`commit-msg`**: Checks commit messages with `commitlint` (we use
  Conventional Commits).

- **`pre-push`**: Runs type checking, linting, and testing before code leaves
  your machine.

---

## 🌱 Support & Appreciation

Building, benchmarking, and maintaining a progressive, enterprise-ready
open-source framework requires a massive amount of continuous dedication and
architectural engineering.

If Xeno has brought value to your development workflows, helped decouple your
core business logic, or simplified your system infrastructure layout, consider
supporting its open-source lifecycle. Your backing directly accelerates our
strategic roadmap.

**[Read our support guidelines and find out how to help](https://www.xeno-js.it/support-us)**

Thank you for being part of this decoupled open-source journey!

<amp-bounce>
</amp-bounce>
<a href="https://www.buymeacoffee.com/xenojs" target="_blank">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="42" style="height: 42px !important;" />
</a>

---

## 🛡️ Powered by Xeno

If you are using Xeno in your project, let the world know! Add this badge to
your README:

```html
<a
  href="[https://github.com/xeno-js/xeno-js](https://github.com/xeno-js/xeno-js)"
  target="_blank"
>
  <img
    src="[https://img.shields.io/badge/Powered%20by-Xeno-black?style=flat-square](https://img.shields.io/badge/Powered%20by-Xeno-black?style=flat-square)"
    alt="Powered by Xeno"
    height="20"
  />
</a>
```

## 📄 License

Copyright (c) 2026 Xeno. Licensed under the
[ISC License](https://www.google.com/search?q=LICENSE&utm_source=gemini).
