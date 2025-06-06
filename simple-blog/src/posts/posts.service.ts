import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  // **关键**: create 方法现在接收一个 User 对象
  create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      authorId: user.id,
    });
    return this.postsRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  // **关键**: update 和 remove 方法接收 User 对象以进行权限检查
  async update(id: number, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.findOne(id);
    if (post.authorId !== user.id) {
      throw new ForbiddenException('你无权修改此文章');
    }
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number, user: User): Promise<void> {
    const post = await this.findOne(id);
    if (post.authorId !== user.id) {
      throw new ForbiddenException('你无权删除此文章');
    }
    await this.postsRepository.remove(post);
  }
}
