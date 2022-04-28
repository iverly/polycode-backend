import {
  BelongsToMany,
  Column,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import Sequelize from 'sequelize';
import { RolePolicies } from './RolePolicies.model';
import { Subject } from './Subject.model';
import { SubjectRoles } from './SubjectRoles.model';

@Table({
  tableName: 'polycode_auth_role',
  freezeTableName: true,
  paranoid: true,
})
export class Role extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @Column({ unique: true, allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @HasMany(() => RolePolicies, 'role_id')
  policies: RolePolicies[];

  @BelongsToMany(() => Subject, () => SubjectRoles)
  subjects: Subject[];
}
