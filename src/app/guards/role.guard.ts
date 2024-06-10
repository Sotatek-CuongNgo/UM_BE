import { ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../enums/common.enum';
import { ACCESS_ROLES_KEY } from '../decorators/allow-access';

@Injectable()
export class RoleGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const allowAccessRoles = this.reflector.getAllAndOverride<Roles[]>(ACCESS_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const roleCodes = user.roles.map((role) => role.code);
    if (!allowAccessRoles.length || roleCodes.some((code) => allowAccessRoles.includes(code))) {
      return user;
    }

    throw new ForbiddenException();
  }
}
