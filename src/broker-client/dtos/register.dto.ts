import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QoS } from './willqos.dto';
import { Prop } from '@nestjs/mongoose';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  user_Id: string;

  @IsNotEmpty()
  @IsBoolean()
  @Prop({ required: true })
  cleansession: boolean;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  name: string;

  @IsString()
  @Prop({ required: true })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Prop({ required: true })
  broker_port: number;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  broker_host: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  password: string;

  @IsString()
  @Prop({ required: true })
  lastwilltopic: string;

  @IsNotEmpty()
  @Prop({ required: true })
  @ValidateNested()
  @Type(() => QoS)
  lastwillqos: QoS;

  @IsString()
  @Prop({ required: true })
  lastwillmessage: string;

  @IsBoolean()
  @Prop({ required: true })
  lastwillretain: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Prop({ required: true })
  keepalive: number;
}
