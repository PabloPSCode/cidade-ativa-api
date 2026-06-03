# Implementation Plan: Full CidadeAtiva API Build

**Branch**: `001-full-project-build` | **Date**: 2026-06-03 | **Spec**: [spec.md](./spec.md)

## Summary

Build the complete CidadeAtiva REST API — a NestJS + Prisma + PostgreSQL back-end serving civic dashboards. Implements 10 resource groups (User, Solicitation, SolicitationType, CoolAction, DoneCoolAction, PublicPhone, UF, City, Neighborhood, Log) with RS256 JWT auth, Clean Architecture layer separation, and a standardised `ApiResponse<T>` envelope on every response.

## Technical Context

**Language/Version**: TypeScript 5.7 (strict mode) / Node.js

**Primary Dependencies**: NestJS 11, Prisma 5.22, Zod 4, bcryptjs, @nestjs/jwt, @nestjs/passport, passport-jwt

**Storage**: PostgreSQL (production) — `DATABASE_URL=postgresql://user:password@localhost:5432/cidade_ativa_db`

**Testing**: Jest 30 + ts-jest + Supertest (unit tests use fake repository pattern — no real DB)

**Target Platform**: Linux server (REST API)

**Project Type**: web-service

**Performance Goals**: Standard REST API — paginated lists, no real-time requirements

**Constraints**: Domain layer must not import Prisma, NestJS, Express, or process.env

**Scale/Scope**: ~10 resource groups, ~148 files to create

## Constitution Check

- ✅ Domain layer is framework-free (entities, DTOs, use cases, repository interfaces)
- ✅ Infra layer owns Prisma, NestJS, JWT, bcrypt
- ✅ Controllers are thin — delegate entirely to use cases
- ✅ All responses use `ApiResponse<T>` envelope via `buildResponse()`
- ✅ Passwords never returned in responses
- ✅ All lists paginated (default 10/page)
- ✅ UUIDs V4 for all IDs
- ✅ Environment variables only accessed through `src/infra/config/env.ts`

## Project Structure

### Documentation (this feature)

```text
specs/001-full-project-build/
├── plan.md        ← this file
├── spec.md        ← feature specification
└── tasks.md       ← implementation task list (148 tasks)
```

### Source Code Layout

```text
src/
  domain/
    entities/          ← pure TS classes, no framework imports
    dtos/              ← input/output contracts
    repositories/      ← interfaces only (I<Entity>Repository)
    useCases/          ← one folder per use case
    errors/            ← AppError

  infra/
    config/env.ts      ← only place to read process.env
    helpers/           ← buildResponse()
    auth/
      strategies/      ← JwtUserStrategy, JwtAdminStrategy
      guards/          ← JwtUserGuard, JwtAdminGuard
    controllers/       ← thin HTTP adapters
    database/
      prisma/          ← PrismaClient + repository implementations

  middlewares/         ← AppErrorFilter, ZodValidationPipe
  modules/             ← dependency wiring per entity

prisma/
  schema.prisma        ← PostgreSQL provider
  seed.ts              ← 27 UFs + all cities
```

## Complexity Tracking

No constitution violations. All complexity is justified by the domain requirements.
