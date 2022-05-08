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
import { Subject } from './Subject.model';
import Sequelize from 'sequelize';

export enum CredentialsType {
  EMAIL_WITH_PASSWORD = 'email_with_password',
}

@Table({
  tableName: 'polycode_auth_subject_credentials',
  freezeTableName: true,
  paranoid: true,
})
export class SubjectCredentials extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @Column({
    type: DataType.ENUM({ values: Object.values(CredentialsType) }),
    allowNull: false,
  })
  type: CredentialsType;

  @Column({ unique: true, allowNull: false })
  identity: string;

  @Column({ allowNull: false })
  secret: string;

  @BelongsTo(() => Subject, 'subject_id')
  subject: Subject;

  @ForeignKey(() => Subject)
  @Column({ field: 'subject_id' })
  subjectId: string;
}
