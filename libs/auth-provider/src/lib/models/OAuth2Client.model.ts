import {
  Column,
  DataType,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OAuth2ClientGrants } from './OAuth2ClientGrant.model';
import { OAuth2ClientUris } from './OAuth2ClientRedirectUri.model';

@Table({
  tableName: 'polycode_auth_oauth2_client',
  freezeTableName: true,
  paranoid: true,
})
export class OAuth2Client extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column({ type: DataType.TEXT })
  secret: string;

  @HasMany(() => OAuth2ClientGrants, 'client_id')
  grants: OAuth2ClientGrants[];

  @HasMany(() => OAuth2ClientUris, 'client_id')
  redirectUris: OAuth2ClientUris[];

  @HasMany(() => OAuth2ClientUris, 'requested_client_id')
  tokensRequested: OAuth2ClientUris[];
}
