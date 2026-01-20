export interface Post {
  id?: number;
  contentText: string;
  imageUrl?: string;
  createdAt: Date;  // remove "?" to indicate it's required
  likes?: number;
  user: {
    id: number;
    username: string;
    profilePictureUrl?: string;
  };
}
