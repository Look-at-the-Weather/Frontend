import { useRef, useEffect } from 'react';
import { InfiniteData, UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query';
import { PostMeta } from '@/config/types';

type UseInfiniteScrollResult = UseInfiniteQueryResult<InfiniteData<any, unknown>, Error> & {
  pageEndRef: React.RefObject<HTMLDivElement>;
  postList: PostMeta[];
};

function useInfiniteScroll(
  queryKey: string[],
  queryFn: ({ page, size, sortOrder }: { page: number; size?: number; sortOrder?: 'LATEST' | 'RECOMMENDED' }) => any,
  size?: number,
): UseInfiniteScrollResult {
  const pageEndRef = useRef<HTMLDivElement | null>(null);

  const queryResult = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn({ page: pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const { total } = lastPage;
      const nextPage = allPages.length;
      return nextPage <= total ? nextPage : undefined;
    },
  });

  const { hasNextPage, fetchNextPage, isFetchingNextPage, data } = queryResult;

  const detailQueryKey = queryKey[2];
  const postList =
    data?.pages.flatMap((page) => page[detailQueryKey === 'filteredPosts' ? 'posts' : detailQueryKey]) ?? []; // 모든 페이지의 게시물 병합

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    if (pageEndRef.current) {
      observer.observe(pageEndRef.current);
    }

    return () => {
      if (pageEndRef.current) {
        observer.unobserve(pageEndRef.current);
      }
    };
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  return { ...queryResult, pageEndRef, postList };
}

export default useInfiniteScroll;
