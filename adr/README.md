# Architecture Decision Records

This folder tracks significant, hard-to-reverse architecture decisions for
Stellar Pathfinder, using lightweight ADRs.

## When to write one

Write an ADR when a change:

- Affects how a future phase (see `PRD.md`) will need to integrate with
  existing code
- Establishes a module boundary or dependency direction that other code
  will be written against
- Is likely to be asked about repeatedly in future PR reviews or onboarding

Small refactors, bug fixes, and style-only changes don't need one.

## Process

1. Copy `template.md` to `NNNN-short-title.md`, using the next sequential
   number.
2. Fill it in. Keep it short — a good ADR fits on one screen.
3. Open it in the same PR as the change it documents, or a preceding PR if
   the decision needs discussion first.

## Index

| # | Title | Status |
|---|---|---|
| [0001](0001-keep-routing-engine-framework-agnostic.md) | Keep the routing engine framework-agnostic | Accepted |
