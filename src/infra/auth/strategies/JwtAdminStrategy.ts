import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { env } from '../../config/env.js';

const AdminPayloadSchema = z.object({
  sub: z.string(),
  isAdmin: z.boolean(),
  cityId: z.string().optional(),
});

export type AdminPayload = z.infer<typeof AdminPayloadSchema>;

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(env.jwtPublicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: AdminPayload): Promise<AdminPayload> {
    if (!payload.isAdmin) {
      throw new UnauthorizedException(
        'Only admins have access to this resource',
      );
    }
    return AdminPayloadSchema.parse(payload);
  }
}
