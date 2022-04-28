import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Sequelize from 'sequelize';
import { OAuth2Client } from './OAuth2Client.model';
import { OAuth2ClientGrant } from './OAuth2ClientGrant.model';
import { Subject } from './Subject.model';

export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

@Table({
  tableName: 'polycode_auth_oauth2_token',
  freezeTableName: true,
  paranoid: true,
})
export class OAuth2Token extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @Column({ allowNull: false, field: 'hashed_token' })
  hashedToken: string;

  @Column({ allowNull: false, field: 'token_expire_at' })
  tokenExpireAt: Date;

  @Column({
    type: DataType.ENUM({ values: Object.values(TokenType) }),
    allowNull: false,
  })
  type: TokenType;

  @Column({
    type: DataType.ENUM({
      values: Object.values(OAuth2ClientGrant),
    }),
    allowNull: false,
    field: 'grant_with',
  })
  grantWith: OAuth2ClientGrant;

  @BelongsTo(() => OAuth2Client, 'requested_client_id')
  client: OAuth2Client;

  @ForeignKey(() => OAuth2Client)
  @Column({ field: 'requested_client_id' })
  requestedClientId: string;

  @BelongsTo(() => Subject, 'subject_id')
  subject: Subject;

  @ForeignKey(() => Subject)
  @Column({ field: 'subject_id' })
  subjectId: string;
}
