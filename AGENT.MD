# Backend Agent Guide — Clean Architecture

Use this guide when creating, editing, or refactoring this backend project.

This file is intended to guide AI coding agents such as **Google AntiGravity**, **Claude Code**, **Cursor**, **Copilot**, or any other coding assistant.

The main objective is to help the model generate backend code with a consistent project structure, clean separation of responsibilities, and good engineering practices based on **Clean Architecture**.

---

# Main Goal

Build the backend following **Clean Architecture**, keeping business rules isolated from frameworks, databases, HTTP, queues, external APIs, and infrastructure details.

The backend must be:

- Simple
- Typed
- Testable
- Scalable
- Secure
- Easy to maintain
- Easy to understand
- Organized by responsibility
- Consistent across all modules

---

# Base Project Structure

Use this base structure:

```txt
src/
  domain/
    entities/
    dtos/
    repositories/
    useCases/

  infra/
    services/
    controllers/

  assets/
  modules/
  middlewares/
  gateways/
```

Recommended expanded structure:

```txt
src/
  domain/
    entities/
      User.ts
      Company.ts
      Training.ts

    dtos/
      CreateUserDTO.ts
      UpdateUserDTO.ts
      CreateTrainingDTO.ts

    repositories/
      IUserRepository.ts
      ICompanyRepository.ts
      ITrainingRepository.ts

    useCases/
      createUser/
        CreateUserUseCase.ts
        CreateUserUseCase.spec.ts
      updateUser/
        UpdateUserUseCase.ts
        UpdateUserUseCase.spec.ts
      deleteUser/
        DeleteUserUseCase.ts
        DeleteUserUseCase.spec.ts

  infra/
    controllers/
      UserController.ts
      CompanyController.ts
      TrainingController.ts

    services/
      EmailService.ts
      StorageService.ts
      HashService.ts
      TokenService.ts

    database/
      prisma/
        prismaClient.ts
        PrismaUserRepository.ts
        PrismaCompanyRepository.ts
        PrismaTrainingRepository.ts

  modules/
    user/
      user.module.ts
      user.routes.ts
    company/
      company.module.ts
      company.routes.ts
    training/
      training.module.ts
      training.routes.ts

  middlewares/
    authMiddleware.ts
    errorHandler.ts
    validateRequest.ts

  gateways/
    PaymentGateway.ts
    WhatsAppGateway.ts
    NotificationGateway.ts

  assets/
```

---

# Clean Architecture Dependency Rule

Dependencies must always point inward.

Correct direction:

```txt
Controller -> UseCase -> Repository Interface
Repository Implementation -> Repository Interface
External Service Implementation -> Service Interface
```

Incorrect direction:

```txt
UseCase -> Controller
Entity -> Prisma
Domain -> Express
Domain -> NestJS
Domain -> Axios
Domain -> Stripe SDK
Domain -> process.env
```

The `domain` layer is the core of the system. It must not depend on implementation details.

---

# Layers Overview

## Domain Layer

The `domain` folder contains the business rules and application rules.

It can contain:

- Entities
- DTOs
- Repository interfaces
- Use cases
- Domain errors
- Business validation
- Application contracts

It must not depend on:

- Express
- NestJS
- Fastify
- Prisma
- Sequelize
- TypeORM
- Axios
- Firebase
- Stripe
- AWS SDK
- HTTP request/response objects
- Environment variables
- External APIs

The domain layer must be framework-independent.

---

## Infra Layer

The `infra` folder contains implementation details.

It can contain:

- Controllers
- Database repository implementations
- External service implementations
- Email services
- Storage services
- Payment services
- API clients
- Prisma client
- ORM integrations

The infra layer can depend on external libraries, frameworks, SDKs, and database tools.

---

## Modules Layer

The `modules` folder is responsible for wiring dependencies.

It can contain:

- Route registration
- Dependency injection setup
- Module exports
- Controller initialization
- Use case initialization
- Repository implementation binding

Modules connect the application parts, but must not contain business logic.

---

## Middlewares Layer

The `middlewares` folder contains request lifecycle middlewares.

Examples:

- Authentication middleware
- Authorization middleware
- Request validation middleware
- Error handler middleware
- Rate limit middleware
- Logging middleware

Middlewares must not contain core business rules.

---

## Gateways Layer

The `gateways` folder contains integrations with external systems.

Examples:

