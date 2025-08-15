import { GeoPoint } from './types';

export const deplpyEnv = process.env.NEXT_PUBLIC_DEPLOY_ENV;

export const BASEURL =
  deplpyEnv === 'dev' ? process.env.NEXT_PUBLIC_DEV_BASE_URL : process.env.NEXT_PUBLIC_PROD_BASE_URL;

export const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

export const REDIRECT_URI = 'https://www.lookattheweather.store/oauth';

export const TAGS = [
  { id: 1, category: 'weather', name: '흐림' },
  { id: 2, category: 'weather', name: '맑음' },
  { id: 3, category: 'weather', name: '눈' },
  { id: 4, category: 'weather', name: '비' },
  { id: 5, category: 'weather', name: '바람' },
  { id: 6, category: 'temperature', name: '더워요' },
  { id: 7, category: 'temperature', name: '추워요' },
  { id: 8, category: 'temperature', name: '따뜻해요' },
  { id: 9, category: 'temperature', name: '쌀쌀해요' },
  { id: 10, category: 'temperature', name: '적당해요' },
  { id: 11, category: 'season', name: '봄' },
  { id: 12, category: 'season', name: '여름' },
  { id: 13, category: 'season', name: '가을' },
  { id: 14, category: 'season', name: '겨울' },
  { id: 'FEMALE', category: 'gender', name: '여성' },
  { id: 'MALE', category: 'gender', name: '남성' },
];

export const WEATHER_TAGS = TAGS.filter((tag) => tag.category === 'weather');
export const TEMPERATURE_TAGS = TAGS.filter((tag) => tag.category === 'temperature');
export const SEASON_TAGS = TAGS.filter((tag) => tag.category === 'season');
export const GENDER_TAGS = TAGS.filter((tag) => tag.category === 'gender');

export const POSTFILTERTAPLIST = [
  {
    id: 0,
    tabName: '지역',
    href: '#location',
  },
  {
    id: 1,
    tabName: '날씨',
    href: '#weather',
  },
  {
    id: 2,
    tabName: '온도',
    href: '#temperature',
  },
  {
    id: 3,
    tabName: '계절',
    href: '#season',
  },
];

// 서울시청의 위도와 경도
export const DEFAULT_GEO_POINT: GeoPoint = {
  latitude: 37.5663,
  longitude: 126.9779,
};
