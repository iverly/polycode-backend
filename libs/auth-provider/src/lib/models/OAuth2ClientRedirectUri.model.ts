import { IsUrl } from 'class-validator';
import {
  BelongsTo,
  Column,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OAuth2Client } from './OAuth2Client.model';

@Table({
  tableName: 'polycode_auth_oauth2_client_redirect_uris',
  freezeTableName: true,
  paranoid: true,
})
export class OAuth2ClientUris extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @IsUrl({ protocols: ['http', 'https'] })
  @Column
  uri: string;

  @BelongsTo(() => OAuth2Client, 'client_id')
  client: OAuth2Client;

  @ForeignKey(() => OAuth2Client)
  @Column({ field: 'client_id' })
  clientId: string;
}
