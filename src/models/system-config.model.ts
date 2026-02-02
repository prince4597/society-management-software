import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SystemConfigAttributes {
  id: string;
  key: string;
  value: unknown;
  description?: string;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SystemConfigCreationAttributes = Optional<
  SystemConfigAttributes,
  'id' | 'description' | 'isPublic'
>;

class SystemConfig
  extends Model<SystemConfigAttributes, SystemConfigCreationAttributes>
  implements SystemConfigAttributes
{
  declare id: string;
  declare key: string;
  declare value: unknown;
  declare description?: string;
  declare isPublic: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

SystemConfig.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'system_configs',
    timestamps: true,
  }
);

export default SystemConfig;
