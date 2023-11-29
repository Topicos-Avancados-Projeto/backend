import { IsNotEmpty, IsString } from "class-validator"

export class login_get_schema{

    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    email: string
}