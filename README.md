# NestJS Back-End Template

A production-ready NestJS + TypeScript back-end template following **Clean Architecture** principles.

## Architecture

This project follows Clean Architecture with clear separation of concerns:

```
src/
  domain/           # Business rules (framework-independent)
    entities/       # Domain entities
    dtos/           # Input/output contracts
    repositories/   # Repository interfaces
    useCases/       # Application use cases
    errors/         # Domain errors

  infra/            # Implementation details
    controllers/    # NestJS HTTP controllers
    database/       # Prisma repository implementations
    config/         # Environment configuration
    validation/     # Zod validation schemas

  modules/          # NestJS module wiring (DI)
  middlewares/      # Exception filters, validation pipes
  gateways/         # External system integrations
  assets/           # Static assets
```

## Dependency Rule

Dependencies always point inward:

```
Controller -> UseCase -> Repository Interface
Repository Implementation -> Repository Interface
```

The `domain` layer has **zero framework dependencies**.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: NestJS
- **Database**: Prisma ORM (SQLite by default)
- **Validation**: Zod
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push
```

### Running

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## Default Feature: Log CRUD

The template includes a complete Log CRUD as a reference implementation.

### Model

| Field               | Type   |
|---------------------|--------|
| id                  | UUID   |
| userId              | string |
| userName            | string |
| email               | string |
| activityDescription | string |
| createdAt           | Date   |

### API Endpoints

| Method | Route       | Description              |
|--------|-------------|--------------------------|
| POST   | /logs       | Create a new log         |
| GET    | /logs       | List logs (paginated)    |
| GET    | /logs/:id   | Find log by ID           |
| PUT    | /logs/:id   | Update a log             |
| DELETE | /logs/:id   | Delete a log             |

### Pagination

```
GET /logs?page=1&perPage=10
```

Response:

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable     | Description           | Default        |
|--------------|-----------------------|----------------|
| NODE_ENV     | Environment           | development    |
| PORT         | Server port           | 3333           |
| DATABASE_URL | Database connection   | file:./dev.db  |

## Creating New Features

Follow this order when adding new features:

1. Create DTO (`domain/dtos/`)
2. Create or update Entity (`domain/entities/`)
3. Create Repository Interface (`domain/repositories/`)
4. Create Use Case (`domain/useCases/`)
5. Create Repository Implementation (`infra/database/prisma/`)
6. Create Controller (`infra/controllers/`)
7. Register in Module (`modules/`)
8. Add Validation (`infra/validation/schemas/`)
9. Add Tests (`.spec.ts` alongside use cases)

Refer to `AGENT.MD` for detailed rules and patterns.

## License

UNLICENSED
