'use client';

import { getOutfitByTemperature } from '@/api/apis';
import useWeatherData from '@/hooks/useWeatherData';
import { useQuery } from '@tanstack/react-query';
import TempOutfitPostEmpty from '../../placeholder/TempOutfitPostEmpty';
import HomePostListTitle from '../atom/HomePostListTitle';
import PostListStatusHandler from './PostListStatusHandler';
import FetchErrorPlaceholder from '@/components/placeholder/FetchErrorPlaceholder';

export default function OutfitListByTemperature() {
  const { weatherData, isError } = useWeatherData();
  const { currentTemp } = weatherData;

  const queryResults = useQuery({
    queryKey: ['post', 'list', 'outfitByTemperature'],
    queryFn: () => getOutfitByTemperature(currentTemp),
    enabled: !!currentTemp,
  });

  const outfitPosts = queryResults.data?.posts ?? [];

  return (
    <div>
      <HomePostListTitle>현재 기온에 어울리는 룩</HomePostListTitle>
      {isError ? (
        <FetchErrorPlaceholder />
      ) : (
        <PostListStatusHandler
          postList={outfitPosts}
          queryResults={queryResults}
          isHorizontal
          PlaceholderComp={TempOutfitPostEmpty}
        />
      )}
    </div>
  );
}
