import React, { useState, useEffect, useRef } from 'react';
import { usePostStore } from '@/store/postFilterStore';
import { POSTFILTERTAPLIST, SEASON_TAGS, TEMPERATURE_TAGS, WEATHER_TAGS } from '@/config/constants';
import { FilterItem, SectionKey, PostFilterModalProps, CityType, DistrictType, FilterItemId } from '@/config/types';
import Text from '../../common/atom/Text';
import HrLine from '../../common/atom/HrLine';
import { getRegion } from '@/api/apis';
import { useQuery } from '@tanstack/react-query';
import OptionBtn from '../../common/atom/OptionBtn';
import Button from '../../common/atom/Button';
import { showToast } from '../../provider/ToastProvider';
import BackgroundShadow from '../../common/atom/BackgroundShadow';
import useResizeModal from '@/hooks/useResizeModal';
import ModalHeader from '../../common/organism/ModalHeader';
import ScrollFadeOverlay from '../../common/atom/ScrollFadeOverlay';

interface CategoryFilterItem extends FilterItem {
  category: 'location' | 'weather' | 'temperature' | 'season';
}

export default function PostFilterModal({ isOpen, btnValue, btnIndex }: PostFilterModalProps) {
  const {
    updateLocation,
    updateWeatherTagIds,
    updateTemperatureTagIds,
    updateSeasonTagIds,
    locationIds,
    weatherTagIds,
    temperatureTagIds,
    seasonTagIds,
  } = usePostStore();

  const { data, isSuccess } = useQuery({
    queryKey: ['region'],
    queryFn: getRegion,
    staleTime: Infinity,
  });

  const [activeTab, setActiveTab] = useState<number>(btnIndex);
  const [showModal, setShowModal] = useState(false);

  const [selectedWeather, setSelectedWeather] = useState<FilterItem[]>([]);
  const [selectedTemperature, setSelectedTemperature] = useState<FilterItem[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<FilterItem[]>([]);
  const [selectedFilterItems, setSelectedFilterItems] = useState<CategoryFilterItem[]>([]);

  const [city, setCity] = useState<CityType[]>([]);
  const [district, setDistrict] = useState<DistrictType[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictType[]>([]);
  const [openDistrictOption, setOpenDistrictOption] = useState<boolean>(false);

  // Record<K, T> 타입 k는 key의 값, T는 각 키에 대응하는 값의 타입을 지정함
  const sectionRefs = useRef<Record<SectionKey, HTMLDivElement | null>>({
    location: null,
    weather: null,
    temperature: null,
    season: null,
  });

  const onClickFilterItemBtn = (
    id: FilterItemId,
    tagName: string,
    setFilterState: React.Dispatch<React.SetStateAction<Array<{ id: FilterItemId; tagName: string }>>>,
    optionName: string,
  ) => {
    setFilterState((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === id);
      if (isAlreadySelected) {
        return prev.filter((item) => item.id !== id);
      } else {
        if (prev.length === 2) {
          showToast(`${optionName} 는 최대 2개까지만 선택 가능합니다.`);
          const updatedState = [...prev.slice(1), { id, tagName }];
          return [...updatedState];
        } else {
          return [...prev, { id, tagName }];
        }
      }
    });
  };

  const onClickResetFilterBtn = () => {
    setSelectedWeather([]);
    setSelectedTemperature([]);
    setSelectedSeason([]);
    setSelectedDistrict([]);
  };

  const onClickCityBtn = (selectedOption: CityType) => {
    setOpenDistrictOption(false);

    if (selectedOption.cityId === 55) {
      setSelectedDistrict([{ ...selectedOption, districtId: 0, districtName: '전국' }]);
      setDistrict([]);
    } else {
      if (selectedDistrict.length > 0 && selectedDistrict.some((item) => item.cityId !== 55)) {
        if (selectedDistrict[0].cityId !== selectedOption.cityId) {
          showToast('도시는 최대 1개 선택 가능합니다.');
          return;
        }
      }
      const updatedDistricts = selectedOption.district.map((item) => ({
        ...item,
        cityName: selectedOption.cityName,
        cityId: selectedOption.cityId,
      }));
      setOpenDistrictOption(true);
      setDistrict(updatedDistricts);
      // const filteredDistrict = district.filter((item) => item.cityId === city.cityId);
    }
  };

  const onClickDistrictBtn = (selectedOption: DistrictType) => {
    if (selectedDistrict.some((district) => district.cityId === 55)) {
      setSelectedDistrict((prevDistricts) => prevDistricts.filter((district) => district.cityId !== 55));
    }
    setSelectedDistrict((prev) => {
      const isAlreadySelected = prev.some((item) => item.districtId === selectedOption.districtId);
      if (isAlreadySelected) {
        return prev.filter((item) => item.districtId !== selectedOption.districtId);
      }
      if (selectedOption.districtId === 0) {
        const updateState = {
          ...selectedOption,
          districtName: `${selectedOption.cityName} ${selectedOption.districtName}`,
        };
        return [updateState];
      } else {
        const filteredPrev = prev.filter((item) => item.districtId !== 0);
        if (prev.length === 2) {
          showToast('지역/구 는 최대 2개까지만 선택 가능합니다.');
          const updatedState = [...prev.slice(1), selectedOption];
          return [...updatedState];
        } else {
          return [...filteredPrev, selectedOption];
        }
      }
    });
  };

  const onClickSelectedItemBtn = (id: FilterItemId, category: string) => {
    switch (category) {
      case 'location':
        setSelectedDistrict((prev) => prev.filter((item) => item.districtId !== id));
        break;
      case 'weather':
        setSelectedWeather((prev) => prev.filter((item) => item.id !== id));
        break;
      case 'temperature':
        setSelectedTemperature((prev) => prev.filter((item) => item.id !== id));
        break;
      case 'season':
        setSelectedSeason((prev) => prev.filter((item) => item.id !== id));
        break;
    }
  };

  useEffect(() => {
    // as를 사용하여 SectionKey의 지정된 값중 하나라는 것을 타입 단언
    if (btnValue && sectionRefs.current[btnValue as SectionKey]) {
      sectionRefs.current[btnValue as SectionKey]?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [btnValue]);

  useEffect(() => {
    const city = data?.data.region;
    if (isSuccess) setCity(city);
  }, [isSuccess]);

  useEffect(() => {
    const newSelectedFilterItems: CategoryFilterItem[] = [
      ...selectedDistrict.map((item) => ({
        ...{ tagName: item.districtName, id: item.districtId },
        category: 'location' as const,
      })),
      ...selectedWeather.map((item) => ({ ...item, category: 'weather' as const })),
      ...selectedTemperature.map((item) => ({ ...item, category: 'temperature' as const })),
      ...selectedSeason.map((item) => ({ ...item, category: 'season' as const })),
    ];
    setSelectedFilterItems(newSelectedFilterItems);
  }, [selectedDistrict, selectedWeather, selectedTemperature, selectedSeason]);

  const onClickSubmitBtn = () => {
    updateLocation(selectedDistrict);
    updateSeasonTagIds(selectedSeason);
    updateTemperatureTagIds(selectedTemperature);
    updateWeatherTagIds(selectedWeather);
    isOpen(false);
  };

  useEffect(() => {
    // 렌더링 시 저장된 필터 데이터 매칭
    setSelectedDistrict(locationIds);
    setSelectedWeather(weatherTagIds);
    setSelectedTemperature(temperatureTagIds);
    setSelectedSeason(seasonTagIds);
  }, []);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const { modalHeight, handleMouseDown, handleTouchStart } = useResizeModal({
    minHeight: window.innerHeight * 0.3,
    maxHeight: window.innerHeight * 0.8,
    defaultHeight: window.innerHeight * 0.7,
  });

  useEffect(() => {
    if (modalHeight <= window.innerHeight * 0.31) {
      setShowModal(false);
      setTimeout(() => isOpen(false), 300);
    }
  }, [modalHeight]);

  return (
    <BackgroundShadow isBackdropVisible={showModal}>
      <div
        className={`fixed bottom-0 w-full max-w-md h-4/5 overflow-y-auto scrollbar-hide flex flex-col bg-background-white rounded-t-3xl ${
          showModal ? 'transform translate-y-0' : 'transform translate-y-full'
        } transition-transform duration-500 ease-out`}
        style={{ height: `${modalHeight}px` }} // 동적 높이 설정
      >
        <div
          onMouseDown={handleMouseDown} // 마우스 드래그 시작
          onTouchStart={handleTouchStart} // 터치 드래그 시작
        >
          <ModalHeader resizable onClose={() => isOpen(false)}>
            필터
          </ModalHeader>
        </div>

        {/* 필터 항목 탭 */}
        <div className="bg-white flex px-5">
          {POSTFILTERTAPLIST.map((tab, index) => (
            <div
              id={String(index)}
              key={index}
              className={`me-3 p-2.5 ${activeTab === tab.id ? 'border-b-2 border-primary-main' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <a href={`${tab.href}`}>
                <Text
                  size="l"
                  color={activeTab === tab.id ? 'main' : 'gray'}
                  weight={activeTab === tab.id ? 'bold' : 'regular'}
                >
                  {tab.tabName}
                </Text>
              </a>
            </div>
          ))}
        </div>
        <HrLine height={1} />

        <div
          id="viewport"
          className="w-full px-5 flex flex-col flex-grow overflow-x-hidden overflow-y-auto scrollbar-hide"
        >
          <div
            id="location"
            className="py-5 w-full"
            ref={(el) => {
              sectionRefs.current.location = el;
            }}
          >
            <a>
              <Text size="l" weight="bold" className="mb-2.5">
                지역
              </Text>
            </a>
            <div className="flex flex-wrap gap-2 w-full">
              {city.map((item) => (
                <OptionBtn
                  key={item.cityId}
                  name={item.cityName}
                  isActive={selectedDistrict.some((city) => item.cityId === city.cityId)}
                  onClickFunc={() => {
                    onClickCityBtn(item);
                  }}
                />
              ))}
            </div>
          </div>
          {openDistrictOption ? (
            <div className="flex flex-wrap gap-2 px-3 py-2 mb-5 rounded-[10px] bg-background-light w-full">
              {district.map((item) => (
                <OptionBtn
                  key={item.districtId}
                  name={item.districtName}
                  isActive={
                    selectedDistrict.some((district) => district.cityId === 55)
                      ? false
                      : selectedDistrict.some((selected) => selected.districtId === item.districtId)
                  }
                  onClickFunc={() => {
                    onClickDistrictBtn(item);
                  }}
                />
              ))}
            </div>
          ) : null}

          <HrLine height={8} />

          <div
            id="weather"
            className="py-5 w-full"
            ref={(el) => {
              sectionRefs.current.weather = el;
            }}
          >
            <a className="mb-4">
              <Text size="l" weight="bold" className="mb-2.5">
                날씨
              </Text>
            </a>
            <div className="flex flex-wrap gap-2 w-full">
              {WEATHER_TAGS.map((item) => (
                <OptionBtn
                  key={item.id}
                  name={item.name}
                  isActive={selectedWeather.some((selected) => selected.id === item.id)}
                  onClickFunc={() => {
                    onClickFilterItemBtn(item.id, item.name, setSelectedWeather, '날씨');
                  }}
                />
              ))}
            </div>
          </div>
          <HrLine height={8} />

          <div
            id="temperature"
            className="py-5 w-full"
            ref={(el) => {
              sectionRefs.current.temperature = el;
            }}
          >
            <a className="mb-4">
              <Text size="l" weight="bold" className="mb-2.5">
                온도
              </Text>
            </a>
            <div className="flex flex-wrap gap-2 w-full">
              {TEMPERATURE_TAGS.map((item) => (
                <OptionBtn
                  key={item.id}
                  name={item.name}
                  isActive={selectedTemperature.some((selected) => selected.id === item.id)}
                  onClickFunc={() => {
                    onClickFilterItemBtn(item.id, item.name, setSelectedTemperature, '온도');
                  }}
                />
              ))}
            </div>
          </div>
          <HrLine height={8} />

          <div
            id="season"
            className="py-5 w-full"
            ref={(el) => {
              sectionRefs.current.season = el;
            }}
          >
            <a className="mb-4">
              <Text size="l" weight="bold" className="mb-2.5">
                계절
              </Text>
            </a>
            <div className="flex flex-wrap gap-2 w-full">
              {SEASON_TAGS.map((item) => (
                <OptionBtn
                  key={item.id}
                  name={item.name}
                  isActive={selectedSeason.some((selected) => selected.id === item.id)}
                  onClickFunc={() => {
                    onClickFilterItemBtn(item.id, item.name, setSelectedSeason, '계절');
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 선택된 필터 및 적용하기 버튼 */}
        <div className="flex flex-col gap-4 bg-white p-5">
          {selectedFilterItems.length > 0 ? (
            <div>
              <div className="flex row gap-1 mb-3">
                <div>
                  <Text weight="bold" color="lightBlack">
                    적용된 필터
                  </Text>
                </div>
                <div>
                  <Text color="main">{selectedFilterItems.length}</Text>
                </div>
              </div>
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {selectedFilterItems.map((item, index) => (
                    <OptionBtn
                      key={index}
                      name={item.tagName}
                      isActive
                      showCloseBtn
                      onClickFunc={() => onClickSelectedItemBtn(item.id, item.category)}
                    />
                  ))}
                </div>
                <ScrollFadeOverlay />
              </div>
            </div>
          ) : null}

          <div className="flex gap-[7px] justify-between">
            <Button size="m" type="sub" onClick={onClickResetFilterBtn}>
              필터 초기화
            </Button>
            <Button size="m" onClick={onClickSubmitBtn}>
              적용하기
            </Button>
          </div>
        </div>
      </div>
    </BackgroundShadow>
  );
}
