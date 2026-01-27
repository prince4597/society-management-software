import { Property } from '../../models';
import { BaseRepository } from '../../core/base.repository';
import type { PropertyAttributes } from '../../models/property.model';
import type { CreatePropertyInput, UpdatePropertyInput } from './dto';

export class PropertyRepository extends BaseRepository<
  Property,
  PropertyAttributes,
  CreatePropertyInput,
  UpdatePropertyInput,
  string
> {
  constructor() {
    super(Property, 'Property', ['number', 'block']);
  }
}

export const propertyRepository = new PropertyRepository();