- Payment providers
- WhatsApp APIs
- CRMs
- Notification providers
- External APIs
- Webhook providers

If a use case depends on a gateway, create an interface or contract and inject the concrete implementation.

---

# Entities

Entities represent business objects and business behavior.

Example:

```ts
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public readonly createdAt: Date,
  ) {}

  changeName(name: string): void {
    if (!name.trim()) {
      throw new Error('Name is required');
    }

    this.name = name;
  }

  changeEmail(email: string): void {
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }

    this.email = email;
  }
}
```

Rules:

- Do not add database decorators inside entities.
- Do not use Prisma types inside entities.
- Do not use ORM models inside entities.
- Do not use HTTP types inside entities.
- Do not import controllers into entities.
- Do not access environment variables inside entities.
- Keep entity behavior focused on business rules.
- Prefer explicit methods for state changes.
- Avoid anemic entities when a business rule clearly belongs to the entity.

---

# DTOs

DTOs define input and output contracts.

Example:

```ts
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}
```

Example output DTO:

```ts
export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

Rules:

- DTOs must not contain business logic.
- DTOs must not depend on controllers.
- DTOs must not depend on database models.
- DTOs should be simple TypeScript types or interfaces.
- Use DTOs to make data contracts explicit.

---

# Repository Interfaces

Repository interfaces must stay inside `domain/repositories`.

Example:

```ts
import { User } from '../entities/User';
import { CreateUserDTO } from '../dtos/CreateUserDTO';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```

Rules:

- Use interfaces in the domain layer.
- Do not import Prisma, Sequelize, TypeORM, or database clients here.
- Do not expose database-specific query syntax.
- Do not return raw ORM models.
- Implement repositories only in the infra layer.
- Keep repository contracts focused on business needs, not generic database operations.

Avoid creating repository methods like this:

```ts
findManyWithRawWhereClause(where: Prisma.UserWhereInput): Promise<User[]>;
```

Prefer this:

```ts
findManyByCompanyId(companyId: string): Promise<User[]>;
```

---

# Use Cases

Use cases contain application business logic.

Each use case should have one responsibility.

Recommended folder pattern:

```txt
domain/useCases/createUser/
  CreateUserUseCase.ts
  CreateUserUseCase.spec.ts
```

Example:

```ts
import { IUserRepository } from '../../repositories/IUserRepository';
import { CreateUserDTO } from '../../dtos/CreateUserDTO';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO) {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    const user = await this.userRepository.create(data);

    return user;
  }
}
```

Rules:

- Use cases must not know about HTTP.
- Use cases must not receive `Request` or `Response`.
- Use cases must not call Prisma directly.
- Use cases must not import controllers.
- Use cases must not import route files.
- Use cases must receive dependencies through constructor injection.
- Use cases must return domain data or output DTOs, not HTTP responses.
- Each use case should expose an `execute` method.
- Each use case should represent a single application action.

Good use case names:

```txt
CreateUserUseCase
UpdateUserUseCase
DeleteUserUseCase
AuthenticateUserUseCase
CreateTrainingUseCase
FinishClassUseCase
GenerateCertificateUseCase
```

Avoid generic names:

```txt
UserService
UserHandler
UserManager
DoUserThings
```

---

# Controllers

Controllers receive HTTP requests and call use cases.

Example:

```ts
import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../domain/useCases/createUser/CreateUserUseCase';

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const user = await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    return response.status(201).json({
      data: user,
    });
  }
}
```

Rules:

- Controllers must be thin.
- Controllers should only handle request/response logic.
- Controllers must not contain business rules.
- Controllers must not access the database directly.
- Controllers must call use cases.
- Controllers can read `body`, `params`, `query`, and authenticated user context.
- Controllers can define HTTP status codes.
- Controllers can transform the use case result into HTTP response format.

Incorrect:

```ts
async create(request: Request, response: Response): Promise<Response> {
  const userAlreadyExists = await prisma.user.findUnique({
    where: { email: request.body.email },
  });

  if (userAlreadyExists) {
    return response.status(409).json({ message: 'User already exists' });
  }

  const user = await prisma.user.create({ data: request.body });

  return response.json(user);
}
```

Correct:

```ts
async create(request: Request, response: Response): Promise<Response> {
  const result = await this.createUserUseCase.execute(request.body);

  return response.status(201).json({
    data: result,
  });
}
```

---

# Infra Services

Services inside `infra/services` are external or infrastructure-related implementations.

Examples:

```txt
infra/services/
  EmailService.ts
  StorageService.ts
  HashService.ts
  TokenService.ts
