import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards, 
  Logger,
  Req, // 1. 导入 @Req 装饰器和 Request 类型
  InternalServerErrorException 
} from '@nestjs/common';
import { Request } from 'express'; // 2. 导入 Express 的 Request 类型
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { GetUser } from '../auth/decorators/get-user.decorator'; // 3. 暂时不使用 GetUser
import { User } from '../users/entities/user.entity';

@Controller('posts')
export class PostsController {
private readonly logger = new Logger(PostsController.name);

constructor(private readonly postsService: PostsService) {}

@UseGuards(JwtAuthGuard)
@Post()
// 4. 将 @GetUser() user: User 替换为 @Req() req: Request
create(@Body() createPostDto: CreatePostDto, @Req() req: Request & { user?: User }) { 
  // 5. 从 req.user 手动获取 user 对象
  const user = req.user as User;

  // 6. 添加详细的日志来检查 req.user 的内容
  this.logger.log(`[PostsController - create] Received user from req.user: ${JSON.stringify(user)}`);

  // 7. 进行最终的、明确的检查
  if (!user || typeof user.id === 'undefined') {
    this.logger.error('[PostsController - create] req.user is null, undefined, or does not have an ID. This indicates a critical failure in the JwtStrategy or JwtAuthGuard.');
    throw new InternalServerErrorException('认证流程失败，无法从请求中正确解析用户。');
  }
  
  // 8. 如果检查通过，正常调用 service
  return this.postsService.create(createPostDto, user);
}

// 其他路由保持不变，但为了完整性，也进行类似修改

@Get()
findAll() {
  return this.postsService.findAll();
}

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.postsService.findOne(id);
}

@UseGuards(JwtAuthGuard)
@Patch(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto, @Req() req: Request  & { user?: User }) {
  const user = req.user as User;
  if (!user) throw new InternalServerErrorException('用户认证信息丢失。');
  return this.postsService.update(id, updatePostDto, user);
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request & { user?: User }) {
  const user = req.user as User;
  if (!user) throw new InternalServerErrorException('用户认证信息丢失。');
  return this.postsService.remove(id, user);
}
}