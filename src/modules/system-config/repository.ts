import SystemConfig from '../../models/system-config.model';
import { BaseRepository } from '../../core/base.repository';
import type {
  SystemConfigAttributes,
  SystemConfigCreationAttributes,
} from '../../models/system-config.model';

export class SystemConfigRepository extends BaseRepository<
  SystemConfig,
  SystemConfigAttributes,
  SystemConfigCreationAttributes,
  Partial<SystemConfigAttributes>,
  string
> {
  constructor() {
    super(SystemConfig, 'SystemConfig');
  }
}

export const systemConfigRepository = new SystemConfigRepository();
