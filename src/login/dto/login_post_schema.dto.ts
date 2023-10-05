import { IsNotEmpty, IsString } from "class-validator"

export class login_post_schema{
    @IsNotEmpty()
    @IsString()
    cpf: string
    
    @IsNotEmpty()
    @IsString()
    password: string
  }