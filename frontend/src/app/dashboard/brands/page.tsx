import Card from '@/components/ui/card';
import SectionBar from '@/components/ui/sectionBr';
import SearchInput from '@/components/shared/store/SearchInput';
import BrandSection from '@/components/table/brand/BrandSection';
import AddBrandButton from '@/components/shared/entity-forms/AddBrandButton';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';

const page = () => {
  return (
    <>
      <section className="p-5">
        <div className="flex flex-wrap justify-between items-center gap-2.5">
          <SectionBar
            title="Product Brands"
            description="Manage the brands associated with your products."
          />
          <AddBrandButton />
        </div>
        <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
          <Suspense fallback={<Loading />}>
            <SearchInput placeholder="Search brands name" />
          </Suspense>
        </Card>
        <Suspense fallback={<Loading />}>
          <BrandSection />
        </Suspense>
      </section>
    </>
  );
};

export default page;
