---
name: "speckit-tasks"
description: "Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts."
argument-hint: "Optional task generation constraints"
compatibility: "Requires spec-kit project structure with .specify/ directory"
metadata:
  author: "github-spec-kit"
  source: "templates/commands/tasks.md"
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

Use this section as authoritative ground truth when generating tasks. Do NOT ask the user to re-supply anything captured here.

### Canonical Task Sequence (Clean Architecture)

Every new entity feature MUST generate tasks in this exact order. This sequence is derived from `AGENT.MD` "Default Flow for New Features" and enforces correct dependency resolution.

```
STEP 1 — DTO(s)
  T___ [P] Create <Action><Entity>DTO in src/domain/dtos/<Action><Entity>DTO.ts
       (Create, Update, Response — one task per DTO)

STEP 2 — Entity
  T___ Create <Entity> entity class in src/domain/entities/<Entity>.ts
       (pure class, no Prisma, no HTTP — includes business-rule methods)

STEP 3 — Repository Interface
  T___ Create I<Entity>Repository interface in src/domain/repositories/I<Entity>Repository.ts
       (only the methods the use cases actually need)

STEP 4 — Use Cases (one task per use case; all parallelizable once step 3 is done)
  T___ [P] Create <Action><Entity>UseCase in src/domain/useCases/<action><Entity>/<Action><Entity>UseCase.ts
  T___ [P] Create <Action><Entity>UseCase.spec.ts  (if TDD requested)

  Standard use cases per entity:
    Create<Entity>UseCase
    Update<Entity>UseCase
    Delete<Entity>UseCase
    FindById<Entity>UseCase
    List<Entity>UseCase     (paginated)

STEP 5 — Prisma Repository Implementation
  T___ Create Prisma<Entity>Repository in src/infra/database/prisma/Prisma<Entity>Repository.ts
       (implements I<Entity>Repository; maps Prisma model → domain entity)

STEP 6 — Validation Schema
  T___ [P] Create Zod schemas in src/infra/validation/schemas/<entity>Schemas.ts
       (create<Entity>Schema, update<Entity>Schema — used by ZodValidationPipe)

STEP 7 — Controller
  T___ Create <Entity>Controller in src/infra/controllers/<Entity>Controller.ts
       (thin; calls use cases; uses buildResponse() for all responses)

STEP 8 — Module
  T___ Create <entity>.module.ts in src/modules/<entity>/<entity>.module.ts
       (wires: repository → use cases → controller; registers routes)

STEP 9 — Register in AppModule
  T___ Register <Entity>Module in src/app.module.ts

STEP 10 — Prisma Schema (if new model required)
  T___ Add <Entity> model to prisma/schema.prisma
  T___ Run npx prisma db push && npx prisma generate
```

### Dependency Rules for Parallelization

| Can run in parallel | Depends on |
|---|---|
| DTOs (step 1) | Nothing — start here |
| Entity (step 2) | DTOs |
| Repository Interface (step 3) | Entity + DTOs |
| All Use Cases (step 4) | Repository Interface |
| Prisma Repository (step 5) | Repository Interface + Prisma schema |
| Validation Schemas (step 6) | DTOs |
| Controller (step 7) | All Use Cases + Validation Schemas |
| Module (step 8) | Controller + Prisma Repository |
| AppModule registration (step 9) | Module |

Steps 4 (multiple use cases) and 6 are always `[P]` relative to each other.
Steps 1 (multiple DTOs) are always `[P]` relative to each other.

### File Path Conventions

| Artifact | Path pattern |
|---|---|
| DTO | `src/domain/dtos/<Action><Entity>DTO.ts` |
| Entity | `src/domain/entities/<Entity>.ts` |
| Repository interface | `src/domain/repositories/I<Entity>Repository.ts` |
| Use case | `src/domain/useCases/<camelAction><Entity>/<Action><Entity>UseCase.ts` |
| Use case spec | `src/domain/useCases/<camelAction><Entity>/<Action><Entity>UseCase.spec.ts` |
| Prisma repository | `src/infra/database/prisma/Prisma<Entity>Repository.ts` |
| Validation schema | `src/infra/validation/schemas/<camelEntity>Schemas.ts` |
| Controller | `src/infra/controllers/<Entity>Controller.ts` |
| Module | `src/modules/<camelEntity>/<camelEntity>.module.ts` |
| App module | `src/app.module.ts` |
| Prisma schema | `prisma/schema.prisma` |
| Response helper | `src/infra/helpers/apiResponse.ts` |
| Env config | `src/infra/config/env.ts` |

