# Changelog

All notable changes to Xeno Shared will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.0.html).

## [0.1.6] - 2026-05-27

### Added

- Universal isomorphic primitive types, DTO contracts (`ResponseDto`), and
  unified status/error codes.
- Zero-dependency utility namespaces (`Guards`, `GuidHelper`, `HttpHelper`,
  `DateHelper`, `MathHelper`, `StringHelper`, `PromiseHelper`, `Enumerable`)
  frozen at runtime for maximum performance.
- Base Command and Query abstractions (`Command`, `BaseQuery`) establishing
  foundational CQRS messaging contracts.
- Robust Zod validation utilities and schema integration helpers for strict
  runtime type-checking.
- Composite Base Logger architecture featuring `LoggerUtils.toSafeContext` for
  secure, automated sanitization and PII removal.
- Shared cookie management and agnostic authentication contracts supporting
  multi-platform SSR flows.

### Fixed

- Stabilized safe parsing and circular-reference serialization within
  `StringHelper`.
- Optimized asynchronous jitter and backoff calculations inside `PromiseHelper`
  for thundering herd mitigation.

### Security

- Integrated automated client IP masking and log scrubbing routines to ensure
  strict compliance with privacy standards.
