import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Society from './society.model';
import Resident, { ResidentAttributes } from './resident.model';

export enum OccupancyStatus {
  OWNER_OCCUPIED = 'OWNER_OCCUPIED',
  RENTED = 'RENTED',
  VACANT = 'VACANT',
}

export enum MaintenanceRule {
  DEFAULT_OWNER = 'DEFAULT_OWNER',
  CUSTOM_TENANT = 'CUSTOM_TENANT',
}

export enum MaintenanceStatus {
  PAID = 'PAID',
  DUE = 'DUE',
  OVERDUE = 'OVERDUE',
}

export enum UnitType {
  BHK_1 = '1 BHK',
  BHK_2 = '2 BHK',
  BHK_3 = '3 BHK',
  PENTHOUSE = 'Penthouse',
}

export interface PropertyAttributes {
  id: string;
  societyId: string;
  number: string;
  floor: number;
  block: string;
  unitType: UnitType;
  occupancyStatus: OccupancyStatus;
  maintenanceRule: MaintenanceRule;
  maintenanceStatus: MaintenanceStatus;
  ownerId?: string;
  tenantId?: string;
  squareFeet?: number;
  residents?: ResidentAttributes[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PropertyCreationAttributes extends Optional<
  PropertyAttributes,
  'id' | 'ownerId' | 'tenantId' | 'squareFeet'
> {}

class Property
  extends Model<PropertyAttributes, PropertyCreationAttributes>
  implements PropertyAttributes
{
  declare id: string;
  declare societyId: string;
  declare number: string;
  declare floor: number;
  declare block: string;
  declare unitType: UnitType;
  declare occupancyStatus: OccupancyStatus;
  declare maintenanceRule: MaintenanceRule;
  declare maintenanceStatus: MaintenanceStatus;
  declare ownerId?: string;
  declare tenantId?: string;
  declare squareFeet?: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt?: Date;

  declare readonly society?: Society;
  declare readonly owner?: Resident;
  declare readonly tenant?: Resident;
  declare residents?: ResidentAttributes[];
}

Property.init(
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
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    block: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitType: {
      type: DataTypes.ENUM(...Object.values(UnitType)),
      allowNull: false,
      defaultValue: UnitType.BHK_2,
      field: 'unit_type',
    },
    occupancyStatus: {
      type: DataTypes.ENUM(...Object.values(OccupancyStatus)),
      allowNull: false,
      defaultValue: OccupancyStatus.VACANT,
      field: 'occupancy_status',
    },
    maintenanceRule: {
      type: DataTypes.ENUM(...Object.values(MaintenanceRule)),
      allowNull: false,
      defaultValue: MaintenanceRule.DEFAULT_OWNER,
      field: 'maintenance_rule',
    },
    maintenanceStatus: {
      type: DataTypes.ENUM(...Object.values(MaintenanceStatus)),
      allowNull: false,
      defaultValue: MaintenanceStatus.PAID,
      field: 'maintenance_status',
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'owner_id',
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'tenant_id',
    },
    squareFeet: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'square_feet',
    },
  },
  {
    sequelize,
    tableName: 'properties',
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);

Property.belongsTo(Society, { foreignKey: 'societyId', as: 'society' });
Society.hasMany(Property, { foreignKey: 'societyId', as: 'properties' });

Property.belongsTo(Resident, { foreignKey: 'ownerId', as: 'owner' });
Property.belongsTo(Resident, { foreignKey: 'tenantId', as: 'tenant' });

export default Property;
