import { POPULAR_CONTENT, NEW_CONTENT } from '@/data/content-data';
import type { PopularContentResponse, NewContent } from '@/types';

export const contentService = {
  async getPopular(): Promise<PopularContentResponse> {
    return POPULAR_CONTENT;
  },

  async getNew(): Promise<NewContent[]> {
    return NEW_CONTENT;
  },
};