### API Response Requirement

Every controller method MUST use `buildResponse()` — tasks must include this explicitly:

```ts
// success
return buildResponse({ res: result, success: true, status: 201, path: req.path });

// error (via AppErrorFilter — no manual buildResponse needed)
throw new AppError('Not found', 404);
```

The `ApiResponse<T>` shape: `{ RES, MSG, SUCCESS, TIMESTAMP, PATH, STATUS }`.

### Existing Entities (already implemented — do NOT regenerate)

`Log` — fully implemented with all use cases, controller, module, and Prisma repository.
Use it as a reference when generating tasks for new entities.

### PostgreSQL Capabilities to leverage in setup tasks

When a new Prisma model is added:
- Array fields (`imageUrls`, etc.) → `Json` column type (PostgreSQL native JSON supported)
- Status fields → Prisma `enum` type (PostgreSQL native enums supported)
- `DATABASE_URL` format: `postgresql://user:password@localhost:5432/cidade_ativa_db`
- Always include `npx prisma db push && npx prisma generate` as a sequential task after any schema change

### Task Labels Reference

| Label | Meaning |
|---|---|
| `[P]` | Parallelizable — can run concurrently with other `[P]` tasks at same phase |
| `[US1]`, `[US2]`… | Maps to User Story N from spec.md |
| No label | Sequential — must complete before next task begins |

---

## Pre-Execution Checks

**Check for extension hooks (before tasks generation)**:
- Check if `.specify/extensions.yml` exists in the project root.
- If it exists, read it and look for entries under the `hooks.before_tasks` key
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

1. **Setup**: Run `.specify/scripts/bash/setup-tasks.sh --json` from repo root and parse FEATURE_DIR, TASKS_TEMPLATE, and AVAILABLE_DOCS list. `FEATURE_DIR` and `TASKS_TEMPLATE` must be absolute paths when provided. `AVAILABLE_DOCS` is a list of document names/relative paths available under `FEATURE_DIR` (for example `research.md` or `contracts/`). For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load design documents**: Read from FEATURE_DIR:
   - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
   - **Optional**: data-model.md (entities), contracts/ (interface contracts), research.md (decisions), quickstart.md (test scenarios)
   - Note: Not all projects have all documents. Generate tasks based on what's available.

3. **Execute task generation workflow**:
   - Load plan.md and extract tech stack, libraries, project structure
   - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
   - If data-model.md exists: Extract entities and map to user stories
   - If contracts/ exists: Map interface contracts to user stories
   - If research.md exists: Extract decisions for setup tasks
   - Generate tasks organized by user story (see Task Generation Rules below)
   - Generate dependency graph showing user story completion order
   - Create parallel execution examples per user story
   - Validate task completeness (each user story has all needed tasks, independently testable)

4. **Generate tasks.md**: Read the tasks template from TASKS_TEMPLATE (from the JSON output above) and use it as structure. If TASKS_TEMPLATE is empty, fall back to `.specify/templates/tasks-template.md`. Fill with:
   - Correct feature name from plan.md
   - Phase 1: Setup tasks (project initialization)
   - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
   - Phase 3+: One phase per user story (in priority order from spec.md)
   - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
   - Final Phase: Polish & cross-cutting concerns
   - All tasks must follow the strict checklist format (see Task Generation Rules below)
   - Clear file paths for each task
   - Dependencies section showing story completion order
   - Parallel execution examples per story
   - Implementation strategy section (MVP first, incremental delivery)

5. **Report**: Output path to generated tasks.md and summary:
   - Total task count
   - Task count per user story
   - Parallel opportunities identified
   - Independent test criteria for each story
   - Suggested MVP scope (typically just User Story 1)
   - Format validation: Confirm ALL tasks follow the checklist format (checkbox, ID, labels, file paths)

6. **Check for extension hooks**: After tasks.md is generated, check if `.specify/extensions.yml` exists in the project root.
   - If it exists, read it and look for entries under the `hooks.after_tasks` key
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

