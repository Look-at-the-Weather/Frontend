'use client';

import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { showToast } from '../../provider/ToastProvider';
import PostListStatusHandler from '@/components/post/organism/PostListStatusHandler';

interface VirtualInfiniteScrollProps {
  queryKey: string[];
  queryFn: ({
    page,
    size,
    sortOrder,
  }: {
    page: number;
    size?: number;
    sortOrder?: 'LATEST' | 'RECOMMENDED';
  }) => Promise<any>;
  size?: number;
  headerText: string;
  placeholderComp: React.FC;
}

export default function VirtualInfiniteScroll({
  queryKey,
  queryFn,
  size = 10,
  headerText,
  placeholderComp: PlaceholderComp,
}: VirtualInfiniteScrollProps) {
  const queryResults = useInfiniteScroll(queryKey, queryFn, size);
  const { isError, error, pageEndRef, postList } = queryResults;

  if (isError) {
    console.error(error.message);
    showToast(`${headerText}을 불러오는 데 실패했습니다.`);
  }

  return (
    <>
      <PostListStatusHandler postList={postList} queryResults={queryResults} PlaceholderComp={PlaceholderComp} />
      <div ref={pageEndRef}></div>
    </>
  );
}
