import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err, user, info) {
    if (err || !user) {
      const message = info instanceof Error ? info.message : '认证失败';
      this.logger.warn(`[JwtAuthGuard] Authentication failed: ${message}`);
      throw err || new UnauthorizedException(message);
    }
    return user;
  }
}