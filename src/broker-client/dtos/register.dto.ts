import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UUID } from 'crypto';
import { QoS } from './willqos.dto';

export class RegisterDto {
  @IsNotEmpty()
  @IsUUID()
  userId: UUID;

  @IsNotEmpty()
  @IsBoolean()
  cleansession: boolean;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  broker_port: number;

  @IsNotEmpty()
  @IsString()
  broker_host: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  lastwilltopic: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => QoS)
  lastwillqos: QoS;

  @IsString()
  lastwillmessage: string;

  @IsBoolean()
  lastwillretain: boolean;

  @IsNotEmpty()
  @IsNumber()
  keepalive: number;
}