Context for task generation: $ARGUMENTS

The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

## Task Generation Rules

**CRITICAL**: Tasks MUST be organized by user story to enable independent implementation and testing.

**Tests are OPTIONAL**: Only generate test tasks if explicitly requested in the feature specification or if user requests TDD approach.

### Checklist Format (REQUIRED)

Every task MUST strictly follow this format:

```text
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
3. **[P] marker**: Include ONLY if task is parallelizable (different files, no dependencies on incomplete tasks)
4. **[Story] label**: REQUIRED for user story phase tasks only
   - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
   - Setup phase: NO story label
   - Foundational phase: NO story label  
   - User Story phases: MUST have story label
   - Polish phase: NO story label
5. **Description**: Clear action with exact file path

**Examples**:

- ✅ CORRECT: `- [ ] T001 Create project structure per implementation plan`
- ✅ CORRECT: `- [ ] T005 [P] Implement authentication middleware in src/middleware/auth.py`
- ✅ CORRECT: `- [ ] T012 [P] [US1] Create User model in src/models/user.py`
- ✅ CORRECT: `- [ ] T014 [US1] Implement UserService in src/services/user_service.py`
- ❌ WRONG: `- [ ] Create User model` (missing ID and Story label)
- ❌ WRONG: `T001 [US1] Create model` (missing checkbox)
- ❌ WRONG: `- [ ] [US1] Create User model` (missing Task ID)
- ❌ WRONG: `- [ ] T001 [US1] Create model` (missing file path)

### Task Organization

1. **From User Stories (spec.md)** - PRIMARY ORGANIZATION:
   - Each user story (P1, P2, P3...) gets its own phase
   - Map all related components to their story:
     - Models needed for that story
     - Services needed for that story
     - Interfaces/UI needed for that story
     - If tests requested: Tests specific to that story
   - Mark story dependencies (most stories should be independent)

2. **From Contracts**:
   - Map each interface contract → to the user story it serves
   - If tests requested: Each interface contract → contract test task [P] before implementation in that story's phase

3. **From Data Model**:
   - Map each entity to the user story(ies) that need it
   - If entity serves multiple stories: Put in earliest story or Setup phase
   - Relationships → service layer tasks in appropriate story phase

4. **From Setup/Infrastructure**:
   - Shared infrastructure → Setup phase (Phase 1)
   - Foundational/blocking tasks → Foundational phase (Phase 2)
   - Story-specific setup → within that story's phase

### Phase Structure

- **Phase 1**: Setup (project initialization)
- **Phase 2**: Foundational (blocking prerequisites - MUST complete before user stories)
- **Phase 3+**: User Stories in priority order (P1, P2, P3...)
  - Within each story: Tests (if requested) → Models → Services → Endpoints → Integration
  - Each phase should be a complete, independently testable increment
- **Final Phase**: Polish & Cross-Cutting Concerns

---

## Complete Project Task List

This is the **canonical master task list** for building the entire CidadeAtiva API. Use this as the implementation backlog. Tasks marked `[P]` within the same phase can run in parallel. Each phase must be fully complete before the next phase begins.

---

### Phase 0 — Infrastructure & Auth Setup

- [ ] T001 Install runtime dependencies: `npm install @nestjs/jwt @nestjs/passport @nestjs/config passport passport-jwt bcryptjs`
- [ ] T002 Install dev dependencies: `npm install -D @types/passport-jwt @types/bcryptjs`
- [ ] T003 Migrate Prisma schema provider from `sqlite` to `postgresql` in prisma/schema.prisma
- [ ] T004 Add `SolicitationStatus` enum (`not_resolved`, `in_progress`, `resolved`, `unconsidered`) to prisma/schema.prisma
- [ ] T005 Update `unsolvedImageUrls` and `solvedImageUrls` fields to `Json` type in prisma/schema.prisma
- [ ] T006 Update `DATABASE_URL` in .env and .env.example to PostgreSQL format (`postgresql://user:password@localhost:5432/cidade_ativa_db`)
- [ ] T007 Add `JWT_PUBLIC_KEY` and `JWT_PRIVATE_KEY` (RS256 base64) vars to .env and .env.example
- [ ] T008 Run `npx prisma db push && npx prisma generate`
- [ ] T009 Update `src/infra/config/env.ts` to expose `JWT_PUBLIC_KEY`, `JWT_PRIVATE_KEY`, and `PORT`
- [ ] T010 Create `buildResponse` helper in `src/infra/helpers/apiResponse.ts`
- [ ] T011 Update `src/middlewares/appErrorFilter.ts` to return the `ApiResponse` envelope via `buildResponse`
- [ ] T012 [P] Create `JwtUserStrategy` (strategy name `jwt-user`, RS256) in `src/infra/auth/strategies/JwtUserStrategy.ts`
- [ ] T013 [P] Create `JwtAdminStrategy` (strategy name `jwt-admin`, RS256, throws if `!payload.isAdmin`) in `src/infra/auth/strategies/JwtAdminStrategy.ts`
- [ ] T014 [P] Create `JwtUserGuard` in `src/infra/auth/guards/JwtUserGuard.ts`
- [ ] T015 [P] Create `JwtAdminGuard` in `src/infra/auth/guards/JwtAdminGuard.ts`

