# Feature Specification: Full CidadeAtiva API Build

**Feature Branch**: `001-full-project-build`

**Created**: 2026-06-03

**Status**: Approved

**Input**: Build the complete CidadeAtiva back-end REST API from the ground up following Clean Architecture.

## User Scenarios & Testing

### User Story 1 - Infrastructure & Auth Setup (Priority: P1)

A developer can boot the project against a PostgreSQL database, register a user, and authenticate to receive a JWT token.

**Why this priority**: Everything else depends on the database connection, auth guards, and the API response envelope.

**Independent Test**: `POST /users` creates a user; `POST /authenticate` returns a JWT; all other routes return 401 without that token.

**Acceptance Scenarios**:

1. **Given** a running PostgreSQL instance, **When** `npx prisma db push` runs, **Then** all schema tables are created.
2. **Given** a valid `{ email, password }` payload, **When** `POST /authenticate` is called, **Then** a signed RS256 JWT is returned inside the `ApiResponse` envelope.
3. **Given** a request with no Bearer token, **When** any protected route is called, **Then** 401 is returned in the `ApiResponse` envelope.

---

### User Story 2 - Reference Data CRUD (Priority: P2)

An admin can manage solicitation types, public phones, UFs, cities, and neighborhoods so that citizens can use them when opening solicitations.

**Why this priority**: Solicitations depend on SolicitationType and address reference data.

**Independent Test**: CRUD endpoints for all five reference entities return paginated `ApiResponse` envelopes and enforce uniqueness rules.

**Acceptance Scenarios**:

1. **Given** a duplicate description, **When** `POST /solicitation-types` is called, **Then** 409 is returned.
2. **Given** a UF with linked cities, **When** `DELETE /ufs/:id` is called, **Then** 400 is returned.
3. **Given** a valid `ufId`, **When** `GET /cities?ufId=:id` is called, **Then** only cities for that UF are returned paginated.

---

### User Story 3 - Solicitation CRUD (Priority: P3)

A citizen can open, track, and view urban solicitations; an admin can resolve them.

**Why this priority**: Core product feature — the main reason the platform exists.

**Independent Test**: A regular user can create up to 3 open solicitations; the 4th is rejected. Councilman/admin bypass the limit.

**Acceptance Scenarios**:

1. **Given** a regular user with 3 open solicitations, **When** `POST /solicitations` is called, **Then** 422 is returned.
2. **Given** a councilman user, **When** `POST /solicitations` is called with any number of open ones, **Then** 201 is returned.
3. **Given** a valid `solicitationId`, **When** `GET /solicitations/:id` is called, **Then** full details including imageUrls arrays are returned.

---

### User Story 4 - CoolActions & DoneCoolActions (Priority: P4)

A citizen earns points by completing cool actions linked to resolved solicitations, appearing on the Cidadão Legal leaderboard.

**Why this priority**: Gamification layer — depends on solicitations being resolved first.

**Independent Test**: `GET /done-cool-actions?userId=:id` returns all completed actions for a user with their accumulated points from `SolicitationType.points`.

**Acceptance Scenarios**:

1. **Given** a resolved solicitation, **When** `POST /cool-actions` is called with its `solicitationId`, **Then** a cool action is created.
2. **Given** a valid `coolActionId` and `userId`, **When** `POST /done-cool-actions` is called, **Then** the user's point total increases by `SolicitationType.points`.

---

### Edge Cases

- What happens when a user is deleted that has open solicitations?
- How does the system handle `solvedImageUrls` when a solicitation is still `not_resolved`?
- What if `prisma db seed` is run twice — are UF/city records duplicated?

## Requirements

### Functional Requirements

- **FR-001**: System MUST expose a REST API following the `ApiResponse<T>` envelope on every response.
- **FR-002**: System MUST authenticate users via RS256 JWT (`jwt-user` and `jwt-admin` Passport strategies).
- **FR-003**: System MUST hash passwords with bcryptjs at salt level 6 before persistence.
- **FR-004**: System MUST block a 4th open solicitation for regular users (not councilman, not admin).
- **FR-005**: System MUST prevent cascade deletes (UF with cities, City with neighborhoods, SolicitationType with linked records).
- **FR-006**: System MUST paginate all list endpoints (default 10 items/page).
- **FR-007**: System MUST seed the database with all 27 Brazilian UFs and their municipalities.
- **FR-008**: All protected routes MUST require a valid JWT; only `/authenticate` and `/users` (POST) are public.

### Key Entities

- **User**: citizen account with role flags (`isCouncilman`, `isAdmin`)
- **Solicitation**: urban complaint with status lifecycle and image URL arrays
- **SolicitationType**: category carrying the point value for cool actions
- **CoolAction**: reward action generated from a resolved solicitation
- **DoneCoolAction**: record of a user completing a cool action (awards points)
- **UF / City / Neighborhood**: Brazilian address hierarchy
- **PublicPhone**: civic contact registry
- **Log**: append-only audit trail

## Success Criteria

### Measurable Outcomes

- **SC-001**: All 10 resource groups have working CRUD endpoints returning `ApiResponse` envelopes.
- **SC-002**: JWT authentication works end-to-end with both `jwt-user` and `jwt-admin` strategies.
- **SC-003**: `npm run build` compiles with zero TypeScript errors.
- **SC-004**: `npm test` passes all domain use case unit tests.
- **SC-005**: `npx prisma db seed` populates all 27 UFs and their cities without duplicates.

## Assumptions

- PostgreSQL is available locally or via Docker for development.
- RS256 key pair (base64-encoded) is provided in `.env` as `JWT_PUBLIC_KEY` and `JWT_PRIVATE_KEY`.
- The front-end clients (civic dashboards) will handle JWT storage and attachment.
- Image URLs are stored as references only — file upload/storage is out of scope.
