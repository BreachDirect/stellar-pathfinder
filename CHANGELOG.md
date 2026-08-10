# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- "Copy details" button on each route card — copies the route path, fee,
  and time as plain text to the clipboard (resolves #21).

### Fixed

- `routingEngine.findRoutes` now validates that `anchors` is an array,
  giving a clear error instead of a cryptic `TypeError` if a future data
  source (e.g. a failed Phase 2 fetch) returns something unexpected.
  (post-audit fix)

## [0.1.0] - 2026-08-02

### Added

- Phase 1 initial build:
  - Vite + React project scaffold
  - Mock anchor dataset (`src/data/mockAnchors.js`)
  - Routing engine (`src/engine/routingEngine.js`): 1-hop and 2-hop route
    discovery, compounded fee calculation across hops, cheapest-first
    ranking
  - `RemittanceForm`, `RouteList`, and `RouteCard` components
  - Responsive styling
  - Routing engine test suite

[Unreleased]: https://github.com/BreachDirect/stellar-pathfinder/compare/47dc4af9e7bc4913849610b82e0b31f3465341bd...HEAD
[0.1.0]: https://github.com/BreachDirect/stellar-pathfinder/commit/47dc4af9e7bc4913849610b82e0b31f3465341bd

> Note: no `v0.1.0` tag/release exists yet at the time of writing. Once one
> is cut, update the links above to point at the tag rather than the raw
> commit SHA.
