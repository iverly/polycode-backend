import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CASL_DECORATOR_POLICIES } from './casl.constants';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PolicyHandler, SubjectAbility } from './casl.types';
import { Request } from 'express';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  /**
   * It gets the policies from the request, creates an ability object from the policies, and then
   * executes the policy handlers
   * @param {ExecutionContext} context - ExecutionContext - The context of the request.
   * @returns A boolean value.
   */
  canActivate(context: ExecutionContext): boolean {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CASL_DECORATOR_POLICIES,
        context.getHandler()
      ) || [];

    const request: Request = context.switchToHttp().getRequest();

    /* Getting the policies from the request and then creating an ability object from the policies. */
    const policies =
      request.authorization?.roles
        ?.map((role) => [
          ...role.polices.map((policy) => ({
            action: policy.action,
            resource: policy.resource,
            attributes: this.replaceAttributesTemplate(
              policy.attributes || {},
              request
            ),
          })),
        ])
        .reduce((base, next) => base.concat(next), []) || [];

    console.log(policies);
    const ability = this.caslAbilityFactory.create(policies);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability, request)
    );
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: SubjectAbility,
    request: Request
  ) {
    if (typeof handler === 'function') {
      return handler(ability, request);
    }
    return handler.handle(ability, request);
  }

  private replaceAttributesTemplate(
    attributes: Record<string, unknown>,
    request: Request
  ) {
    for (const attribute of Object.keys(attributes)) {
      if (typeof attributes[attribute] !== 'string') {
        continue;
      }

      const attr: string = attributes[attribute] as string;

      if (attr === '@me') {
        attributes[attribute] =
          request.authorization?.subject?.internalIdentifier;
      }
    }

    return attributes;
  }
}