---

### Phase 1 — SolicitationType CRUD

- [ ] T016 [P] Create `CreateSolicitationTypeDTO` in `src/domain/dtos/CreateSolicitationTypeDTO.ts`
- [ ] T017 [P] Create `UpdateSolicitationTypeDTO` in `src/domain/dtos/UpdateSolicitationTypeDTO.ts`
- [ ] T018 [P] Create `SolicitationTypeResponseDTO` in `src/domain/dtos/SolicitationTypeResponseDTO.ts`
- [ ] T019 Create `SolicitationType` entity in `src/domain/entities/SolicitationType.ts`
- [ ] T020 Create `ISolicitationTypeRepository` in `src/domain/repositories/ISolicitationTypeRepository.ts`
- [ ] T021 [P] Create `CreateSolicitationTypeUseCase` in `src/domain/useCases/createSolicitationType/CreateSolicitationTypeUseCase.ts`
- [ ] T022 [P] Create `UpdateSolicitationTypeUseCase` in `src/domain/useCases/updateSolicitationType/UpdateSolicitationTypeUseCase.ts`
- [ ] T023 [P] Create `DeleteSolicitationTypeUseCase` (blocks if linked to solicitation or cool action) in `src/domain/useCases/deleteSolicitationType/DeleteSolicitationTypeUseCase.ts`
- [ ] T024 [P] Create `FindSolicitationTypeByIdUseCase` in `src/domain/useCases/findSolicitationTypeById/FindSolicitationTypeByIdUseCase.ts`
- [ ] T025 [P] Create `ListSolicitationTypesUseCase` in `src/domain/useCases/listSolicitationTypes/ListSolicitationTypesUseCase.ts`
- [ ] T026 Create `PrismaSolicitationTypeRepository` in `src/infra/database/prisma/PrismaSolicitationTypeRepository.ts`
- [ ] T027 [P] Create `solicitationTypeSchemas` (Zod) in `src/infra/validation/schemas/solicitationTypeSchemas.ts`
- [ ] T028 Create `SolicitationTypeController` in `src/infra/controllers/SolicitationTypeController.ts`
- [ ] T029 Create `solicitationType.module.ts` in `src/modules/solicitationType/solicitationType.module.ts`

---

### Phase 2 — PublicPhone CRUD

