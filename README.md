<div align="center">
  <img src="logo/logo.png" alt="Xeno Shared Logo" width="140" />

  <h1>@xeno-js/shared</h1>

  <p><strong>Domain primitives and application contracts for TypeScript.</strong></p>

  <p>
    Define your domain model, application contracts, and architectural boundaries
    without coupling them to a transport or framework.
  </p>

  <p>
    <a href="https://github.com/xeno-js/xeno-shared">
      <img src="https://img.shields.io/github/stars/xeno-js/xeno-shared?style=flat-square" alt="GitHub Stars" />
    </a>
    <a href="https://www.npmjs.com/package/@xeno-js/shared">
      <img src="https://img.shields.io/npm/v/@xeno-js/shared?style=flat-square" alt="npm version" />
    </a>
    <a href="https://github.com/xeno-js/xeno-shared/blob/develop/LICENSE">
      <img src="https://img.shields.io/npm/l/@xeno-js/shared?style=flat-square" alt="License: ISC" />
    </a>
    <a href="https://buymeacoffee.com/xenojs">
      <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFdd00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
    </a>
  </p>
</div>

---

## What is `@xeno-js/shared`?

`@xeno-js/shared` provides the **domain primitives and framework-neutral
contracts** used across the Xeno ecosystem.

It gives TypeScript applications explicit building blocks for:

- Domain-Driven Design
- aggregates and value objects
- domain events
- entities and domain errors
- Result-based application flows
- CQRS contracts
- repositories and data sources
- application services and policies
- request and execution context
- transactions and infrastructure boundaries

The goal is simple:

> **Keep the meaning of your application explicit in code.**

`@xeno-js/shared` defines the contracts.

`@xeno-js/core` provides the runtime architecture that executes them.

Your HTTP framework, CLI, worker, or other transport remains outside that
boundary.

---

## The Xeno architecture

Xeno separates **what an application means** from **how the application runs**.

```text
┌─────────────────────────────────────────────┐
│              Transport / Host               │
│   HTTP · CLI · Worker · gRPC · Scheduler    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                @xeno-js/core                │
│                                             │
│  DI · scopes · request context · pipelines  │
│  CQRS execution · modules · infrastructure  │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│              @xeno-js/shared                │
│                                             │
│  Domain model · contracts · Result · errors │
│  aggregates · value objects · domain events │
│  application interfaces                     │
└─────────────────────────────────────────────┘
```

This separation lets the domain and application contracts remain independent
from the transport hosting them.

---

## Why Shared?

Most application frameworks start from the transport:

```text
HTTP request
    ↓
controller
    ↓
service
    ↓
database
```

Xeno starts from the application model instead:

```text
Domain
    ↓
Application contracts
    ↓
Execution model
    ↓
Transport
```

That distinction matters when an application grows.

The HTTP layer should not define your domain model.

Your database should not define your application contracts.

And your infrastructure should not become the place where business rules live.

`@xeno-js/shared` provides the primitives and contracts that make those
boundaries explicit.

---

# Domain primitives

## Aggregate roots

`AggregateRoot` provides a base abstraction for aggregates that need:

- an explicit identity
- aggregate versioning
- domain event application
- loading from event history
- tracking of uncommitted domain events.

```ts
import { AggregateRoot } from '@xeno-js/shared'

class UserId {
  // ...
}

type UserEvent =
  | {
      type: 'UserCreated'
      name: string
    }
  | {
      type: 'UserRenamed'
      name: string
    }

class User extends AggregateRoot<UserEvent> {
  private name = ''

  public rename(name: string): void {
    this.raise({
      eventType: 'UserRenamed',
      payload: {
        type: 'UserRenamed',
        name,
      },
    })
  }

  protected apply(event: IDomainEvent<UserEvent>, isNew: boolean): void {
    switch (event.eventType) {
      case 'UserRenamed':
        this.name = event.payload.name
        break
    }
  }
}
```

