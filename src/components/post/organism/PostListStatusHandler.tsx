import { PostMeta } from '@/config/types';
import VirtualPostGrid from './VirtualPostGrid';
import PostListSkeleton from '../../skeleton/PostListSkeleton';
import HorizonScrollPostList from './HorizonScrollPostList';
import FetchErrorPlaceholder from '@/components/placeholder/FetchErrorPlaceholder';

export default function PostListStatusHandler({
  postList,
  queryResults,
  isHorizontal,
  PlaceholderComp,
}: {
  postList: PostMeta[];
  queryResults: any;
  isHorizontal?: boolean;
  PlaceholderComp: React.FC;
}) {
  const { isSuccess, isPending, isError } = queryResults;

  const ListComponent = isHorizontal ? HorizonScrollPostList : VirtualPostGrid;

  return (
    <>
      {isSuccess &&
        (postList.length ? (
          <ListComponent postList={postList} />
        ) : (
          <div className="flex items-center justify-center w-full h-full my-4">
            <PlaceholderComp />
          </div>
        ))}
      {isPending && <PostListSkeleton isHorizontal={isHorizontal} />}
      {isError && <FetchErrorPlaceholder />}
    </>
  );
}
