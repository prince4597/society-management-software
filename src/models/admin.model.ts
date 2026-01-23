import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database';
import Role from './role.model';
import Society from './society.model';

interface AdminAttributes {
  id: string;
  roleId: string;
  societyId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AdminCreationAttributes extends Optional<AdminAttributes, 'id' | 'isActive'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  declare id: string;
  declare roleId: string;
  declare societyId?: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phoneNumber: string;
  declare password: string;
  declare isActive: boolean;
  declare lastLogin?: Date;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt?: Date;

  // Associations
  declare readonly role?: Role;
  declare readonly society?: Society;
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'role_id',
    },
    societyId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'society_id',
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'phone_number',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login',
    },
  },
  {
    sequelize,
    tableName: 'admins',
    underscored: true,
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeSave: async (admin: Admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      },
    },
  }
);

// Define Associations
Admin.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(Admin, { foreignKey: 'roleId', as: 'admins' });

Admin.belongsTo(Society, { foreignKey: 'societyId', as: 'society' });
Society.hasMany(Admin, { foreignKey: 'societyId', as: 'admins' });

export default Admin;
