import { postFilteredPosts } from '@/api/apis';
import { usePostFilterStore } from '@/store/postFilterStore';
import { useCallback } from 'react';

type SortOrder = 'LATEST' | 'RECOMMENDED';

interface GetFilteredPostsParams {
  pageNum: number;
  sortOrder: SortOrder;
}

export function useFilteredPosts() {
  const { locationTags, seasonTags, weatherTags, temperatureTags } = usePostFilterStore();

  const locationIds = locationTags.map((loc) => ({
    city: loc.cityId,
    district: loc.districtId,
  }));
  const seasonIds = seasonTags.map((tag) => tag.id);
  const temperatureIds = temperatureTags.map((tag) => tag.id);
  const weatherIds = weatherTags.map((tag) => tag.id);

  const getFilteredPosts = useCallback(
    async ({ pageNum, sortOrder }: GetFilteredPostsParams) => {
      const data = await postFilteredPosts({
        page: pageNum,
        sort: sortOrder,
        location: locationIds,
        seasonTagIds: seasonIds,
        weatherTagIds: weatherIds,
        temperatureTagIds: temperatureIds,
        gender: 'ALL',
      });

      return data;
    },
    [locationTags, seasonTags, weatherTags, temperatureTags],
  );

  return getFilteredPosts;
}
