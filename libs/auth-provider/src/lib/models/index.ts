import { OAuth2Client } from "./OAuth2Client.model";
import { OAuth2ClientGrants } from "./OAuth2ClientGrant.model";
import { OAuth2ClientUris } from "./OAuth2ClientRedirectUri.model";
import { OAuth2Token } from "./OAuth2Token.model";
import { Role } from "./Role.model";
import { RolePolicies } from "./RolePolicies.model";
import { Subject } from "./Subject.model";
import { SubjectCredentials } from "./SubjectCredentials.model";
import { SubjectRoles } from "./SubjectRoles.model";

export const sequelizeModels = [
  Subject,
  SubjectCredentials,
  SubjectRoles,
  OAuth2Client,
  OAuth2ClientGrants,
  OAuth2ClientUris,
  OAuth2Token,
  Role,
  RolePolicies,
];
