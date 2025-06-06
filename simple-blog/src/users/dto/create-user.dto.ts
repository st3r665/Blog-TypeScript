import { IsEAN, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    username: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6 , { message: 'Password must be at least 6 characters long' })
    password: string;
}