- [ ] T030 [P] Create `CreatePublicPhoneDTO` in `src/domain/dtos/CreatePublicPhoneDTO.ts`
- [ ] T031 [P] Create `UpdatePublicPhoneDTO` in `src/domain/dtos/UpdatePublicPhoneDTO.ts`
- [ ] T032 [P] Create `PublicPhoneResponseDTO` in `src/domain/dtos/PublicPhoneResponseDTO.ts`
- [ ] T033 Create `PublicPhone` entity in `src/domain/entities/PublicPhone.ts`
- [ ] T034 Create `IPublicPhoneRepository` in `src/domain/repositories/IPublicPhoneRepository.ts`
- [ ] T035 [P] Create `CreatePublicPhoneUseCase` (blocks duplicate phone number) in `src/domain/useCases/createPublicPhone/CreatePublicPhoneUseCase.ts`
- [ ] T036 [P] Create `UpdatePublicPhoneUseCase` in `src/domain/useCases/updatePublicPhone/UpdatePublicPhoneUseCase.ts`
- [ ] T037 [P] Create `DeletePublicPhoneUseCase` in `src/domain/useCases/deletePublicPhone/DeletePublicPhoneUseCase.ts`
- [ ] T038 [P] Create `FindPublicPhoneByIdUseCase` in `src/domain/useCases/findPublicPhoneById/FindPublicPhoneByIdUseCase.ts`
- [ ] T039 [P] Create `ListPublicPhonesUseCase` in `src/domain/useCases/listPublicPhones/ListPublicPhonesUseCase.ts`
- [ ] T040 Create `PrismaPublicPhoneRepository` in `src/infra/database/prisma/PrismaPublicPhoneRepository.ts`
- [ ] T041 [P] Create `publicPhoneSchemas` (Zod) in `src/infra/validation/schemas/publicPhoneSchemas.ts`
- [ ] T042 Create `PublicPhoneController` in `src/infra/controllers/PublicPhoneController.ts`
- [ ] T043 Create `publicPhone.module.ts` in `src/modules/publicPhone/publicPhone.module.ts`

---

### Phase 3 — UF CRUD

- [ ] T044 [P] Create `CreateUFDTO` in `src/domain/dtos/CreateUFDTO.ts`
- [ ] T045 [P] Create `UpdateUFDTO` in `src/domain/dtos/UpdateUFDTO.ts`
- [ ] T046 [P] Create `UFResponseDTO` in `src/domain/dtos/UFResponseDTO.ts`
- [ ] T047 Create `UF` entity in `src/domain/entities/UF.ts`
- [ ] T048 Create `IUFRepository` in `src/domain/repositories/IUFRepository.ts`
- [ ] T049 [P] Create `CreateUFUseCase` (blocks duplicate name) in `src/domain/useCases/createUF/CreateUFUseCase.ts`
- [ ] T050 [P] Create `UpdateUFUseCase` in `src/domain/useCases/updateUF/UpdateUFUseCase.ts`
- [ ] T051 [P] Create `DeleteUFUseCase` (blocks if has linked cities) in `src/domain/useCases/deleteUF/DeleteUFUseCase.ts`
- [ ] T052 [P] Create `FindUFByIdUseCase` in `src/domain/useCases/findUFById/FindUFByIdUseCase.ts`
- [ ] T053 [P] Create `ListUFsUseCase` in `src/domain/useCases/listUFs/ListUFsUseCase.ts`
- [ ] T054 Create `PrismaUFRepository` in `src/infra/database/prisma/PrismaUFRepository.ts`
- [ ] T055 [P] Create `ufSchemas` (Zod) in `src/infra/validation/schemas/ufSchemas.ts`
- [ ] T056 Create `UFController` in `src/infra/controllers/UFController.ts`
- [ ] T057 Create `uf.module.ts` in `src/modules/uf/uf.module.ts`

---

### Phase 4 — City CRUD _(depends on Phase 3 — UF)_

- [ ] T058 [P] Create `CreateCityDTO` in `src/domain/dtos/CreateCityDTO.ts`
- [ ] T059 [P] Create `UpdateCityDTO` in `src/domain/dtos/UpdateCityDTO.ts`
- [ ] T060 [P] Create `CityResponseDTO` in `src/domain/dtos/CityResponseDTO.ts`
- [ ] T061 Create `City` entity in `src/domain/entities/City.ts`
- [ ] T062 Create `ICityRepository` in `src/domain/repositories/ICityRepository.ts`
- [ ] T063 [P] Create `CreateCityUseCase` (blocks duplicate name per UF, validates ufId) in `src/domain/useCases/createCity/CreateCityUseCase.ts`
- [ ] T064 [P] Create `UpdateCityUseCase` in `src/domain/useCases/updateCity/UpdateCityUseCase.ts`
- [ ] T065 [P] Create `DeleteCityUseCase` (blocks if has linked neighborhoods) in `src/domain/useCases/deleteCity/DeleteCityUseCase.ts`
- [ ] T066 [P] Create `FindCityByIdUseCase` in `src/domain/useCases/findCityById/FindCityByIdUseCase.ts`
- [ ] T067 [P] Create `ListCitiesUseCase` (supports `?ufId` filter) in `src/domain/useCases/listCities/ListCitiesUseCase.ts`
- [ ] T068 Create `PrismaCityRepository` in `src/infra/database/prisma/PrismaCityRepository.ts`
- [ ] T069 [P] Create `citySchemas` (Zod) in `src/infra/validation/schemas/citySchemas.ts`
- [ ] T070 Create `CityController` in `src/infra/controllers/CityController.ts`
- [ ] T071 Create `city.module.ts` in `src/modules/city/city.module.ts`

