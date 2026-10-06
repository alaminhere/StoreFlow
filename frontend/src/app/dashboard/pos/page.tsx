import Loading from '@/components/shared/Loading';
import PosSale from '@/components/shared/store/PosSale';
import { Suspense } from 'react';
const page = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PosSale />
    </Suspense>
  );
};

export default page;
