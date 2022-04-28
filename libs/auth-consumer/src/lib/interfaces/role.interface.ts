import { IRolePolicy } from './policy.interface';

export interface IRole {
  id: string;
  name: string;
  description: string;
  polices: IRolePolicy[];
}
