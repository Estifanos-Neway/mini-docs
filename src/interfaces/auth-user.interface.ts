export enum UserRole {
  Admin = 'Admin',
  Client = 'Client',
}

export interface AuthUser {
  id: string;
  email: string;
  fullname: string;
  role: UserRole;
}