```

Rules:

- Services may depend on external APIs.
- Services may use environment variables.
- Services may use SDKs.
- Services may call providers such as AWS, Stripe, Firebase, SendGrid, etc.
- If a use case depends on a service, prefer depending on an interface.
- Do not place core business rules in infra services.

Example contract:

```ts
export interface IHashService {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}
```

Example implementation:

```ts
import bcrypt from 'bcryptjs';
import { IHashService } from '../../domain/services/IHashService';

export class BcryptHashService implements IHashService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 8);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
```

---

# Database Repositories

Repository implementations must stay in the infra layer.

Example:

```ts
import { prisma } from './prismaClient';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { CreateUserDTO } from '../../../domain/dtos/CreateUserDTO';

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return new User(user.id, user.name, user.email, user.createdAt);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return new User(user.id, user.name, user.email, user.createdAt);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new User(user.id, user.name, user.email, user.createdAt);
  }

  async update(user: User): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
      },
    });

    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.createdAt,
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
```

Rules:

- Database models must be mapped to domain entities.
- Do not return raw Prisma models directly from repositories.
- Do not leak database implementation details into the domain.
- Keep ORM-specific code inside infra.
- Keep database transactions inside infra or application orchestration layers.
- Avoid importing repositories from controllers directly when a use case should exist.

---

# Mappers

Use mappers when converting between database models, domain entities, and response DTOs.

Recommended structure:

```txt
infra/database/prisma/mappers/
  PrismaUserMapper.ts
```

Example:

```ts
import { User } from '../../../../domain/entities/User';

type PrismaUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return new User(raw.id, raw.name, raw.email, raw.createdAt);
  }

  static toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
```

Rules:

- Use mappers to avoid leaking ORM objects.
- Keep conversion logic centralized.
- Do not put Prisma mapping logic inside use cases.

---

# Modules

The `modules` folder wires dependencies.

Example:

```ts
import { Router } from 'express';
import { UserController } from '../../infra/controllers/UserController';
import { CreateUserUseCase } from '../../domain/useCases/createUser/CreateUserUseCase';
import { PrismaUserRepository } from '../../infra/database/prisma/PrismaUserRepository';

const userRoutes = Router();

const userRepository = new PrismaUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const userController = new UserController(createUserUseCase);

userRoutes.post('/users', (request, response) => {
  return userController.create(request, response);
});

export { userRoutes };
```

Rules:

- Modules can instantiate concrete classes.
- Modules can connect routes, controllers, repositories, and use cases.
- Modules must not contain business logic.
- Avoid creating dependencies directly inside controllers or use cases.
- Keep dependency wiring explicit and easy to understand.

---

# Middlewares

Middlewares handle request lifecycle concerns.

Examples:

```txt
middlewares/
  authMiddleware.ts
  errorHandler.ts
  validateRequest.ts
```

Rules:

- Middlewares must not contain business rules.
- Authentication middleware can validate tokens and attach user context.
- Validation middleware can validate request body, params, and query.
- Error middleware must standardize API errors.
- Rate limit middleware can protect sensitive endpoints.
- Logging middleware can register request metadata.

---

# Gateways

Gateways represent integrations with external systems.

Examples:

```txt
gateways/
  PaymentGateway.ts
  WhatsAppGateway.ts
  NotificationGateway.ts
