export interface Meetup {
  id?: number;
  title: string;
  location: string;
  animal: string;
  dateTime: string;

  creator?: {
    id: number;
    username: string;
  };

  participants?: {
    id: number;
    username: string;
  }[];
}
