# Endpoints and rules

## Users
- Create user. POST /users
- List users. GET /users?perPage=10&page=1
- Get user by Id. GET /users:id
- Get user by email. GET /users:email
- Update user. PUT /users:id
- Delete user. DELETE /users:id
- Authenticate user. POST /authenticate
- Authenticate user. POST /recovery-password

### RF
- Its not possible registering a new user with same email.
- Its not possible registering an user without a valid email.
- Its not possible updating an user that does not exists.
- Its not possible deleting an user that does not exists.
  
### RN
- User registration must follow ICreateUserDTO interface.
- User update must follow IUpdateUserDTO interface.
- User password must hashed using bcrypts lib with salt 6 level.
- All listage must be paginated with 10 items by default.
- Use UUID V4 to generate user ids.
- User authentication must be based on IAuthenticateUserDto (receiving email and password on req.body) and return the jwt token on the response.
- Use JWT passport strategy to authenticate user.
- Use different strategies for admin and regular user profiles. See the examples:

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { TEnvSchema } from "env";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";

const UserPayloadSchema = z.object({
  sub: z.string(),
  isAdmin: z.boolean(),
});

export type UserPayloadSchema = z.infer<typeof UserPayloadSchema>;

@Injectable()
export class JWTUserStrategy extends PassportStrategy(Strategy, "jwt-user") {
  constructor(public configService: ConfigService<TEnvSchema, true>) {
    const publicKey = configService.get("JWT_PUBLIC_KEY", { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, "base64"),
      algorithms: ["RS256"],
    });
  }
  async validate(payload: UserPayloadSchema) {
    return UserPayloadSchema.parse(payload);
  }
}
```

and 

```typescript
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { TEnvSchema } from "env";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";

const AdminPayloadSchema = z.object({
  sub: z.string(),
  isAdmin: z.boolean(),
});

export type AdminPayloadSchema = z.infer<typeof AdminPayloadSchema>;

@Injectable()
export class JWTAdminStrategy extends PassportStrategy(Strategy, "jwt-admin") {
  constructor(public configService: ConfigService<TEnvSchema, true>) {
    const publicKey = configService.get("JWT_PUBLIC_KEY", { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, "base64"),
      algorithms: ["RS256"],
    });
  }

  async validate(payload: AdminPayloadSchema) {
    if (!payload.isAdmin) {
      console.log("Received payload for validation:", payload);
      throw new UnauthorizedException(
        "Only admins have access to this resource"
      );
    }
    return AdminPayloadSchema.parse(payload);
  }
}

