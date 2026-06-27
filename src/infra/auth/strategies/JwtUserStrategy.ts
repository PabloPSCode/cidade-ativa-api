import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { env } from '../../config/env.js';

const UserPayloadSchema = z.object({
  sub: z.string(),
  isAdmin: z.boolean(),
  cityId: z.string().optional(),
});

export type UserPayload = z.infer<typeof UserPayloadSchema>;

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt-user') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(env.jwtPublicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload): Promise<UserPayload> {
    return UserPayloadSchema.parse(payload);
  }
}
