import { Model, DataTypes, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../config/database';
import Society from './society.model';
import { RoleName, VALID_ROLES } from '../constants/roles';

interface AdminAttributes {
  id: string;
  role: string;
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
  declare role: string;
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

  declare readonly society?: Society;
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [VALID_ROLES],
      },
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
      beforeValidate: (admin: Admin) => {
        // Business Logic Consistency Checks
        if (admin.role === (RoleName.SUPER_ADMIN as string)) {
          if (admin.societyId) {
            throw new Error('Super Admin cannot be assigned to a society');
          }
        } else if (admin.role === (RoleName.SOCIETY_ADMIN as string)) {
          if (!admin.societyId) {
            throw new Error('Society Admin must be assigned to a society');
          }
        }
      },
      beforeCreate: async (admin: Admin) => {
        if (admin.role === (RoleName.SUPER_ADMIN as string)) {
          const count = await (admin.constructor as typeof Admin).count({
            where: { role: RoleName.SUPER_ADMIN as string },
          });
          if (count > 0) {
            throw new Error('Only one Super Admin is allowed in the system');
          }
        }
      },
      beforeSave: async (admin: Admin) => {
        if (admin.changed('password')) {
          admin.password = await bcrypt.hash(admin.password, 10);
        }
      },
    },
  }
);

Admin.belongsTo(Society, { foreignKey: 'societyId', as: 'society' });
Society.hasMany(Admin, { foreignKey: 'societyId', as: 'admins' });

export default Admin;
