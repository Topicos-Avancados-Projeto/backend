import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Prop } from '@nestjs/mongoose';
import { QoSLevel } from './qosEnum.dto';
import { IsNotEmptyTrimmed } from '../decorator/exception.trim.decorator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  @IsNotEmptyTrimmed()
  readonly user_id: string;

  @IsNotEmpty()
  @IsBoolean()
  @Prop({ required: true })
  readonly cleansession: boolean;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  @IsNotEmptyTrimmed()
  readonly name: string;

  @IsString()
  @Prop({ required: true })
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Prop({ required: true })
  @IsNotEmptyTrimmed()
  readonly broker_port: number;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  @IsNotEmptyTrimmed()
  readonly broker_host: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  @IsNotEmptyTrimmed()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  @IsNotEmptyTrimmed()
  readonly password: string;

  @IsString()
  @Prop({ required: true })
  readonly lastwilltopic: string;

  @IsNotEmpty()
  @Prop({ required: true })
  @IsEnum(QoSLevel)
  @IsNotEmptyTrimmed()
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
  @IsNotEmptyTrimmed()
  readonly keepalive: number;
}
