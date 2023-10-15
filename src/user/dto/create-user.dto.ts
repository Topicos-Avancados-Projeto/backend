import { IsOptional, IsString } from 'class-validator';

export class User_post_schema {
  @IsString()
  readonly name: string;

  @IsString()
  readonly cpf: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly date_of_birth: string;
}

export class UserQueryDto {
  @IsOptional()
  owner: any;
}
