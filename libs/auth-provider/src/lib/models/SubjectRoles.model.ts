import {
  Column,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Sequelize from 'sequelize';
import { Role } from './Role.model';
import { Subject } from './Subject.model';

@Table({
  tableName: 'polycode_auth_subject_roles',
  freezeTableName: true,
  paranoid: true,
})
export class SubjectRoles extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @ForeignKey(() => Subject)
  @Column({ field: 'subject_id' })
  subjectId: number;

  @ForeignKey(() => Role)
  @Column({ field: 'role_id' })
  roleId: number;
}
