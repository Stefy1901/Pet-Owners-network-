import { User } from './user.model';

export interface PetAlert {
  id?: number;
  description: string;
  lastLocation: string;
  imageUrl?: string;
  city: string;
  contactEmail: string;
  contactPhone: string;
  reward?: string;
  createdAt: string;
  user: User;
}