---

### Phase 5 — Neighborhood CRUD _(depends on Phase 4 — City)_

- [ ] T072 [P] Create `CreateNeighborhoodDTO` in `src/domain/dtos/CreateNeighborhoodDTO.ts`
- [ ] T073 [P] Create `UpdateNeighborhoodDTO` in `src/domain/dtos/UpdateNeighborhoodDTO.ts`
- [ ] T074 [P] Create `NeighborhoodResponseDTO` in `src/domain/dtos/NeighborhoodResponseDTO.ts`
- [ ] T075 Create `Neighborhood` entity in `src/domain/entities/Neighborhood.ts`
- [ ] T076 Create `INeighborhoodRepository` in `src/domain/repositories/INeighborhoodRepository.ts`
- [ ] T077 [P] Create `CreateNeighborhoodUseCase` (blocks duplicate name per City, validates cityId) in `src/domain/useCases/createNeighborhood/CreateNeighborhoodUseCase.ts`
- [ ] T078 [P] Create `UpdateNeighborhoodUseCase` in `src/domain/useCases/updateNeighborhood/UpdateNeighborhoodUseCase.ts`
- [ ] T079 [P] Create `DeleteNeighborhoodUseCase` in `src/domain/useCases/deleteNeighborhood/DeleteNeighborhoodUseCase.ts`
- [ ] T080 [P] Create `FindNeighborhoodByIdUseCase` in `src/domain/useCases/findNeighborhoodById/FindNeighborhoodByIdUseCase.ts`
- [ ] T081 [P] Create `ListNeighborhoodsUseCase` (supports `?cityId` filter) in `src/domain/useCases/listNeighborhoods/ListNeighborhoodsUseCase.ts`
- [ ] T082 Create `PrismaNeighborhoodRepository` in `src/infra/database/prisma/PrismaNeighborhoodRepository.ts`
- [ ] T083 [P] Create `neighborhoodSchemas` (Zod) in `src/infra/validation/schemas/neighborhoodSchemas.ts`
- [ ] T084 Create `NeighborhoodController` in `src/infra/controllers/NeighborhoodController.ts`
- [ ] T085 Create `neighborhood.module.ts` in `src/modules/neighborhood/neighborhood.module.ts`

---

### Phase 6 — User CRUD + Authentication _(depends on Phase 0)_

- [ ] T086 [P] Create `CreateUserDTO` in `src/domain/dtos/CreateUserDTO.ts`
- [ ] T087 [P] Create `UpdateUserDTO` in `src/domain/dtos/UpdateUserDTO.ts`
- [ ] T088 [P] Create `UserResponseDTO` (no password field) in `src/domain/dtos/UserResponseDTO.ts`
- [ ] T089 [P] Create `AuthenticateUserDTO` (email + password) in `src/domain/dtos/AuthenticateUserDTO.ts`
- [ ] T090 Create `User` entity in `src/domain/entities/User.ts`
- [ ] T091 Create `IUserRepository` in `src/domain/repositories/IUserRepository.ts`
- [ ] T092 [P] Create `CreateUserUseCase` (blocks duplicate email, hashes password bcryptjs salt 6) in `src/domain/useCases/createUser/CreateUserUseCase.ts`
- [ ] T093 [P] Create `UpdateUserUseCase` in `src/domain/useCases/updateUser/UpdateUserUseCase.ts`
- [ ] T094 [P] Create `DeleteUserUseCase` in `src/domain/useCases/deleteUser/DeleteUserUseCase.ts`
- [ ] T095 [P] Create `FindUserByIdUseCase` in `src/domain/useCases/findUserById/FindUserByIdUseCase.ts`
- [ ] T096 [P] Create `FindUserByEmailUseCase` in `src/domain/useCases/findUserByEmail/FindUserByEmailUseCase.ts`
- [ ] T097 [P] Create `ListUsersUseCase` in `src/domain/useCases/listUsers/ListUsersUseCase.ts`
- [ ] T098 [P] Create `AuthenticateUserUseCase` (compares bcrypt hash, signs RS256 JWT with sub+isAdmin) in `src/domain/useCases/authenticateUser/AuthenticateUserUseCase.ts`
- [ ] T099 Create `PrismaUserRepository` in `src/infra/database/prisma/PrismaUserRepository.ts`
- [ ] T100 [P] Create `userSchemas` (Zod) in `src/infra/validation/schemas/userSchemas.ts`
- [ ] T101 Create `UserController` (POST /users, GET /users, GET /users/:id, GET /users/email/:email, PUT /users/:id, DELETE /users/:id, POST /authenticate — public) in `src/infra/controllers/UserController.ts`
- [ ] T102 Create `user.module.ts` (imports PassportModule, JwtModule with RS256 keys) in `src/modules/user/user.module.ts`