An aggregate keeps its domain changes explicit:

```text
Aggregate
   │
   ├── identity
   ├── version
   ├── state
   │
   └── uncommitted events
            │
            ▼
       IDomainEvent
```

`AggregateRoot` does not provide an event store. It provides the aggregate-side
primitives required to model and track domain events.

---

## Domain events

`IDomainEvent` defines a framework-neutral representation of an event produced
by an aggregate.

```ts
export interface IDomainEvent<
  TPayload = unknown,
  TValueObject extends object = object,
> {
  readonly aggregateId: TValueObject
  readonly eventType: string
  readonly version: number
  readonly occurredAt: Date
  readonly payload: TPayload
}
```

A domain event carries:

- the aggregate identity
- an explicit event type
- the aggregate version
- the occurrence timestamp
- the event payload.

This makes domain changes representable without coupling the domain model to an
HTTP server, database driver, or message broker.

---

## Value objects

Value objects provide domain concepts whose meaning comes from their value
rather than object identity.

```ts
import { ValueObject } from '@xeno-js/shared'

interface EmailProps {
  value: string
}

class Email extends ValueObject<EmailProps> {
  public static create(value: string): Email {
    return new Email({ value })
  }
}
```

The base implementation provides:

- immutable properties
- value retrieval
- equality comparison
- string representation.

```ts
const first = Email.create('user@example.com')
const second = Email.create('user@example.com')

first.equals(second) // true
```

---

# Application contracts

The package also defines contracts used to keep application code independent
from concrete infrastructure.

These include abstractions for areas such as:

- CQRS
- repositories
- data sources
- services
- factories
- policies
- transactions
- request context
- middleware
- logging
- caching
- storage
- HTTP
- mapping
- idempotency.

The important distinction is between the **contract** and its implementation.

For example:

```text
Application
    │
    │ depends on
    ▼
Repository contract
    │
    │ implemented by
    ▼
Infrastructure adapter
```

The application therefore does not need to know whether data is stored in
PostgreSQL, Supabase, Redis, or another persistence mechanism.

---

# CQRS contracts

`@xeno-js/shared` includes the contracts used to model commands and queries.

```text
Command
   │
   ▼
Application handler
   │
   ▼
Domain
```

and:

```text
Query
   │
   ▼
Application handler
   │
   ▼
Read model / data source
```

The package defines the contracts.

`@xeno-js/core` provides the execution infrastructure around them.

This distinction keeps CQRS from becoming tied to a particular transport.

---

# Result and errors

Application code often needs to represent an expected failure without turning
every business outcome into an exception.

Xeno provides `Result` primitives alongside application/domain errors.

Conceptually:

```text
Operation
   │
   ├── success → Result success
   │
   └── expected failure → Result failure
```

This allows application boundaries to make outcomes explicit while keeping error
handling independent from the HTTP layer.

---

# Runtime utilities

The package also contains shared runtime utilities used across the Xeno
ecosystem.

These include utilities for areas such as:

- runtime guards
- strings
- dates
- enumerables
- GUIDs
- promises
- HTTP helpers
- sanitization
- abort handling
- mathematical helpers.

These utilities are deliberately secondary to the architectural role of the
package.

The purpose of `@xeno-js/shared` is not to be a generic utility collection.

Its primary role is to provide **shared domain and application building
blocks**.

---

# Infrastructure adapters

`@xeno-js/shared` also exports a limited set of reusable infrastructure
components, including integrations and adapters for areas such as:

- HTTP clients
- Supabase authentication
- caching
- storage
- validation
- mapping
- factories.

These are exported as reusable building blocks; they do not define the
architecture of the application.

For applications using `@xeno-js/core`, infrastructure can be composed through
the application architecture rather than becoming part of the domain model.

---

# Framework independent by design

`@xeno-js/shared` does not define an HTTP application lifecycle.

You can model your domain and application contracts without choosing a
particular HTTP framework.

For example:

