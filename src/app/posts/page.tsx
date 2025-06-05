'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Header from '@/components/common/organism/Header';
import HrLine from '@components/common/atom/HrLine';
import PostFilterModal from '@/components/post/organism/PostFilterModal';
import { usePostFilterStore } from '@/store/postFilterStore';
import { PostMeta } from '@/config/types';
import FooterNavi from '@/components/common/organism/FooterNavi';
import useLocationData from '@/hooks/useLocationData';
import LookWeatherWidget from '@/components/weather/organism/LookWeatherWidget';
import AllPostEmpty from '@/components/placeholder/AllPostEmpty';
import FilteredPostEmpty from '@/components/placeholder/FilteredPostEmpty';
import { PostList } from '@/components/post/organism/PostList';
import { useFilteredPosts } from '@/hooks/useFilteredPosts';
import OrderBtns from '@/components/post-filter/molecule/OrderBtns';
import FilterBar from '@/components/post-filter/organism/FilterBar';

export default function Post() {
  const { location: currentLocation } = useLocationData();
  const { locationTags, seasonTags, weatherTags, temperatureTags, postStoreClear } = usePostFilterStore();
  const getFilteredPosts = useFilteredPosts();

  const [isOpen, setIsOpen] = useState(false);
  const [btnIndex, setBtnIndex] = useState(0);
  const [btnValue, setBtnValue] = useState('');
  const [sortOrder, setSortOrder] = useState<'LATEST' | 'RECOMMENDED'>('LATEST');
  const [postList, setPostList] = useState<PostMeta[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isAllPostEmpty, setIsAllPostEmpty] = useState(false);
  const [isFilteredPostEmpty, setIsFilteredPostEmpty] = useState(false);

  const pageEnd = useRef<HTMLDivElement>(null);
  const isEmptyFilter = areAllEmptyArrays(locationTags, seasonTags, temperatureTags, weatherTags);

  const onClickFilterBtn = (btnIndex?: number, btnString?: string) => {
    // setBtnIndex(btnIndex);
    // setBtnValue(btnString);
    setIsOpen(true);
  };

  const onClickResetBtn = () => {
    setPostList([]);
    setHasMore(true);
    setPage(0);
    postStoreClear();
  };

  useEffect(() => {
    const fetch = async () => {
      const newPosts = await getFilteredPosts({ pageNum: 0, sortOrder: sortOrder });
      setPostList(newPosts);
    };
    fetch();
  }, [getFilteredPosts, sortOrder]);

  // const getAllPosts = useCallback(
  //   async (pageNum: number) => {
  //     if (!currentLocation || !currentLocation.city || !currentLocation.district) return;
  //     if (!hasMore) return;
  //     setLoading(true);

  //     try {
  //       const slicedCity = currentLocation.city.substring(0, 2);
  //       const data = await allPosts(pageNum, slicedCity, currentLocation.district, sortOrder);
  //       const updatePostList = data.posts.map((item: PostMeta) => ({ ...item, currentLocation }));

  //       setPostList((prev) => [...prev, ...updatePostList]);
  //       setPage(pageNum + 1);
  //       setHasMore(updatePostList.length > 0);
  //       setIsAllPostEmpty(updatePostList.length === 0 && pageNum === 0);
  //     } catch {
  //       setLoading(false);
  //       setHasMore(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [sortOrder, currentLocation],
  // );

  // const getFilteredPosts = useCallback(
  //   async (pageNum: number) => {
  //     if (!hasMore || isEmptyFilter) return;

  //     const location = locationTags.map((loc) => ({
  //       city: loc.cityId,
  //       district: loc.districtId,
  //     }));
  //     const seasonIds = seasonTags.map((tag) => tag.id);
  //     const temperatureIds = temperatureTags.map((tag) => tag.id);
  //     const weatherIds = weatherTags.map((tag) => tag.id);

  //     setLoading(true);
  //     try {
  //       const data = await postFilteredPosts({
  //         page: pageNum,
  //         sort: sortOrder,
  //         location,
  //         seasonTags: seasonIds,
  //         weatherTags: weatherIds,
  //         temperatureTags: temperatureIds,
  //         gender: 'ALL',
  //       });

  //       const newPosts = data.posts;
  //       setPostList((prev) => [...prev, ...newPosts]);
  //       setPage(pageNum + 1);
  //       setHasMore(newPosts.length > 0);
  //       setIsFilteredPostEmpty(newPosts.length === 0 && pageNum === 0);
  //     } catch (error) {
  //       setLoading(false);
  //       setHasMore(false);
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [hasMore, locationTags, seasonTags, weatherTags, temperatureTags],
  // );

  // useEffect(() => {
  //   setPostList([]);
  //   setIsAllPostEmpty(false);
  //   setIsFilteredPostEmpty(false);
  //   setPage(0);

  //   if (location && isEmptyFilter !== null) {
  //     setPage(0);
  //     if (isEmptyFilter) {
  //       getAllPosts(0);
  //     } else {
  //       getFilteredPosts(0);
  //     }
  //   }
  // }, [location, locationTags, seasonTags, weatherTags, temperatureTags, sortOrder]);

  // useEffect(() => {
  //   setHasMore(true);
  // }, [getAllPosts, getFilteredPosts]);

  // useEffect(() => {
  //   const isScrollLoadable = Number.isInteger(postList.length / 10);

  //   if (!loading && hasMore) {
  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         if (isEmptyFilter !== null) {
  //           if (entries[0].isIntersecting && isScrollLoadable) {
  //             if (isEmptyFilter) {
  //               getAllPosts(page);
  //             } else {
  //               getFilteredPosts(page);
  //             }
  //           }
  //         }
  //       },
  //       { threshold: 0.7 },
  //     );

  //     if (pageEnd.current) {
  //       observer.observe(pageEnd.current);
  //     }

  //     return () => {
  //       if (pageEnd.current) {
  //         observer.unobserve(pageEnd.current);
  //       }
  //     };
  //   }
  // }, [loading]);

  return (
    <>
      <Header>LOOK</Header>
      <div className="flex flex-col flex-grow overflow-y-auto scrollbar-hide">
        <div className="px-5">
          <LookWeatherWidget />
          <HrLine height={1} />
          <FilterBar onClickFilterBtn={onClickFilterBtn} onClickResetBtn={onClickResetBtn} />
          <HrLine height={8} />
          <OrderBtns sortOrder={sortOrder} onBtnClick={setSortOrder} />
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
      {/* {isOpen ? <PostFilterModal isOpen={setIsOpen} btnIndex={btnIndex} btnValue={btnValue} /> : null} */}
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
