---
name: "speckit-constitution"
description: "Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync."
argument-hint: "Principles or values for the project constitution"
compatibility: "Requires spec-kit project structure with .specify/ directory"
metadata:
  author: "github-spec-kit"
  source: "templates/commands/constitution.md"
user-invocable: true
disable-model-invocation: false
---


## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

---

## Project Context — CidadeAtiva API

Use this section as ground truth when filling placeholders or deriving constitution principles. Do NOT ask the user to re-supply any information already described here.

### Application Scope

CidadeAtiva is a **NestJS REST API** that serves as the back-end for public-facing civic dashboards. Its primary purpose is to allow citizens to:
- Register and authenticate.
- Open public solicitations (urban problems like potholes, insufficient street lighting, illegal dumping, etc.).
- Track the resolution status of their solicitations.
- Earn points via "CoolActions" linked to resolved solicitations.
- Be ranked on a public "Cidadão Legal" leaderboard by accumulated points.

Consumers of this API are government-facing front-end clients. The API must be public-friendly, secure, and consistent.

### Architecture

The project follows **Clean Architecture** with strict layer separation enforced by `AGENT.MD`:

| Layer | Responsibility |
|---|---|
| `domain/entities` | Pure business objects — no Prisma, no HTTP |
| `domain/dtos` | Input/output contracts |
| `domain/repositories` | Interfaces only — no ORM imports |
| `domain/useCases` | Single-responsibility application logic |
| `infra/controllers` | Thin HTTP adapters — delegate to use cases |
| `infra/database/prisma` | Repository implementations, mappers |
| `infra/services` | External services (hash, token, email, storage) |
| `modules` | Dependency wiring, route registration |
| `middlewares` | Auth, validation, error handling |
| `gateways` | Third-party integrations |

**Non-negotiable rules:**
- Domain layer MUST NOT import Prisma, NestJS, Express, Axios, or `process.env`.
- Use cases MUST NOT receive `Request`/`Response` objects.
- Controllers MUST NOT access the database directly.
- Repository implementations MUST map ORM models to domain entities before returning.
- Passwords MUST be hashed with bcrypt (salt level 6) before persistence.
- Sensitive fields (passwords, tokens) MUST NEVER be returned in API responses.
- All lists MUST be paginated (default 10 items/page).
- UUIDs V4 MUST be used for all entity IDs.
- Environment variables MUST only be accessed through `src/infra/config/env.ts`.
- Validation occurs at the HTTP boundary using Zod schemas.
- Errors are thrown from use cases as `AppError(message, statusCode)` and converted to HTTP responses by the error middleware.

### Data Model (Prisma — PostgreSQL)

```
Log               — audit trail (userId, userName, email, activityDescription)
User              — citizen account (name, isCouncilman, isAdmin, address, neighborhood, city, uf)
SolicitationType  — category template (description, points) → drives CoolAction rewards
Solicitation      — urban problem report (title, description, neighborhood, city, uf, street,
                    status[not_resolved|in_progress|resolved|unconsidered],
                    unsolvedImageUrls, solvedImageUrls, solvedDate, solvedCommentary, solvedUserId)
                    → belongs to User (requestingUser), SolicitationType
                    → has one CoolAction (1:1), has one DoneCoolAction (1:1)
CoolAction        — reward action generated from a resolved solicitation
                    → belongs to SolicitationType, Solicitation
                    → has many DoneCoolActions
DoneCoolAction    — record of a user performing a cool action
                    → belongs to User, CoolAction, Solicitation (all FK)
PublicPhone       — standalone public contact number
UF                — Brazilian state (has many Cities)
City              — municipality (belongs to UF, has many Neighborhoods)
Neighborhood      — district (belongs to City)
```

PostgreSQL capabilities in force:
- Native enums supported → `SolicitationStatus` can be a Prisma `enum`.
- Native `Json` type supported → image URL arrays (`unsolvedImageUrls`, `solvedImageUrls`) can use `Json` column.
- `DATABASE_URL` format: `postgresql://user:password@localhost:5432/cidade_ativa_db`.

### Key UI Flows (from front-end wireframes)

1. **Painel de solicitações urbanas** — public dashboard showing stats (Total / Pendentes / Em andamento / Resolvidas), a free-text search bar, and filter dropdowns (Bairro, Status, Requerente, Data). Requires: `GET /solicitations` with pagination + filter query params.

2. **Listagem de solicitações** — card list showing solicitation image, title, status badge, description excerpt, address, neighborhood, requester name, creation date, and "Ver detalhes" CTA. Requires: `GET /solicitations?perPage=10&page=1` + filter/sort params.

3. **Detalhe da solicitação** — full record view with protocol number, status, dates, requester, description, commentary, street address, map embed, before/after image galleries. Requires: `GET /solicitations/:id`.

