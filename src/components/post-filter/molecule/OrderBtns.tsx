import VeLine from '@/components/common/atom/VeLine';
import OrderBtn from '../atom/OrderBtn';

export default function OrderBtns({
  sortOrder,
  onBtnClick,
}: {
  sortOrder: 'LATEST' | 'RECOMMENDED';
  onBtnClick: (sortOrder: 'LATEST' | 'RECOMMENDED') => void;
}) {
  return (
    <div className="flex justify-end gap-2 py-5 cursor-pointer">
      <div onClick={() => onBtnClick('LATEST')}>
        <OrderBtn isActive={sortOrder === 'LATEST'}>최신순</OrderBtn>
      </div>
      <VeLine height={16} />
      <div onClick={() => onBtnClick('RECOMMENDED')}>
        <OrderBtn isActive={sortOrder === 'RECOMMENDED'}>추천순</OrderBtn>
      </div>
    </div>
  );
}
