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
import { Role } from './Role.model';

export enum Action {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Table({
  tableName: 'polycode_auth_role_policies',
  freezeTableName: true,
  paranoid: true,
})
export class RolePolicies extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM({ values: Object.values(Action) }),
  })
  action: Action;

  @Column({ allowNull: false })
  resource: string;

  @Column({ allowNull: true, type: DataType.JSON })
  attributes: object;

  @BelongsTo(() => Role, 'role_id')
  role: Role;

  @ForeignKey(() => Role)
  @Column({ field: 'role_id' })
  roleId: string;
}
