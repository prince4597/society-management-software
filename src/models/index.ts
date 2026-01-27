import Admin from './admin.model';
import SystemConfig from './system-config.model';
import Society from './society.model';
import Resident from './resident.model';
import Property from './property.model';

export { Admin, SystemConfig, Society, Resident, Property };

export const initializeModels = (): void => {
  // Define reverse associations for Resident
  Resident.hasMany(Property, { foreignKey: 'ownerId', as: 'ownedProperties' });
  Resident.hasMany(Property, { foreignKey: 'tenantId', as: 'rentedProperties' });
};
