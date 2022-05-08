import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { OAuth2Token } from './OAuth2Token.model';
import { SubjectCredentials } from './SubjectCredentials.model';
import { Role } from './Role.model';
import { SubjectRoles } from './SubjectRoles.model';
import Sequelize from 'sequelize';

export enum SubjectType {
  USER = 'user',
}

@Table({
  tableName: 'polycode_auth_subject',
  freezeTableName: true,
  paranoid: true,
})
export class Subject extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @IsUUID(4)
  @Column({ unique: true, allowNull: false, field: 'internal_identifier' })
  internalIdentifier: string;

  @Column({
    type: DataType.ENUM({ values: Object.values(SubjectType) }),
    allowNull: false,
  })
  type: SubjectType;

  @HasOne(() => SubjectCredentials, 'subject_id')
  credentials: SubjectCredentials;

  @HasMany(() => OAuth2Token, 'subject_id')
  tokens: OAuth2Token;

  @BelongsToMany(() => Role, () => SubjectRoles)
  roles: Role[];
}
