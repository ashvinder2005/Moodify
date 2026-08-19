export interface ISong {
  _id: string; // Used by frontend for tracking history/playing
  title: string;
  artist: string;
  duration: number; // in seconds
  previewUrl: string;
  genre: string;
  moodTags: string[];
  imageUrl: string;
}
