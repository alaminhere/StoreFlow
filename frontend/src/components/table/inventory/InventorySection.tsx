import ProductsSection from '../product/ProductsSection';
import Card from '@/components/ui/card';
import MovementsAction from './MovementsAction';
import SearchInput from '@/components/shared/store/SearchInput';
import ProductsFilter from '@/components/shared/store/ProductsFilter';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';

const InventorySection = () => {
  return (
    <>
      <MovementsAction />
      <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
        <Suspense fallback={<Loading />}>
          <SearchInput />
          <ProductsFilter />
        </Suspense>
      </Card>
      <Suspense fallback={<Loading />}>
        <ProductsSection />
      </Suspense>
    </>
  );
};

export default InventorySection;
