import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const payload = { username: user.username, sub: user.id, email: user.email };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmailForAuth(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const { password, ...result } = user;
    const payload = { username: result.username, sub: result.id, email: result.email };
    return {
      ...result,
      accessToken: this.jwtService.sign(payload),
    };
  }
}