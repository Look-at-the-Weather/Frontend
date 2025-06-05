import OptionBtn from '@/components/common/atom/OptionBtn';
import ScrollFadeOverlay from '@/components/common/atom/ScrollFadeOverlay';
import { FilterItem, Location } from '@/config/types';
import { usePostFilterStore } from '@/store/postFilterStore';

export default function FilterCategoryTabs({ onClick }: { onClick: () => void }) {
  const { locationTags, weatherTags, temperatureTags, seasonTags } = usePostFilterStore();

  const filterCategoryList = [
    { defaultLabel: '지역', category: 'location', tags: locationTags },
    { defaultLabel: '날씨', category: 'weather', tags: weatherTags },
    { defaultLabel: '온도', category: 'temperature', tags: temperatureTags },
    { defaultLabel: '계절', category: 'season', tags: seasonTags },
  ];

  const getLabel = (tag: Location | FilterItem, category: string) =>
    category === 'location' ? (tag as Location).district : (tag as FilterItem).tagName;
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide relative">
      {filterCategoryList.map(({ defaultLabel, category, tags }) => (
        <OptionBtn key={category} isActive={!!tags.length} onClickFunc={onClick}>
          {tags.length > 1
            ? `${getLabel(tags[0], category)} 외 ${tags.length - 1}`
            : tags.length === 1
              ? `${getLabel(tags[0], category)}`
              : defaultLabel}
        </OptionBtn>
      ))}
      <ScrollFadeOverlay />
    </div>
  );
}