```

Use gateways for:

- Payment providers
- WhatsApp APIs
- External CRMs
- Notification providers
- Third-party APIs
- Webhook providers

Prefer creating an interface when the gateway is used by a use case.

Example:

```ts
export interface IPaymentGateway {
  createCheckoutSession(data: {
    userId: string;
    amount: number;
  }): Promise<{ checkoutUrl: string }>;
}
```

Example implementation:

```ts
export class StripePaymentGateway implements IPaymentGateway {
  async createCheckoutSession(data: {
    userId: string;
    amount: number;
  }): Promise<{ checkoutUrl: string }> {
    // Stripe SDK implementation here

    return {
      checkoutUrl: 'https://checkout.stripe.com/example',
    };
  }
}
```

Rules:

- Do not call external APIs directly from controllers.
- Do not call external APIs directly from entities.
- Keep third-party SDK code isolated.
- Use interfaces for testability.

---

# Validation

Use validation at the application boundary.

Recommended libraries:

- Zod
- class-validator
- Joi

Example with Zod:

```ts
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});
```

Rules:

- Validate request data before calling the use case.
- Do not put HTTP validation logic inside entities.
- Do not put schema validation directly inside use cases unless it is application-level validation.
- Use DTOs after validation.
- Prefer reusable validation middleware.

Example middleware idea:

```ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      return response.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten(),
      });
    }

    return next();
  };
}
```

---

# Error Handling

Create application errors.

Example:

```ts
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
  }
}
```

Use inside use cases:

```ts
throw new AppError('User already exists', 409);
```

Handle in middleware:

```ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal server error',
  });
}
```

Rules:

- Do not return HTTP responses from use cases.
- Throw errors from use cases.
- Convert errors to HTTP responses only in the controller or error middleware.
- Do not expose internal error details in production.
- Use specific errors for business failures.
- Use consistent error response shape.

---

# API Response Pattern

Every response from the API — success or failure — MUST use the following envelope structure.

## Response Envelope

```ts
interface ApiResponse<T = unknown> {
  RES: T | null;
  MSG: { message: string; error?: string } | null;
  SUCCESS: boolean;
  TIMESTAMP: string; // ISO 8601
  PATH: string;      // request path, e.g. "/users/auth"
  STATUS: number;    // HTTP status code
}
```

- `RES` — the response payload on success, `null` on failure.
- `MSG` — human-readable feedback on failure, `null` on success.
  - `message`: general description of what went wrong.
  - `error`: specific technical reason (optional but recommended for 4xx).
- `SUCCESS` — `true` when the operation succeeded, `false` otherwise.
- `TIMESTAMP` — UTC ISO 8601 datetime of when the response was generated.
- `PATH` — the route path that was called.
- `STATUS` — mirrors the HTTP status code in the body for clients that cannot read headers.

## Success example

```json
{
  "RES": {
    "id": "69b6eb13-c12c-4036-84d0-ebb58696a59a",
    "name": "Pablo Silva",
    "email": "pablo@email.com"
  },
  "MSG": null,
  "SUCCESS": true,
  "TIMESTAMP": "2025-10-28T09:49:54.950Z",
  "PATH": "/users",
  "STATUS": 201
}
```

## Failure example

```json
{
  "RES": null,
  "MSG": {
    "message": "An error occurred. Check all request body fields for possible mismatching.",
    "error": "User not found or credentials do not match"
  },
  "SUCCESS": false,
  "TIMESTAMP": "2025-10-28T09:49:54.950Z",
  "PATH": "/users/auth",
  "STATUS": 409
}
```

## Validation error example

```json
{
  "RES": null,
  "MSG": {
    "message": "Validation error",
    "error": "email: Invalid email address; password: Must be at least 8 characters"
  },
  "SUCCESS": false,
  "TIMESTAMP": "2025-10-28T09:49:54.950Z",
  "PATH": "/users",
  "STATUS": 400
}
```

## Paginated success example

```json
{
  "RES": {
    "data": [],
    "meta": {
      "page": 1,
      "perPage": 10,
      "total": 100,
      "totalPages": 10
    }
  },
  "MSG": null,
  "SUCCESS": true,
  "TIMESTAMP": "2025-10-28T09:49:54.950Z",
  "PATH": "/solicitations",
  "STATUS": 200
}
```

## Implementation

Build a reusable response builder in `src/infra/helpers/apiResponse.ts`:

```ts
import { Request } from 'express';

export function buildResponse<T>(params: {
  res: T | null;
  success: boolean;
  status: number;
  path: string;
  message?: string;
  error?: string;
}) {
  return {
    RES: params.res,
    MSG: params.success
      ? null
      : { message: params.message ?? 'An error occurred.', error: params.error },
    SUCCESS: params.success,
    TIMESTAMP: new Date().toISOString(),
    PATH: params.path,
    STATUS: params.status,
  };
}
```

Use it inside every controller method:

```ts
// success
return response.status(201).json(
  buildResponse({ res: result, success: true, status: 201, path: request.path }),
);

