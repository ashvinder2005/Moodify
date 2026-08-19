import { ISong } from '../types/Song';

export class MusicService {
  /**
   * Search songs using the provider agnostic method.
   */
  public static async searchSongs(query: string, limit: number = 20): Promise<ISong[]> {
    return this.fetchFromProvider(query, limit);
  }

  /**
   * Get recommendations based on the provided mood.
   */
  public static async getRecommendationsByMood(mood: string, intensity: number = 3): Promise<ISong[]> {
    const searchTerms = this.mapMoodToSearchTerm(mood);
    return this.searchSongs(searchTerms, 20);
  }
  
  /**
   * Get trending songs (e.g., top hits).
   */
  public static async getTrendingSongs(): Promise<ISong[]> {
    return this.searchSongs("top hits pop", 20);
  }

  /**
   * Map semantic moods to actual query search terms that yield good music API results.
   */
  private static mapMoodToSearchTerm(mood: string): string {
    const m = mood.toLowerCase();
    switch (m) {
      case 'happy': return 'happy upbeat feel good';
      case 'sad': return 'sad emotional piano';
      case 'relaxed': return 'chill lofi acoustic';
      case 'angry': return 'rock metal hardcore';
      case 'energetic': return 'dance pop upbeat workout';
      case 'calm': return 'ambient relaxing peaceful';
      case 'focused': return 'instrumental study lofi piano';
      case 'romantic': return 'love romance acoustic';
      default: return mood; 
    }
  }

  /**
   * Isolated logic for the specific Music API provider (currently iTunes Search API).
   * Can be easily swapped with another provider without affecting the rest of the application.
   */
  private static async fetchFromProvider(query: string, limit: number): Promise<ISong[]> {
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Music API error: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      
      if (!data || !data.results) {
        return [];
      }

      return data.results.map((track: any) => ({
        _id: track.trackId ? track.trackId.toString() : Math.random().toString(36).substring(7),
        title: track.trackName || 'Unknown Title',
        artist: track.artistName || 'Unknown Artist',
        duration: Math.floor((track.trackTimeMillis || 0) / 1000),
        previewUrl: track.previewUrl || '',
        genre: track.primaryGenreName || 'Pop',
        moodTags: [], 
        imageUrl: track.artworkUrl100 ? track.artworkUrl100.replace('100x100bb', '600x600bb') : '' 
      }));
    } catch (error) {
      console.error('Error fetching from Music API:', error);
      return []; // Graceful fallback
    }
  }
}
