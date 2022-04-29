import { Ability } from '@casl/ability';
import { Request } from 'express';

/* Creating an enum with the values of Manage, Create, Read, Update, and Delete. */
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

/* This is defining the shape of the policy object. */
export interface Policy {
  action: Action;
  resource: string;
  attributes?: Record<string, unknown>;
}
export type Policies = Policy[];

export type SubjectAbility = Ability<
  [Action, string | Record<string, unknown>]
>;

export type PolicyHandlerCallback = (
  ability: SubjectAbility,
  request: Request
) => boolean;

export interface IPolicyHandler {
  handle(ability: SubjectAbility, request: Request): boolean;
}

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
