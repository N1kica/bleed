import { TVShow } from './tv-show.model';

export interface SearchResultState {
  page?: number;
  pages?: number;
  total?: string;
  tv_shows?: TVShow[];
  error?: boolean;
}
