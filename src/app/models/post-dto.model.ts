export interface PostDTO {
  id?: number;
  contentText: string;
  imageUrl?: string;
  createdAt: Date;
  likes?: number;
  user: {
    id: number;
    username: string;
    profilePictureUrl?: string;
  };
}
