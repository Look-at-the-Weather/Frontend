'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Header from '@/components/common/organism/Header';
import Text from '@components/common/atom/Text';
import HrLine from '@components/common/atom/HrLine';
import VeLine from '@components/common/atom/VeLine';
import { ResetIcon } from '@components/icons/ResetIcon';
import PostFilterModal from '@/components/post/organism/PostFilterModal';
import { usePostStore } from '@/store/postStore';
import { PostMeta } from '@/config/types';
import FooterNavi from '@/components/common/organism/FooterNavi';
import useLocationData from '@/hooks/useLocationData';
import { postFilteredPosts } from '@/api/apis';
import LookWeatherWidget from '@/components/weather/organism/LookWeatherWidget';
import OptionBtn from '@/components/common/atom/OptionBtn';
import ScrollFadeOverlay from '@components/common/atom/ScrollFadeOverlay';
import AllPostEmpty from '@/components/placeholder/AllPostEmpty';
import FilteredPostEmpty from '@/components/placeholder/FilteredPostEmpty';
import { PostList } from '@/components/post/organism/PostList';

export default function Post() {
  const { location: currentLocation } = useLocationData();
  const {
    locationIds,
    seasonTagIds,
    temperatureTagIds,
    weatherTagIds,
    updateLocation,
    updateWeatherTagIds,
    updateTemperatureTagIds,
    updateSeasonTagIds,
  } = usePostStore();

  useEffect(() => {
    if (currentLocation) {
      console.log('위치 업데이트');
      updateLocation([
        {
          cityName: currentLocation?.city,
          cityId: currentLocation?.cityId,
          districtName: currentLocation?.district,
          districtId: currentLocation?.districtId,
        },
      ]);
    }
  }, [currentLocation]);

  const [isOpen, setIsOpen] = useState(false);
  const [btnIndex, setBtnIndex] = useState(0);
  const [btnValue, setBtnValue] = useState('');
  const [sortOrder, setSortOrder] = useState('LATEST');
  const [postList, setPostList] = useState<PostMeta[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isAllPostEmpty, setIsAllPostEmpty] = useState(false);
  const [isFilteredPostEmpty, setIsFilteredPostEmpty] = useState(false);

  const pageEnd = useRef<HTMLDivElement>(null);
  const isEmptyFilter = areAllEmptyArrays(locationIds, seasonTagIds, temperatureTagIds, weatherTagIds);

  const onClickFilterBtn = (btnIndex: number, btnString: string) => {
    setBtnIndex(btnIndex);
    setBtnValue(btnString);
    setIsOpen(true);
  };

  const onClickResetBtn = () => {
    setPostList([]);
    setHasMore(true);
    setPage(0);

    if (currentLocation) {
      updateLocation([
        {
          cityName: currentLocation?.city,
          cityId: currentLocation?.cityId,
          districtName: currentLocation?.district,
          districtId: currentLocation?.districtId,
        },
      ]);
    }
    updateWeatherTagIds([]);
    updateTemperatureTagIds([]);
    updateSeasonTagIds([]);
  };

  const getFilteredPosts = useCallback(
    async (pageNum: number) => {
      if (!hasMore || isEmptyFilter) return;

      const location = locationIds.map((loc) => ({
        city: loc.cityId,
        district: loc.districtId,
      }));
      const seasonIds = seasonTagIds.map((tag) => tag.id);
      const temperatureIds = temperatureTagIds.map((tag) => tag.id);
      const weatherIds = weatherTagIds.map((tag) => tag.id);

      setLoading(true);
      try {
        const data = await postFilteredPosts({
          page: pageNum,
          sort: sortOrder,
          location,
          seasonTagIds: seasonIds,
          weatherTagIds: weatherIds,
          temperatureTagIds: temperatureIds,
          gender: 'ALL',
        });

        const newPosts = data.posts;
        setPostList((prev) => [...prev, ...newPosts]);
        setPage(pageNum + 1);
        setHasMore(newPosts.length > 0);
        setIsFilteredPostEmpty(newPosts.length === 0 && pageNum === 0);
      } catch (error) {
        setLoading(false);
        setHasMore(false);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [hasMore, locationIds, seasonTagIds, weatherTagIds, temperatureTagIds],
  );

  useEffect(() => {
    setPostList([]);
    setIsAllPostEmpty(false);
    setIsFilteredPostEmpty(false);
    setPage(0);

    if (location && isEmptyFilter !== null) {
      setPage(0);
      getFilteredPosts(0);
    }
  }, [currentLocation, locationIds, seasonTagIds, weatherTagIds, temperatureTagIds, sortOrder]);

  useEffect(() => {
    setHasMore(true);
  }, [getFilteredPosts]);

  useEffect(() => {
    const isScrollLoadable = Number.isInteger(postList.length / 10);

    if (!loading && hasMore) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (isEmptyFilter !== null) {
            if (entries[0].isIntersecting && isScrollLoadable) {
              getFilteredPosts(page);
            }
          }
        },
        { threshold: 0.7 },
      );

      if (pageEnd.current) {
        observer.observe(pageEnd.current);
      }

      return () => {
        if (pageEnd.current) {
          observer.unobserve(pageEnd.current);
        }
      };
    }
  }, [loading]);

  return (
    <>
      <Header>LOOK</Header>
      <div className="flex flex-col flex-grow overflow-y-auto scrollbar-hide">
        <div className="px-5">
          <LookWeatherWidget />
          <HrLine height={1} />
          <div className="relative flex items-center gap-4 py-4">
            <ResetIcon onClick={onClickResetBtn} className="flex-shrink-0 cursor-pointer" />
            <VeLine height={16} />
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <OptionBtn
                isActive={!!locationIds.length}
                onClickFunc={() => onClickFilterBtn(0, 'location')}
                name={
                  locationIds.length > 1
                    ? `${locationIds[0].districtName} 외 ${locationIds.length - 1}`
                    : locationIds.length === 1
                      ? `${locationIds[0].districtName}`
                      : '지역'
                }
              />

              <OptionBtn
                isActive={!!weatherTagIds.length}
                onClickFunc={() => onClickFilterBtn(1, 'weather')}
                name={
                  weatherTagIds.length > 1
                    ? `${weatherTagIds[0].tagName} 외 ${weatherTagIds.length - 1}`
                    : weatherTagIds.length === 1
                      ? `${weatherTagIds[0].tagName}`
                      : '날씨'
                }
              />
              <OptionBtn
                isActive={!!temperatureTagIds.length}
                onClickFunc={() => onClickFilterBtn(2, 'temperature')}
                name={
                  temperatureTagIds.length > 1
                    ? `${temperatureTagIds[0].tagName} 외 ${temperatureTagIds.length - 1}`
                    : temperatureTagIds.length === 1
                      ? `${temperatureTagIds[0].tagName}`
                      : '온도'
                }
              />
              <OptionBtn
                isActive={!!seasonTagIds.length}
                onClickFunc={() => onClickFilterBtn(3, 'season')}
                name={
                  seasonTagIds.length > 1
                    ? `${seasonTagIds[0].tagName} 외 ${seasonTagIds.length - 1}`
                    : seasonTagIds.length === 1
                      ? `${seasonTagIds[0].tagName}`
                      : '계절'
                }
              />
            </div>
            <ScrollFadeOverlay />
          </div>
          <HrLine height={8} />
          <div className="py-5">
            <div className="flex justify-end cursor-pointer row">
              <div onClick={() => setSortOrder('LATEST')}>
                <Text
                  color={sortOrder === 'LATEST' ? 'gray' : 'lightGray'}
                  weight={sortOrder === 'LATEST' ? 'bold' : 'regular'}
                >
                  최신순
                </Text>
              </div>
              <div className="mx-2">
                <VeLine height={16} />
              </div>
              <div onClick={() => setSortOrder('RECOMMENDED')}>
                <Text
                  color={sortOrder === 'RECOMMENDED' ? 'gray' : 'lightGray'}
                  weight={sortOrder === 'RECOMMENDED' ? 'bold' : 'regular'}
                >
                  추천순
                </Text>
              </div>
            </div>
          </div>
        </div>
        {isAllPostEmpty ? (
          <AllPostEmpty />
        ) : isFilteredPostEmpty ? (
          <FilteredPostEmpty />
        ) : (
          <div className="flex-grow pb-0.5">
            <PostList postList={postList} />
            <div ref={pageEnd}></div>
          </div>
        )}
      </div>
      <FooterNavi />
      {isOpen ? <PostFilterModal isOpen={setIsOpen} btnIndex={btnIndex} btnValue={btnValue} /> : null}
    </>
  );
}

const areAllEmptyArrays = (...arrs: any[][]): boolean => {
  for (const arr of arrs) {
    if (!Array.isArray(arr) || arr.length !== 0) {
      return false;
    }
  }
  return true;
};
