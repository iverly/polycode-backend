import { IsEnum, IsString, IsUUID, ValidateIf } from 'class-validator';
import { OAuth2ClientGrant } from '../../models/OAuth2ClientGrant.model';

export class OAuth2AuthenticateDto {
  @ValidateIf((o) => o.grant_type !== OAuth2ClientGrant.IMPLICIT)
  @IsUUID(4)
  client_id: string;

  @ValidateIf((o) => o.grant_type !== OAuth2ClientGrant.IMPLICIT)
  @IsString()
  client_secret: string;

  @IsEnum(OAuth2ClientGrant)
  grant_type: OAuth2ClientGrant;

  @ValidateIf((o) =>
    [OAuth2ClientGrant.IMPLICIT, OAuth2ClientGrant.PASSWORD].includes(
      o.grant_type,
    ),
  )
  @IsString()
  identity: string;

  @ValidateIf((o) =>
    [OAuth2ClientGrant.IMPLICIT, OAuth2ClientGrant.PASSWORD].includes(
      o.grant_type,
    ),
  )
  @IsString()
  secret: string;
}
