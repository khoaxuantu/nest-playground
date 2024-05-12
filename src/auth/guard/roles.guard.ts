import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY, Role } from "../constant/role.constant";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    )

    if (!requiredRoles || requiredRoles.length == 0) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
