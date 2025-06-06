import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
  
  // **关键**: 移除 authorId，因为它将从 Token 中自动获取
}