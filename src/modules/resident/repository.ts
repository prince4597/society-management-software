import { Resident } from '../../models';
import { BaseRepository } from '../../core/base.repository';
import type { ResidentAttributes } from '../../models/resident.model';
import type { CreateResidentInput, UpdateResidentInput } from './dto';

export class ResidentRepository extends BaseRepository<
  Resident,
  ResidentAttributes,
  CreateResidentInput,
  UpdateResidentInput,
  string
> {
  constructor() {
    super(Resident, 'Resident');
  }

  async findByEmail(email: string, societyId: string): Promise<Resident | null> {
    return Resident.findOne({
      where: { email, societyId },
    });
  }
}

export const residentRepository = new ResidentRepository();
