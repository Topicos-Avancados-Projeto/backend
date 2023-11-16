import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class CreateDeviceTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsObject()
  @IsNotEmpty()
  attributes: Record<string, string>;
}
