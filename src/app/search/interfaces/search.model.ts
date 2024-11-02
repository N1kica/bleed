import { TVShow } from '../../shared/interfaces/tv-show.model';

export type SearchEvent = {
  type: 'search' | 'next' | 'prev' | 'reset';
  query: string;
};

export interface SearchState {
  page?: number;
  pages?: number;
  total?: string;
  tv_shows?: TVShow[];
}