---

### Phase 7 — Solicitation CRUD _(depends on Phase 1 — SolicitationType + Phase 6 — User)_

- [ ] T103 [P] Create `CreateSolicitationDTO` in `src/domain/dtos/CreateSolicitationDTO.ts`
- [ ] T104 [P] Create `UpdateSolicitationDTO` in `src/domain/dtos/UpdateSolicitationDTO.ts`
- [ ] T105 [P] Create `SolicitationResponseDTO` in `src/domain/dtos/SolicitationResponseDTO.ts`
- [ ] T106 Create `Solicitation` entity in `src/domain/entities/Solicitation.ts`
- [ ] T107 Create `ISolicitationRepository` in `src/domain/repositories/ISolicitationRepository.ts`
- [ ] T108 [P] Create `CreateSolicitationUseCase` (blocks 4th open solicitation for regular users; councilman/admin bypass) in `src/domain/useCases/createSolicitation/CreateSolicitationUseCase.ts`
- [ ] T109 [P] Create `UpdateSolicitationUseCase` in `src/domain/useCases/updateSolicitation/UpdateSolicitationUseCase.ts`
- [ ] T110 [P] Create `DeleteSolicitationUseCase` in `src/domain/useCases/deleteSolicitation/DeleteSolicitationUseCase.ts`
- [ ] T111 [P] Create `FindSolicitationByIdUseCase` in `src/domain/useCases/findSolicitationById/FindSolicitationByIdUseCase.ts`
- [ ] T112 [P] Create `ListSolicitationsUseCase` (supports `?userId`, `?status` filters + pagination) in `src/domain/useCases/listSolicitations/ListSolicitationsUseCase.ts`
- [ ] T113 Create `PrismaSolicitationRepository` (JSON.parse/stringify for imageUrls) in `src/infra/database/prisma/PrismaSolicitationRepository.ts`
- [ ] T114 [P] Create `solicitationSchemas` (Zod) in `src/infra/validation/schemas/solicitationSchemas.ts`
- [ ] T115 Create `SolicitationController` in `src/infra/controllers/SolicitationController.ts`
- [ ] T116 Create `solicitation.module.ts` in `src/modules/solicitation/solicitation.module.ts`

---

### Phase 8 — CoolAction CRUD _(depends on Phase 1 — SolicitationType + Phase 7 — Solicitation)_

