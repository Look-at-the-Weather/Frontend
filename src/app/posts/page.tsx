'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Header from '@/components/common/organism/Header';
import HrLine from '@components/common/atom/HrLine';
import PostFilterModal from '@/components/post-filter/organism/PostFilterModal';
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
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

export default function PostsPage() {
  const { location: currentLocation } = useLocationData();
  const { locationTags, seasonTags, weatherTags, temperatureTags, setLocationTags, postStoreClear } =
    usePostFilterStore();
  const getFilteredPosts = useFilteredPosts();

  const [isOpen, setIsOpen] = useState(false);
  const [btnIndex, setBtnIndex] = useState(0);
  const [btnValue, setBtnValue] = useState('');
  const [sortOrder, setSortOrder] = useState<'LATEST' | 'RECOMMENDED'>('LATEST');

  const onClickFilterBtn = (btnIndex?: number, btnString?: string) => {
    // setBtnIndex(btnIndex);
    // setBtnValue(btnString);
    setIsOpen(true);
  };

  const onClickResetBtn = () => {
    // setPostList([]);
    postStoreClear();
  };

  useEffect(() => {
    if (currentLocation) setLocationTags([currentLocation]);
  }, [currentLocation]);

  const queryResults = useInfiniteScroll(['post', 'list', 'filteredPosts', sortOrder], () =>
    getFilteredPosts({ pageNum: 0, sortOrder: sortOrder }),
  );
  const { isSuccess, pageEndRef, postList } = queryResults;

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
        {/* {isAllPostEmpty ? (
          <AllPostEmpty />
        ) : isFilteredPostEmpty ? (
          <FilteredPostEmpty />
        ) : (
          <div className="flex-grow pb-0.5">
            <PostList postList={postList} />
            <div ref={pageEndRef}></div>
          </div>
        )} */}
        {isSuccess && (
          <div className="flex-grow pb-0.5">
            <PostList postList={postList} />
            <div ref={pageEndRef}></div>
          </div>
        )}
      </div>
      <FooterNavi />
      {/* {isOpen ? <PostFilterModal isOpen={setIsOpen} btnIndex={btnIndex} btnValue={btnValue} /> : null} */}
    </>
  );
}
