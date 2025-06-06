import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }
    const user = this.usersRepository.create(createUserDto);
    const savedUser = await this.usersRepository.save(user);
    // 使用类型断言来安全地删除属性
    delete (savedUser as Partial<User>).password;
    return savedUser;
  }

  // **关键**: 专门为登录验证创建的方法，它会显式选择 password 字段
  async findOneByEmailForAuth(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
  }
  
  // 用于 JWT 策略验证，不需要密码
  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