- [ ] T117 [P] Create `CreateCoolActionDTO` in `src/domain/dtos/CreateCoolActionDTO.ts`
- [ ] T118 [P] Create `UpdateCoolActionDTO` in `src/domain/dtos/UpdateCoolActionDTO.ts`
- [ ] T119 [P] Create `CoolActionResponseDTO` in `src/domain/dtos/CoolActionResponseDTO.ts`
- [ ] T120 Create `CoolAction` entity in `src/domain/entities/CoolAction.ts`
- [ ] T121 Create `ICoolActionRepository` in `src/domain/repositories/ICoolActionRepository.ts`
- [ ] T122 [P] Create `CreateCoolActionUseCase` (blocks duplicate `solicitationTypeId`) in `src/domain/useCases/createCoolAction/CreateCoolActionUseCase.ts`
- [ ] T123 [P] Create `UpdateCoolActionUseCase` in `src/domain/useCases/updateCoolAction/UpdateCoolActionUseCase.ts`
- [ ] T124 [P] Create `DeleteCoolActionUseCase` in `src/domain/useCases/deleteCoolAction/DeleteCoolActionUseCase.ts`
- [ ] T125 [P] Create `FindCoolActionByIdUseCase` in `src/domain/useCases/findCoolActionById/FindCoolActionByIdUseCase.ts`
- [ ] T126 [P] Create `ListCoolActionsUseCase` in `src/domain/useCases/listCoolActions/ListCoolActionsUseCase.ts`
- [ ] T127 Create `PrismaCoolActionRepository` in `src/infra/database/prisma/PrismaCoolActionRepository.ts`
- [ ] T128 [P] Create `coolActionSchemas` (Zod) in `src/infra/validation/schemas/coolActionSchemas.ts`
- [ ] T129 Create `CoolActionController` in `src/infra/controllers/CoolActionController.ts`
- [ ] T130 Create `coolAction.module.ts` in `src/modules/coolAction/coolAction.module.ts`

---

### Phase 9 — DoneCoolAction CRUD _(depends on Phase 6 — User + Phase 8 — CoolAction)_

- [ ] T131 [P] Create `CreateDoneCoolActionDTO` in `src/domain/dtos/CreateDoneCoolActionDTO.ts`
- [ ] T132 [P] Create `UpdateDoneCoolActionDTO` in `src/domain/dtos/UpdateDoneCoolActionDTO.ts`
- [ ] T133 [P] Create `DoneCoolActionResponseDTO` in `src/domain/dtos/DoneCoolActionResponseDTO.ts`
- [ ] T134 Create `DoneCoolAction` entity in `src/domain/entities/DoneCoolAction.ts`
- [ ] T135 Create `IDoneCoolActionRepository` in `src/domain/repositories/IDoneCoolActionRepository.ts`
- [ ] T136 [P] Create `CreateDoneCoolActionUseCase` (validates userId and coolActionId exist) in `src/domain/useCases/createDoneCoolAction/CreateDoneCoolActionUseCase.ts`
- [ ] T137 [P] Create `UpdateDoneCoolActionUseCase` in `src/domain/useCases/updateDoneCoolAction/UpdateDoneCoolActionUseCase.ts`
- [ ] T138 [P] Create `DeleteDoneCoolActionUseCase` in `src/domain/useCases/deleteDoneCoolAction/DeleteDoneCoolActionUseCase.ts`
- [ ] T139 [P] Create `FindDoneCoolActionByIdUseCase` in `src/domain/useCases/findDoneCoolActionById/FindDoneCoolActionByIdUseCase.ts`
- [ ] T140 [P] Create `ListDoneCoolActionsUseCase` (supports `?userId` filter) in `src/domain/useCases/listDoneCoolActions/ListDoneCoolActionsUseCase.ts`
- [ ] T141 Create `PrismaDoneCoolActionRepository` in `src/infra/database/prisma/PrismaDoneCoolActionRepository.ts`
- [ ] T142 [P] Create `doneCoolActionSchemas` (Zod) in `src/infra/validation/schemas/doneCoolActionSchemas.ts`
- [ ] T143 Create `DoneCoolActionController` in `src/infra/controllers/DoneCoolActionController.ts`
- [ ] T144 Create `doneCoolAction.module.ts` in `src/modules/doneCoolAction/doneCoolAction.module.ts`

---

### Phase 10 — Finalize

- [ ] T145 Register all modules in `src/app.module.ts` (SolicitationTypeModule, PublicPhoneModule, UFModule, CityModule, NeighborhoodModule, UserModule, SolicitationModule, CoolActionModule, DoneCoolActionModule)
- [ ] T146 Create seed file `prisma/seed.ts` with all 27 Brazilian UFs and their respective cities using `prisma.uF.createMany` and `prisma.city.createMany`, register the seed script in `package.json` under `"prisma": { "seed": "ts-node prisma/seed.ts" }`, and run `npx prisma db seed`
- [ ] T147 Run `npm run build` and fix all TypeScript errors
- [ ] T148 Run `npm test` and verify all use case unit tests pass
