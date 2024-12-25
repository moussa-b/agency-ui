import { Sex } from '../../core/models/sex.enum';

export class SaveClientDto {
  address?: string;
  phone?: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  sex?: Sex;
}
