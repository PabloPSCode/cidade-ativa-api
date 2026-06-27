# Endpoints and rules

## Cities
- Create city. POST /cities
- List cities. GET /cities?perPage=10&page=1
- Get city by Id. GET /cities:id
- Update city. PUT /cities:id
- Delete city. DELETE /cities:id

### RF
- Its not possible registering a new city with same name.
- Its not possible updating an city that does not exists.
- Its not possible deleting an city that does not exists.
  
### RN
- City registration must follow ICreateCityDTO interface.
- City update must follow IUpdateCityDTO interface.
- All listage must be paginated with 10 items by default.
- Use UUID V4 to generate cities ids.
- This entity is a Tenant Table.

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
- Get solicitation by Id. GET /solicitations/:id
- Solve solicitation. POST /solicitations/:id/solve
- Update solicitation. PUT /solicitations/:id
- Delete solicitation. DELETE /solicitations/:id

### RF
- Its not possible registering a new solicitation if user is a regular user and has at least 3 open solicitations with status different of solved.
- CounceilMan and Admin users can register new solicitations without any constraint.
- Its not possible creating a new solicitation using an invalid user.
- Its not possible creating a new solicitation using an invalid cool action.
- Its not possible updating a solicitation that does not exists.
- Its not possible deleting a solicitation that does not exists.
- Its not possible solving a solicitation that does not exists.
- Solving a solicitation requires at least one solved photo URL.
- Only users creates a new solicitation, the administration does not creates solicitations.
- A new solicitation always is created with "waiting_approval" status waiting for the city admin approval.

### RN
- Solicitation registration must follow ICreateSolicitationDTO interface.
- Solicitation update must follow IUpdateSolicitationDTO interface.
- Solicitation solve must follow ISolveSolicitationDTO interface: `{ solvedImageUrls: string[], solvedCommentary?: string, solvedUserId: string }`.
- Solving a solicitation automatically sets status to `resolved` and records the current timestamp as `solvedDate`.
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

## Vote Options
- Create vote option. POST /vote-options
- List vote options. GET /vote-options?perPage=10&page=1
- List vote options by vote. GET /vote-options?voteId=id&perPage=10&page=1
- Get vote option by Id. GET /vote-options/:id
- Update vote option. PUT /vote-options/:id
- Delete vote option. DELETE /vote-options/:id
  
### RF
- Its not possible listing vote options for a non existing vote.
- Its not possible listing vote options that does not exists.
- Its not possible updating a vote option that does not exists.
- Its not possible deleting a vote option that does not exists.
- Its not possible deleting a vote option that is linked to an existing vote.

### RN
- Vote option registration must follow ICreateVoteOptionDTO interface.
- Vote option update must follow IUpdateVoteOptionDTO interface.
- Use UUID V4 to generate vote option.

---

## Vote
- Create vote. POST /votes
- List votes. GET /votes?perPage=10&page=1
- List votes by poll. GET /votes?pollId=id&perPage=10&page=1
- Get vote by Id. GET /votes/:id
- Update vote. PUT /votes/:id
- Delete vote. DELETE /votes/:id
  
### RF
- Its not possible listing votes for a non existing poll.
- Its not possible listing votes that does not exists.
- Its not possible updating a vote that does not exists.
- Its not possible deleting a vote that does not exists.
- Its not possible deleting a vote that is linked to an existing poll.

### RN
- Vote registration must follow ICreateVoteDTO interface.
- Vote update must follow IUpdateVoteDTO interface.
- Use UUID V4 to generate vote.
  
---

## Polls
- Create poll. POST /polls
- List polls. GET /polls?perPage=10&page=1
- Get poll by Id. GET /polls/:id
- Update poll. PUT /polls/:id
- Delete poll. DELETE /polls/:id
  
### RF
- Its not possible listing polls that does not exists.
- Its not possible updating a poll that does not exists.
- Its not possible deleting a poll that does not exists.

### RN
- Vote registration must follow ICreatePollDTO interface.
- Vote update must follow IUpdatePollDTO interface.
- Use UUID V4 to generate vote.