export interface User {
  friends?: User[];

  id?: number;
  username?: string;
  email?: string;
  bio?: string;
  mobileNo?: string;
  city?: string;
  profilePictureUrl?: string;
}
