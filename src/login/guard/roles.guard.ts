import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enum/roles.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { ResourceOwnershipChecker } from '../interfaces/resource.ownership.checker';
import { OWNER_CHECKER } from '../decorator/ownership.checker.decorator';
import {
  NoOwnershitCheckerException,
  NoResourceToCheckException,
} from '../exception/ownership.checker.exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private moduleRef: ModuleRef) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.getRolesMetadata(context);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const ownershipMetadata = this.getOwnershipMetadata(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasSomeRole = requiredRoles.some((role) => user.role === role);
    if (!hasSomeRole && requiredRoles.includes(Role.OWNER)) {
      const resourceId = request.params?.id ? request.params?.id : null;
      if (!resourceId && request.method === 'GET') {
        this.fillOwnershipQueryParam(user, request);
        return true;
      }
      if (this.checkOwnership(resourceId, user.id, ownershipMetadata)) {
        return true;
      }
    }
    if (hasSomeRole) {
      return true;
    }
    throw new ForbiddenException('Access forbidden for this user.');
  }

  private getRolesMetadata(context: ExecutionContext): Role[] {
    return this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getOwnershipMetadata(
    context: ExecutionContext,
  ): ResourceOwnershipChecker | Type<ResourceOwnershipChecker> {
    return this.reflector.getAllAndOverride<
      ResourceOwnershipChecker | Type<ResourceOwnershipChecker>
    >(OWNER_CHECKER, [context.getHandler(), context.getClass()]);
  }

  private checkOwnership(
    resourceId: any,
    userId: any,
    ownershipMetadata:
      | ResourceOwnershipChecker
      | Type<ResourceOwnershipChecker>,
  ): boolean {
    if (!ownershipMetadata) {
      throw new NoOwnershitCheckerException();
    }
    if (!resourceId) {
      throw new NoResourceToCheckException();
    }
    let ownershipChecker: ResourceOwnershipChecker = null;
    if (typeof ownershipMetadata === 'object') {
      ownershipChecker = ownershipMetadata;
    } else {
      ownershipChecker = this.moduleRef.get(
        ownershipMetadata as Type<ResourceOwnershipChecker>,
      );
    }
    return ownershipChecker.checkOwnership(resourceId, userId);
  }

  private fillOwnershipQueryParam(user, request): void {
    if (!request.query) request.query = {};
    request.query.owner = user.id;
  }
}