// failure (handled by error middleware)
return response.status(error.statusCode).json(
  buildResponse({
    res: null,
    success: false,
    status: error.statusCode,
    path: request.path,
    message: 'An error occurred.',
    error: error.message,
  }),
);
```

Rules:

- MUST use this envelope for every response — no bare `{ data }` or `{ message }` shapes.
- NEVER return sensitive fields (`password`, token hashes) inside `RES`.
- ALWAYS set `MSG: null` on success and `RES: null` on failure.
- ALWAYS use ISO 8601 UTC string for `TIMESTAMP`.
- Use pagination metadata nested inside `RES.meta` for list endpoints.

---

# Naming Conventions

Use clear and explicit names.

Good:

```txt
CreateUserUseCase
UpdateCompanyUseCase
DeleteTrainingUseCase
AuthenticateUserUseCase
IUserRepository
PrismaUserRepository
UserController
BcryptHashService
JwtTokenService
```

Avoid:

```txt
UserService
Manager
Handler
Helper
Utils
DataService
Stuff
Thing
Processor
```

Use `Service` only when it represents an external service, infrastructure service, or reusable technical capability.

Examples:

```txt
EmailService
StorageService
HashService
TokenService
```

---

# Code Style

Use:

- TypeScript
- Explicit return types on public methods
- `async/await`
- Constructor dependency injection
- Small functions
- Clear names
- Interfaces for contracts
- Classes for use cases when dependency injection is needed
- Immutable values when possible
- Early returns when they improve readability

Avoid:

- `any`
- Huge files
- Business logic in controllers
- Database calls inside controllers
- Direct dependency on external APIs in use cases
- Global mutable state
- Duplicated logic
- Silent errors
- Deeply nested conditionals
- Over-engineering simple features
- Generic utility files with unrelated functions

---

# Import Rules

Prefer absolute imports if configured.

Example:

```ts
import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
```

If absolute imports are not configured, use relative imports.

Avoid messy imports like this when possible:

```ts
import { User } from '../../../../../../domain/entities/User';
```

Recommended `tsconfig.json` path alias:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

---

# TypeScript Rules

Use strict TypeScript.

Recommended:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

Rules:

- Avoid `any`.
- Prefer `unknown` when the type is truly unknown.
- Always type function parameters.
- Always type public method returns.
- Prefer interfaces for contracts.
- Prefer types for unions and composition.
- Avoid unnecessary type assertions.

---

# Authentication and Authorization

Authentication verifies who the user is.

Authorization verifies what the user can do.

Rules:

- Authentication middleware can validate JWT/session and attach user context.
- Authorization decisions that are business-specific should be inside use cases.
- Do not trust user IDs received from request body when authenticated user context is available.
- Never expose password hashes.
- Never store plain text passwords.
- Use secure hashing for passwords.
- Keep token generation inside infra services.
- Keep permission checks explicit.

Example:

```ts
export interface AuthenticatedUser {
  id: string;
  role: 'ADMIN' | 'USER';
  companyId?: string;
}
```

Example use case authorization:

```ts
if (authenticatedUser.role !== 'ADMIN') {
  throw new AppError('Forbidden', 403);
}
```

---

# Security Best Practices

Always follow these rules:

- Never expose passwords.
- Never return password hashes in API responses.
- Hash passwords before saving.
- Validate all input.
- Sanitize data when necessary.
- Use environment variables for secrets.
- Never hardcode API keys.
- Never hardcode database credentials.
- Use authentication middleware for protected routes.
- Use authorization rules inside use cases when they are business-related.
- Use rate limiting for sensitive routes.
- Use CORS carefully.
- Log errors without exposing sensitive data.
- Avoid logging tokens, passwords, API keys, and personal sensitive data.
- Use HTTPS in production.
- Validate file uploads.
- Restrict file size and file type.
- Use secure headers when applicable.
- Handle webhooks with signature validation when supported by provider.

---

# Environment Variables

Use environment variables for configuration.

Example:

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=
JWT_SECRET=
CORS_ALLOWED_ORIGINS=
```

Rules:

- Never access `process.env` directly inside domain.
- Prefer a config file in infra or shared config.
- Validate environment variables when the app starts.
- Do not commit `.env` files.
- Provide `.env.example` with safe placeholder values.

Example config file:

```ts
export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3333),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};
```

---

# Logging Rules

Use structured logs when possible.

Recommended logs:

- Request started
- Request completed
- Business failure where useful
- External service failure
- Database failure
- Webhook received
- Authentication failure

