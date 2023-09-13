import { RegisterDto } from './register.dto';
import { PartialType } from '@nestjs/mapped-types';

export class DtoUpdate extends PartialType(RegisterDto) {}
