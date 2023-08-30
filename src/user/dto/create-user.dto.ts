import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class User_post_schema {
    @IsNotEmpty()
    @IsString()
    readonly name: string
  
    @IsNotEmpty()
    @IsString()
    readonly cpf: string
  
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string

    @IsNotEmpty()
    @IsString()
    readonly date_of_birth: string
  }