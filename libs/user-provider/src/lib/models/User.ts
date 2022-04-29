import { Column, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import Sequelize from 'sequelize';

@Table({
  tableName: 'polycode_user',
  freezeTableName: true,
  paranoid: true,
})
export class User extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({ defaultValue: Sequelize.UUIDV4 })
  id: string;

  @Column({ unique: true, allowNull: false })
  username: string;

  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ field: 'is_email_verified', allowNull: false, defaultValue: false })
  isEmailVerified: boolean;
}