Avoid logging:

- Passwords
- Tokens
- API keys
- Full credit card data
- Sensitive personal data
- Large request payloads without need

Example:

```ts
logger.info({
  userId,
  action: 'CREATE_TRAINING',
}, 'Training created successfully');
```

**All action done in the system must be registered on the logs table**. See the logs DTO. 
- Example A: If user edits its name, so create a new log on logs table ```{userId: aedfed82738acd8e7eebac99, userName: John Doe, email: johndoes@gmail.com, activityDescription: user_edited }```. 
- Example B: If user authenticates in the system, so create a new log on logs table ```{userId: aedfed82738acd8e7eebac99, userName: John Doe, email: johndoes@gmail.com, activityDescription: user_authenticated }```

---

# Testing Rules

Every use case should be easy to test.

Use fake repositories for unit tests.

Example:

```ts
class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  async create(data: CreateUserDTO): Promise<User> {
    const user = new User(
      crypto.randomUUID(),
      data.name,
      data.email,
      new Date(),
    );

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((item) => item.id === user.id);

    if (index < 0) {
      throw new Error('User not found');
    }

    this.users[index] = user;

    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
```

Rules:

- Test use cases without database.
- Mock external services.
- Avoid testing implementation details.
- Test business behavior.
- Prefer one test file per use case.
- Test success and failure paths.
- Test authorization rules.
- Test validation separately when validation is complex.

---

# Recommended Test Structure

```txt
domain/useCases/createUser/
  CreateUserUseCase.ts
  CreateUserUseCase.spec.ts
```

Example test cases:

```txt
CreateUserUseCase
  should create a user
  should not create a user with duplicated email
  should hash the password before saving
  should return user data without password
```

---

# Pagination Pattern

For list use cases, use pagination DTOs.

Example:

```ts
export interface PaginationDTO {
  page: number;
  perPage: number;
}
```

Example result:

```ts
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
```

Rules:

- Do not return unlimited lists.
- Set a default `page` and `perPage`.
- Set a maximum `perPage`.
- Keep pagination metadata consistent.

---

# File Upload Rules

When implementing file upload:

- Validate file type.
- Validate file size.
- Store file using an infra storage service.
- Do not store files directly inside use cases.
- Use a storage service interface if business logic depends on storage.
- Do not expose private file paths.
- Return public URLs only when appropriate.

Example contract:

```ts
export interface IStorageService {
  upload(data: {
    fileName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<{ url: string; key: string }>;

  delete(key: string): Promise<void>;
}
```

---

# Webhook Rules

When implementing webhooks:

- Validate provider signature if available.
- Store relevant event ID to avoid duplicated processing.
- Make webhook processing idempotent.
- Return quickly when possible.
- Move heavy processing to a queue when necessary.
- Log event type and event ID.
- Never trust webhook payload without validation.

Example:

```txt
infra/controllers/StripeWebhookController.ts
domain/useCases/processStripeWebhook/ProcessStripeWebhookUseCase.ts
gateways/StripeGateway.ts
```

---

# Queue and Background Job Rules

If queues are used:

- Queue implementation belongs to infra.
- Use cases should not depend directly on BullMQ, RabbitMQ, SQS, etc.
- Use an interface for queue publishing when needed.
- Job processors should call use cases.
- Keep jobs idempotent when possible.

Example contract:

```ts
export interface IQueueService {
  publish<T>(queueName: string, payload: T): Promise<void>;
}
```

---

# Transactions

Use transactions when multiple database operations must succeed or fail together.

Rules:

- Keep transaction implementation inside infra.
- Do not leak ORM transaction objects into domain.
- Prefer a transaction manager abstraction if use cases need orchestration.
- Avoid long transactions.
- Avoid external API calls inside database transactions when possible.

---

# Date and Time Rules

Use consistent date handling.

Rules:

- Store dates in UTC.
- Convert dates for display at the presentation layer.
- Avoid timezone-specific logic inside entities unless it is a business rule.
- Use ISO strings in APIs when returning dates.
- Avoid comparing dates as strings unless they are normalized ISO strings.

---

# Money Rules

For monetary values:

- Prefer storing money in cents.
- Avoid floating-point arithmetic for money.
- Use integer values for persistence and calculations.
- Include currency when needed.

Example:

```ts
export interface CreatePaymentDTO {
  amountInCents: number;
  currency: 'BRL' | 'USD';
}
```

