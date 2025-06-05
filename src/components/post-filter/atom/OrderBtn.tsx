import Text from '@/components/common/atom/Text';

export default function OrderBtn({ isActive, children }: { isActive: boolean; children?: React.ReactNode }) {
  return (
    <Text color={isActive ? 'gray' : 'lightGray'} weight={isActive ? 'bold' : 'regular'}>
      {children}
    </Text>
  );
}
