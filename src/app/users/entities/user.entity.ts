export class User {
  id?: number;
  uuid!: number;
  username!: string;
  email!: string;
  password?: string;
  firstName!: string;
  lastName!: string;
  sex?: UserSex;
  role!: UserRole;
  isActive?: boolean;
  activationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER"
}

export enum UserSex {
  MALE = "M",
  FEMALE = "F"
}
