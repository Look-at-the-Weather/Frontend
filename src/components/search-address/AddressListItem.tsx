import { useRouter } from 'next/navigation';
import Text from '../common/atom/Text';
import { useGeoLocationStore } from '@/store/locationStore';
import { AddressItem } from '@/config/types';

export default function AddressListItem({
  isPostForm,
  cityName,
  cityId,
  districtName,
  districtId,
  latitude,
  longitude,
  address_name,
}: AddressItem & { isPostForm: boolean }) {
  const router = useRouter();
  const setCustomGeoPoint = useGeoLocationStore((state) => state.setCustomGeoPoint);
  const setPostFormLocation = useGeoLocationStore((state) => state.setPostFormLocation);

  return (
    <div
      onClick={() => {
        if (isPostForm) {
          setPostFormLocation({ city: cityName, cityId, district: districtName, districtId });
        } else {
          setCustomGeoPoint({ latitude, longitude });
        }
        router.back();
      }}
      className="px-5 py-[18px] border-b border-line-light hover:bg-background-light cursor-pointer"
    >
      <Text>{address_name}</Text>
    </div>
  );
}