4. **Cidadão Legal ranking** — monthly leaderboard showing rank, avatar, name, total points, registration date, and "Ver ações" CTA. Requires: `GET /users/ranking` or computed from `DoneCoolAction` points aggregation via `SolicitationType.points`.

### Business Rules Summary (from ENDPOINTS-RULES.md)

- A regular user (not councilman, not admin) MUST NOT open a new solicitation if they already have 3+ open solicitations with status ≠ `resolved`.
- Councilman and Admin users bypass the open-solicitation limit.
- A `CoolAction` MUST NOT be created with a duplicate `solicitationTypeId`.
- A `DoneCoolAction` MUST reference a valid `CoolAction` and a valid `User`.
- A `UF` MUST NOT be deleted if it has linked cities.
- A `City` MUST NOT be deleted if it has linked neighborhoods.
- A `SolicitationType` MUST NOT be deleted if linked to a solicitation or cool action.
- Duplicate phone numbers in `PublicPhone` are not allowed.
- Unique city name per UF; unique neighborhood name per city.

### Tech Stack

- **Runtime**: Node.js / TypeScript (strict mode)
- **Framework**: NestJS 11
- **ORM**: Prisma 5 (PostgreSQL)
- **Validation**: Zod + custom `ZodValidationPipe`
- **Error handling**: `AppError` + `AppErrorFilter`
- **Testing**: Jest + fake repository pattern (no real DB in unit tests)
- **Linting**: ESLint + Prettier

---

## Pre-Execution Checks

**Check for extension hooks (before constitution update)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_constitution` key
- If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- When constructing slash commands from hook command names, replace dots (`.`) with hyphens (`-`). For example, `speckit.git.commit` → `/speckit-git-commit`.
- For each executable hook, output the following based on its `optional` flag:
  - **Optional hook** (`optional: true`):
    ```
    ## Extension Hooks

    **Optional Pre-Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **Mandatory hook** (`optional: false`):
    ```
    ## Extension Hooks

    **Automatic Pre-Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}

    Wait for the result of the hook command before proceeding to the Outline.
    ```
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

**Note**: If `.specify/memory/constitution.md` does not exist yet, it should have been initialized from `.specify/templates/constitution-template.md` during project setup. If it's missing, copy the template first.

Follow this execution flow:

1. Load the existing constitution at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
   **IMPORTANT**: The user might require less or more principles than the ones used in the template. If a number is specified, respect that - follow the general template. You will update the doc accordingly.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist (convert prior checklist into active validations):
   - Read `.specify/templates/plan-template.md` and ensure any "Constitution Check" or rules align with updated principles.
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment—update if constitution adds/removes mandatory sections or constraints.
   - Read `.specify/templates/tasks-template.md` and ensure task categorization reflects new or removed principle-driven task types (e.g., observability, versioning, testing discipline).
   - Read each command file in `.specify/templates/commands/*.md` (including this one) to verify no outdated references (agent-specific names like CLAUDE only) remain when generic guidance is required.
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`, or agent-specific guidance files if present). Update references to principles changed.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).

Formatting & Style Requirements:

- Use Markdown headings exactly as in the template (do not demote/promote levels).
- Wrap long rationale lines to keep readability (<100 chars ideally) but do not hard enforce with awkward breaks.
- Keep a single blank line between sections.
- Avoid trailing whitespace.

If the user supplies partial updates (e.g., only one principle revision), still perform validation and version decision steps.

If critical info missing (e.g., ratification date truly unknown), insert `TODO(<FIELD_NAME>): explanation` and include in the Sync Impact Report under deferred items.

Do not create a new template; always operate on the existing `.specify/memory/constitution.md` file.

## Post-Execution Checks

**Check for extension hooks (after constitution update)**:
Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.after_constitution` key
- If the YAML cannot be parsed or is invalid, skip hook checking silently and continue normally
- Filter out hooks where `enabled` is explicitly `false`. Treat hooks without an `enabled` field as enabled by default.
- For each remaining hook, do **not** attempt to interpret or evaluate hook `condition` expressions:
  - If the hook has no `condition` field, or it is null/empty, treat the hook as executable
  - If the hook defines a non-empty `condition`, skip the hook and leave condition evaluation to the HookExecutor implementation
- When constructing slash commands from hook command names, replace dots (`.`) with hyphens (`-`). For example, `speckit.git.commit` → `/speckit-git-commit`.
- For each executable hook, output the following based on its `optional` flag:
  - **Optional hook** (`optional: true`):
    ```
    ## Extension Hooks

    **Optional Hook**: {extension}
    Command: `/{command}`
    Description: {description}

    Prompt: {prompt}
    To execute: `/{command}`
    ```
  - **Mandatory hook** (`optional: false`):
    ```
    ## Extension Hooks

    **Automatic Hook**: {extension}
    Executing: `/{command}`
    EXECUTE_COMMAND: {command}
    ```
- If no hooks are registered or `.specify/extensions.yml` does not exist, skip silently