---

# Clean Architecture Checklist

Before finishing any implementation, verify:

- [ ] Entity does not depend on database or HTTP.
- [ ] Use case does not depend on controller, request, response, or database client.
- [ ] Repository interface is in the domain layer.
- [ ] Repository implementation is in the infra layer.
- [ ] Controller is thin.
- [ ] Business rules are inside entities or use cases.
- [ ] External APIs are isolated in services or gateways.
- [ ] Errors are handled consistently.
- [ ] Input validation happens before the use case.
- [ ] Sensitive data is not returned.
- [ ] Code is typed and avoids `any`.
- [ ] Tests can be written without real database access.
- [ ] Environment variables are not accessed inside domain.
- [ ] Database models are mapped to domain entities.
- [ ] Module wiring is explicit.
- [ ] Use case has a single responsibility.

---

# Default Flow for New Features

When creating a new feature, follow this order:

```txt
1. Create DTO
2. Create or update Entity
3. Create Repository Interface
4. Create Use Case
5. Create Repository Implementation
6. Create Controller
7. Register in Module/Routes
8. Add Validation
9. Add Tests
```

Example for `CreateTraining`:

```txt
domain/dtos/CreateTrainingDTO.ts
domain/entities/Training.ts
domain/repositories/ITrainingRepository.ts
domain/useCases/createTraining/CreateTrainingUseCase.ts
infra/database/prisma/PrismaTrainingRepository.ts
infra/controllers/TrainingController.ts
modules/training/training.routes.ts
```

---

# Example Feature Structure

For a users feature:

```txt
src/
  domain/
    entities/
      User.ts

    dtos/
      CreateUserDTO.ts
      UpdateUserDTO.ts
      UserResponseDTO.ts

    repositories/
      IUserRepository.ts

    useCases/
      createUser/
        CreateUserUseCase.ts
        CreateUserUseCase.spec.ts
      updateUser/
        UpdateUserUseCase.ts
        UpdateUserUseCase.spec.ts
      deleteUser/
        DeleteUserUseCase.ts
        DeleteUserUseCase.spec.ts
      listUsers/
        ListUsersUseCase.ts
        ListUsersUseCase.spec.ts

  infra/
    controllers/
      UserController.ts

    database/
      prisma/
        PrismaUserRepository.ts

  modules/
    user/
      user.routes.ts
      user.module.ts
```

---

# AI Agent Instructions

When generating code for this project:

1. Respect the folder structure.
2. Do not mix infrastructure with domain.
3. Do not put business logic inside controllers.
4. Do not call Prisma or database clients inside use cases.
5. Do not import framework-specific code inside `domain`.
6. Create interfaces before concrete implementations.
7. Keep files small and focused.
8. Prefer readable code over clever code.
9. Ask for missing business rules when truly necessary.
10. If unsure, choose the solution that keeps the domain layer cleaner.
11. Do not create generic `utils` files unless the utility is really reusable.
12. Do not create unnecessary abstractions.
13. Do not skip validation.
14. Do not skip error handling.
15. Do not return sensitive fields.
16. Do not modify unrelated files.
17. Follow the existing project patterns when they already exist.
18. Prefer incremental changes over large rewrites.
19. Keep naming consistent with the existing codebase.
20. Generate tests when creating important use cases.

---

# AI Agent Refactoring Rules

When refactoring existing code:

- Preserve existing behavior unless explicitly asked to change it.
- Avoid changing public API contracts without instruction.
- Move business logic from controllers to use cases.
- Move database access from controllers/use cases to repositories.
- Create interfaces for dependencies when needed.
- Remove duplicated logic carefully.
- Keep commits or file changes focused by feature.
- Explain assumptions in comments only when necessary.
- Do not add comments that only repeat what the code already says.

---

# AI Agent Code Review Checklist

Before finalizing generated code, check:

- Does this file belong in the correct folder?
- Is the domain layer clean?
- Is the controller thin?
- Is the use case independent from HTTP?
- Is database access isolated?
- Are errors handled?
- Are inputs validated?
- Are names explicit?
- Is the code typed?
- Is there duplicated logic?
- Could this be tested without a real database?
- Are sensitive fields hidden?
- Are external APIs isolated?

---

# Final Rule

The domain layer is the heart of the application.

Protect it from frameworks, databases, APIs, and implementation details.
