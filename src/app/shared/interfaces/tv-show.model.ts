export type Status = 'loading' | 'success' | 'error' | 'no_results';

export interface TVShow {
  id: string;
  name?: string;
  permalink?: string;
  url?: string;
  description?: string;
  description_source?: string;
  start_date?: string;
  end_date?: any;
  country?: string;
  status?: string;
  runtime?: number;
  network?: string;
  youtube_link?: any;
  image_path?: string;
  image_thumbnail_path?: string;
  rating?: string;
  rating_count?: string;
  countdown?: any;
  genres?: string[];
  pictures?: string[];
  episodes?: Episode[];
  favorite?: boolean;
}

export interface Episode {
  season: number;
  episode: number;
  name: string;
  air_date: string;
}
