import { IsEmail, IsNotEmpty, Length } from "class-validator"

export class CreateUserDto { 
  @IsNotEmpty() 
  name: string;

  @IsNotEmpty() 
  @IsEmail()
  email: string;

  @IsNotEmpty() 
  @Length(5)
  password: string;
}
