export interface TVShowResultState {
  page?: number;
  pages?: number;
  total?: string;
  tv_shows?: TVShow[];
}

export interface TVShow {
  id: string;
  name?: string;
  favorite?: boolean;
}

export type State = 'loading' | 'success' | 'error' | 'no_results';
