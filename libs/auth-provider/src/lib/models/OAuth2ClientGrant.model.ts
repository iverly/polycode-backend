import { BelongsTo, ForeignKey } from 'sequelize-typescript';
import { OAuth2Client } from './OAuth2Client.model';
import {
  Column,
  DataType,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum OAuth2ClientGrant {
  AUTHORIZATION_CODE = 'authorization_code',
  CLIENT_CREDENTIALS = 'client_credentials',
  REFRESH_TOKEN = 'refresh_token',
  PASSWORD = 'password',
  IMPLICIT = 'implicit',
}

@Table({
  tableName: 'polycode_auth_oauth2_client_grants',
  freezeTableName: true,
  paranoid: true,
})
export class OAuth2ClientGrants extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @Column({ type: DataType.ENUM({ values: Object.values(OAuth2ClientGrant) }) })
  grant: OAuth2ClientGrants;

  @BelongsTo(() => OAuth2Client, 'client_id')
  client: OAuth2Client;

  @ForeignKey(() => OAuth2Client)
  @Column({ field: 'client_id' })
  clientId: string;
}
