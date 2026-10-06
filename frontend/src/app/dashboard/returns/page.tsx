import Card from '@/components/ui/card';
import SectionBar from '@/components/ui/sectionBr';
import SearchInput from '@/components/shared/store/SearchInput';
import ReturnSection from '@/components/table/return/ReturnSection';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';
import AddReturnButton from '@/components/shared/entity-forms/AddReturnButton';
import ReturnTypeFilter from '@/components/shared/store/ReturnTypeFilter';

const page = () => {
  return (
    <>
      <section className="p-5">
        <div className="flex flex-wrap justify-between items-center gap-2.5">
          <SectionBar
            title="Sales Returns"
            description="Manage returned products and track stock adjustments."
          />
          <AddReturnButton />
        </div>
        <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
          <Suspense fallback={<Loading />}>
            <SearchInput placeholder="Search date Reason" />
            <ReturnTypeFilter/>
          </Suspense>

        </Card>
        <Suspense fallback={<Loading />}>
          <ReturnSection />
        </Suspense>
      </section>
    </>
  );
};

export default page;
