# Tasks: Full CidadeAtiva API Build

**Input**: Design documents from `/specs/001-full-project-build/`

**Prerequisites**: plan.md ✅ | spec.md ✅

---

## Phase 0 — Infrastructure & Auth Setup

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

## Phase 1 — SolicitationType CRUD

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

## Phase 2 — PublicPhone CRUD

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

## Phase 3 — UF CRUD

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

## Phase 4 — City CRUD _(depends on Phase 3 — UF)_

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

## Phase 5 — Neighborhood CRUD _(depends on Phase 4 — City)_

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

## Phase 6 — User CRUD + Authentication _(depends on Phase 0)_

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
- [ ] T101 Create `UserController` (POST /users public, POST /authenticate public, all others protected) in `src/infra/controllers/UserController.ts`
- [ ] T102 Create `user.module.ts` (imports PassportModule, JwtModule with RS256 keys) in `src/modules/user/user.module.ts`

---

## Phase 7 — Solicitation CRUD _(depends on Phase 1 — SolicitationType + Phase 6 — User)_

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
- [ ] T113 Create `PrismaSolicitationRepository` in `src/infra/database/prisma/PrismaSolicitationRepository.ts`
- [ ] T114 [P] Create `solicitationSchemas` (Zod) in `src/infra/validation/schemas/solicitationSchemas.ts`
- [ ] T115 Create `SolicitationController` in `src/infra/controllers/SolicitationController.ts`
- [ ] T116 Create `solicitation.module.ts` in `src/modules/solicitation/solicitation.module.ts`

---

## Phase 8 — CoolAction CRUD _(depends on Phase 1 — SolicitationType + Phase 7 — Solicitation)_

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

## Phase 9 — DoneCoolAction CRUD _(depends on Phase 6 — User + Phase 8 — CoolAction)_

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

## Phase 10 — Finalize

- [ ] T145 Register all modules in `src/app.module.ts` (SolicitationTypeModule, PublicPhoneModule, UFModule, CityModule, NeighborhoodModule, UserModule, SolicitationModule, CoolActionModule, DoneCoolActionModule)
- [ ] T146 Create seed file `prisma/seed.ts` with all 27 Brazilian UFs and their respective cities using `prisma.uF.createMany` and `prisma.city.createMany`, register seed script in `package.json` under `"prisma": { "seed": "ts-node prisma/seed.ts" }`, and run `npx prisma db seed`
- [ ] T147 Run `npm run build` and fix all TypeScript errors
- [ ] T148 Run `npm test` and verify all use case unit tests pass
