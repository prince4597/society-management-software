import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SocietyAttributes {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  email?: string;
  phone?: string;
  totalFlats: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SocietyCreationAttributes extends Optional<
  SocietyAttributes,
  'id' | 'isActive' | 'totalFlats' | 'country'
> {}

class Society
  extends Model<SocietyAttributes, SocietyCreationAttributes>
  implements SocietyAttributes
{
  declare id: string;
  declare name: string;
  declare code: string;
  declare address: string;
  declare city: string;
  declare state: string;
  declare country: string;
  declare zipCode: string;
  declare email?: string;
  declare phone?: string;
  declare totalFlats: number;
  declare isActive: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt?: Date;
}

Society.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'India',
    },
    zipCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'zip_code',
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    totalFlats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'total_flats',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'societies',
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

export default Society;
