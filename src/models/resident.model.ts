import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Society from './society.model';

export enum ResidentRole {
  PRIMARY_OWNER = 'PRIMARY_OWNER',
  TENANT = 'TENANT',
  FAMILY_MEMBER = 'FAMILY_MEMBER',
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phoneNumber?: string;
  email?: string;
}

export interface ResidentAttributes {
  id: string;
  societyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: ResidentRole;
  isResident: boolean;
  familyMembers?: FamilyMember[];
  flatIds?: string[];
  profileImage?: string;
  coHabitants?: ResidentAttributes[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ResidentCreationAttributes extends Optional<
  ResidentAttributes,
  'id' | 'familyMembers' | 'profileImage'
> { }

class Resident
  extends Model<ResidentAttributes, ResidentCreationAttributes>
  implements ResidentAttributes {
  declare id: string;
  declare societyId: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare phoneNumber: string;
  declare role: ResidentRole;
  declare isResident: boolean;
  declare familyMembers?: FamilyMember[];
  declare flatIds?: string[];
  declare profileImage?: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt?: Date;

  declare readonly society?: Society;
}

Resident.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    societyId: {
      type: DataTypes.UUID,
      allowNull: false,
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
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'phone_number',
    },
    role: {
      type: DataTypes.ENUM(...Object.values(ResidentRole)),
      allowNull: false,
      defaultValue: ResidentRole.TENANT,
    },
    isResident: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_resident',
    },
    familyMembers: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'family_members',
    },
    flatIds: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      field: 'flat_ids',
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_image',
    },
  },
  {
    sequelize,
    tableName: 'residents',
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

Resident.belongsTo(Society, { foreignKey: 'societyId', as: 'society' });
Society.hasMany(Resident, { foreignKey: 'societyId', as: 'residents' });

export default Resident;
