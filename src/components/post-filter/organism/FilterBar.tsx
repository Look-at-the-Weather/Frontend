import VeLine from '@/components/common/atom/VeLine';
import { ResetIcon } from '@/components/icons/ResetIcon';
import FilterCategoryTabs from './FilterCategoryTabs';

export default function FilterBar({onClickResetBtn, onClickFilterBtn}:{onClickResetBtn: () => void; onClickFilterBtn: () => void}) {
  return (
    <div className="flex gap-4 items-center py-4">
      <ResetIcon onClick={onClickResetBtn} className="flex-shrink-0 cursor-pointer" />
      <VeLine height={16} />
      <FilterCategoryTabs onClick={onClickFilterBtn} />
    </div>
  );
}