```

- All routes are protected by default, only routes related to authentication and password recovery are not protected.


## Authentication
### RF
- Its not possible registering a new user with same email.
- Its not possible registering an user without a valid email.
- Its not possible updating an user that does not exists.
- Its not possible deleting an user that does not exists.
  
### RN
- User registration must follow ICreateUserDTO interface.
- User update must follow IUpdateUserDTO interface.
- User password must hashed using bcrypts lib with salt 6 level.
- All listage must be paginated with 10 items by default.
- Use UUID V4 to generate user ids.

---

## Solicitations
- Create solicitation. POST /solicitations
- List solicitations. GET /solicitations?perPage=10&page=1
- List solicitations by userId. GET /solicitations?userId=1
- Get solicitation by Id. GET /solicitations:id
- Update solicitation. PUT /solicitations:id
- Delete solicitation. DELETE /solicitations:id

### RF
- Its not possible registering a new solicitation if user is a regular user and has at least 3 open solicitations with status different of solved.
- CounceilMan and Admin users can register new solicitations without any constraint.
- Its not possible creating a new solicitation using an invalid user.
- Its not possible creating a new solicitation using an invalid cool action.
- Its not possible updating a solicitation that does not exists.
- Its not possible deleting a solicitation that does not exists.
  
### RN
- Solicitation registration must follow ICreateSolicitationDTO interface.
- Solicitation update must follow IUpdateSolicitationDTO interface.
- All listage must be paginated with 10 items by default.
- Solicitation UUID V4 to generate solicitation ids.

---

## Cool actions
- Create cool action. POST /cool-actions
- List coolactions. GET /cool-actions?perPage=10&page=1
- Get cool action by Id. GET /cool-actions:id
- Update cool action. PUT /cool-actions:id
- Delete cool action. DELETE /cool-actions:id

### RF
- Its not possible registering a new cool action with same solicitationTypeId.
- Its not possible updating a cool action that does not exists.
- Its not possible deleting a cool action that does not exists.
  
### RN
- Cool action registration must follow ICreateCoolActionDTO interface.
- Cool action update must follow IUpdateCoolActionDTO interface.
- All listage must be paginated with 10 items by default.
- Cool action UUID V4 to generate cool action ids.

---

## Done cool actions
- Create done cool action. POST /done-cool-actions
- List done cool actions. GET /done-cool-actions?perPage=10&page=1
- List done cool actions by user. GET /done-cool-actions:userId?perPage=10&page=1
- Get done cool action by Id. GET /done-cool-actions:id
- Update done cool action. PUT /done-cool-actions:id
- Delete done cool action. DELETE /done-cool-actions:id

### RF
- Its not possible registering a new done cool action without a valid cool action.
- Its not possible registering a new done cool action without a valid user.
- Its not possible updating a done cool action that does not exists.
- Its not possible deleting a done cool action that does not exists.
  
### RN
- Done cool action registration must follow ICreateDoneCoolActionDTO interface.
- Done cool action update must follow IUpdateDoneCoolActionDTO interface.
- All listage must be paginated with 10 items by default.
- Done cool action UUID V4 to generate done cool action ids.

---

## Solicitation types
- Create solicitation type. POST /solicitation-types
- List solicitation types. GET /solicitation-types?perPage=10&page=1
- Get solicitation type by Id. GET /solicitation-types/:id
- Update solicitation type. PUT /solicitation-types/:id
- Delete solicitation type. DELETE /solicitation-types/:id

### RF
- Its not possible registering a new solicitation type with the same description.
- Its not possible updating a solicitation type that does not exists.
- Its not possible deleting a solicitation type that does not exists.
- Its not possible deleting a solicitation type that is linked to an existing solicitation or cool action.

### RN
- Solicitation type registration must follow ICreateSolicitationTypeDTO interface.
- Solicitation type update must follow IUpdateSolicitationTypeDTO interface.
- All listage must be paginated with 10 items by default.
- Use UUID V4 to generate solicitation type ids.

---

## Public phones
- Create public phone. POST /public-phones
- List public phones. GET /public-phones?perPage=10&page=1
- Get public phone by Id. GET /public-phones/:id
- Update public phone. PUT /public-phones/:id
- Delete public phone. DELETE /public-phones/:id

### RF
- Its not possible registering a new public phone with the same phone number.
- Its not possible updating a public phone that does not exists.
- Its not possible deleting a public phone that does not exists.

### RN
- Public phone registration must follow ICreatePublicPhoneDTO interface.
- Public phone update must follow IUpdatePublicPhoneDTO interface.
- All listage must be paginated with 10 items by default.
- Use UUID V4 to generate public phone ids.

---

## UFs
- Create UF. POST /ufs
- List UFs. GET /ufs?perPage=10&page=1
- Get UF by Id. GET /ufs/:id
- Update UF. PUT /ufs/:id
- Delete UF. DELETE /ufs/:id

### RF
- Its not possible registering a new UF with the same name.
- Its not possible updating a UF that does not exists.
- Its not possible deleting a UF that does not exists.
- Its not possible deleting a UF that has cities linked to it.

### RN
- UF registration must follow ICreateUFDTO interface.
- UF update must follow IUpdateUFDTO interface.
- All listage must be paginated with 10 items by default.
- Use UUID V4 to generate UF ids.

---

## Cities
- Create city. POST /cities
- List cities. GET /cities?perPage=10&page=1
- List cities by UF. GET /cities?ufId=:ufId&perPage=10&page=1
- Get city by Id. GET /cities/:id
- Update city. PUT /cities/:id
- Delete city. DELETE /cities/:id

### RF
- Its not possible registering a new city with the same name in the same UF.
- Its not possible registering a new city with an invalid UF.
- Its not possible updating a city that does not exists.
- Its not possible deleting a city that does not exists.
- Its not possible deleting a city that has neighborhoods linked to it.

### RN
- City registration must follow ICreateCityDTO interface.
- City update must follow IUpdateCityDTO interface.
- All listage must be paginated with 10 items by default.
- Use UUID V4 to generate city ids.

---

## Neighborhoods
- Create neighborhood. POST /neighborhoods
- List neighborhoods. GET /neighborhoods?perPage=10&page=1
- List neighborhoods by city. GET /neighborhoods?cityId=:cityId&perPage=10&page=1
- Get neighborhood by Id. GET /neighborhoods/:id
- Update neighborhood. PUT /neighborhoods/:id
- Delete neighborhood. DELETE /neighborhoods/:id

### RF
- Its not possible registering a new neighborhood with the same name in the same city.
- Its not possible registering a new neighborhood with an invalid city.
- Its not possible updating a neighborhood that does not exists.
- Its not possible deleting a neighborhood that does not exists.

### RN
- Neighborhood registration must follow ICreateNeighborhoodDTO interface.
- Neighborhood update must follow IUpdateNeighborhoodDTO interface.
- All listage must be paginated with 10 items by default.
- Use UUID V4 to generate neighborhood ids.
