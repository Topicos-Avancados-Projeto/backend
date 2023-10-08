import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { QoSLevel } from './qosEnum.dto';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  readonly user_id: string;

  @IsNotEmpty()
  @IsBoolean()
  @Prop({ required: true })
  readonly cleansession: boolean;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  readonly name: string;

  @IsString()
  @Prop({ required: true })
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Prop({ required: true })
  readonly broker_port: number;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  readonly broker_host: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  readonly password: string;

  @IsString()
  @Prop({ required: true })
  readonly lastwilltopic: string;

  @IsNotEmpty()
  @Prop({ required: true })
  @IsEnum(QoSLevel)
  readonly lastwillqos: QoSLevel;

  @IsString()
  @Prop({ required: true })
  readonly lastwillmessage: string;

  @IsBoolean()
  @Prop({ required: true })
  readonly lastwillretain: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Prop({ required: true })
  readonly keepalive: number;
}
