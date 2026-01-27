import { Society } from '../../models';
import { BaseRepository } from '../../core/base.repository';
import type { SocietyAttributes } from '../../models/society.model';
import type { CreateSocietyInput, UpdateSocietyInput } from './dto';

export class SocietyRepository extends BaseRepository<
  Society,
  SocietyAttributes,
  CreateSocietyInput['society'],
  UpdateSocietyInput,
  string
> {
  constructor() {
    super(Society, 'Society');
  }

  async findByCode(code: string): Promise<SocietyAttributes | null> {
    const record = await this.model.findOne({
      where: { code: code.toUpperCase() },
      paranoid: false,
    });
    return record ? record.toJSON() : null;
  }
}

export const societyRepository = new SocietyRepository();
