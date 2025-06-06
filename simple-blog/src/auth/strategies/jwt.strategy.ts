import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<User> {
    this.logger.log(`[JwtStrategy] Validating payload for user ID: ${payload.sub}`);
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      this.logger.warn(`[JwtStrategy] User with ID ${payload.sub} not found.`);
      throw new UnauthorizedException('Token无效 (用户不存在)');
    }
    return user;
  }
}