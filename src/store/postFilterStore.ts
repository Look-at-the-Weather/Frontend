import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterItem, Location } from '@/config/types';

interface PostFilterState {
  locationTags: Location[];
  seasonTags: FilterItem[];
  weatherTags: FilterItem[];
  temperatureTags: FilterItem[];
  setLocationTags: (newLocationTags: Location[]) => void;
  setSeasonTags: (newSeasonTags: FilterItem[]) => void;
  setWeatherTags: (newWeatherTags: FilterItem[]) => void;
  setTemperatureTags: (newTemperatureTags: FilterItem[]) => void;
  postStoreClear: () => void; // 전체 상태 초기화 함수
}

export const usePostFilterStore = create<PostFilterState>()(
  persist<PostFilterState>(
    (set) => ({
      locationTags: [],
      seasonTags: [],
      weatherTags: [],
      temperatureTags: [],
      setLocationTags: (newLocationTags) => set({ locationTags: newLocationTags }),
      setSeasonTags: (newSeasonTags) => set({ seasonTags: newSeasonTags }),
      setWeatherTags: (newWeatherTags) => set({ weatherTags: newWeatherTags }),
      setTemperatureTags: (newTemperatureTags) => set({ temperatureTags: newTemperatureTags }),
      postStoreClear: () => {
        set({
          locationTags: [],
          seasonTags: [],
          weatherTags: [],
          temperatureTags: [],
        });
      },
    }),
    {
      name: 'post-filter-store',
      getStorage: () => sessionStorage,
    },
  ),
);
