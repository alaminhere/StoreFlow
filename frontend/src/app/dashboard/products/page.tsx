import { Suspense } from 'react';
import Card from '@/components/ui/card';
import SectionBar from '@/components/ui/sectionBr';
import SearchInput from '@/components/shared/store/SearchInput';
import ProductsFilter from '@/components/shared/store/ProductsFilter';
import ProductsSection from '@/components/table/product/ProductsSection';
import Loading from '@/components/shared/Loading';

const page = () => {
  return (
    <section className="p-5">
      <SectionBar
        title="Products"
        description="Welcome back Here happening with your business today"
      />

      <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
        <Suspense fallback={<Loading />}>
          <SearchInput />
          <ProductsFilter />
        </Suspense>
      </Card>

      <Suspense fallback={<Loading />}>
        <ProductsSection />
      </Suspense>
    </section>
  );
};

export default page;