```text
                 ┌── Fastify
                 │
                 ├── Express
Application ─────┼── Hono
                 │
                 ├── CLI
                 │
                 └── Worker
```

The transport is the host.

The domain and application contracts remain the application model.

---

# Installation

```bash
npm install @xeno-js/shared
```

For the complete Xeno application architecture:

```bash
npm install @xeno-js/core
```

You can use `@xeno-js/shared` independently when you only need the domain and
application building blocks.

---

# `@xeno-js/shared` vs `@xeno-js/core`

The two packages have different responsibilities.

| Package             | Responsibility                                      |
| ------------------- | --------------------------------------------------- |
| `@xeno-js/shared`   | Domain primitives and application contracts         |
| `@xeno-js/core`     | Application runtime and architecture                |
| Your transport      | HTTP, CLI, worker, gRPC, etc.                       |
| Your infrastructure | Database, cache, external services, messaging, etc. |

A useful mental model is:

```text
@xeno-js/shared
    defines the language

        ↓

@xeno-js/core
    executes the architecture

        ↓

your application
    defines the business behavior

        ↓

your transport / infrastructure
    hosts and connects the system
```

---

# What `@xeno-js/shared` is not

`@xeno-js/shared` is not:

- an HTTP framework
- an application server
- an ORM
- an event bus
- an event store
- a complete event-sourcing framework
- a replacement for your transport framework.

It provides the primitives and contracts that let those concerns remain
separated from the domain model.

---

# Design principles

The package follows a few simple principles.

### Explicit contracts

Important application boundaries should be represented by explicit TypeScript
contracts.

### Domain first

Business concepts such as aggregates, value objects and domain events should not
depend on transport details.

### Infrastructure at the boundary

Concrete integrations belong outside the domain model.

### Framework independence

Domain and application contracts should not require a specific HTTP framework.

### Composition over magic

The architecture should be understandable from the code rather than depending on
runtime discovery or hidden conventions.

---

# Relationship with Xeno

The Xeno ecosystem can be understood as three layers:

```text
             Your application
                    │
                    ▼
          ┌───────────────────┐
          │   @xeno-js/core   │
          │                   │
          │ Runtime           │
          │ DI                │
          │ Scopes            │
          │ CQRS execution    │
          │ Pipelines         │
          │ Request context   │
          └─────────┬─────────┘
                    │
                    ▼
          ┌───────────────────┐
          │ @xeno-js/shared   │
          │                   │
          │ Domain            │
          │ Contracts         │
          │ Result / Errors   │
          │ Aggregates        │
          │ Value Objects     │
          │ Domain Events     │
          └───────────────────┘
```

The transport sits around the application rather than defining it.

> **Shared defines the contracts. Core executes the architecture. Your transport
> hosts the application.**

---

# Development

Clone the repository:

```bash
git clone https://github.com/xeno-js/xeno-shared.git
cd xeno-shared
npm install
```

Run the main checks:

```bash
npm run check
```

Available scripts:

| Command                 | Description                  |
| ----------------------- | ---------------------------- |
| `npm run build`         | Build the package            |
| `npm run typecheck`     | Run TypeScript type checking |
| `npm run lint`          | Run ESLint                   |
| `npm run format`        | Format the repository        |
| `npm run format:check`  | Check formatting             |
| `npm run test`          | Run tests                    |
| `npm run test:watch`    | Run tests in watch mode      |
| `npm run test:coverage` | Run tests with coverage      |
| `npm run check`         | Typecheck, lint and test     |
| `npm run changelog`     | Generate the changelog       |

---

# Contributing

Contributions are welcome.

Create a feature or fix branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/your-feature
```

Before opening a pull request:

```bash
npm run check
```

Use Conventional Commits:

```text
feat(domain): add aggregate primitive
fix(result): correct failure handling
refactor(events): simplify event contract
docs(readme): improve architecture documentation
```

Pull requests should target `develop`.

---

# License

ISC License.

Copyright (c) 2026 Xeno.
