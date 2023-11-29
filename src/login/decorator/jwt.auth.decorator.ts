import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Role } from '../enum/roles.enum';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from './roles.decorator';

export function JwtAuth(...roles: Role[]) {
  return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard));
}