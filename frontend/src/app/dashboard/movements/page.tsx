import Card from '@/components/ui/card';
import SectionBar from '@/components/ui/sectionBr';
import SearchInput from '@/components/shared/store/SearchInput';
import MovementSection from '@/components/table/inventory/MovementSection';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';

const page = () => {
  return (
    <section className="p-5">
      <SectionBar
        title="Inventory Movement"
        description="Track all stock-in, stock-out, and adjustment activities."
        className="mb-5"
      />
      <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
        <Suspense fallback={<Loading />}>
          <SearchInput placeholder="search type.." />
        </Suspense>
      </Card>
      <Suspense fallback={<Loading />}>
        <MovementSection />
      </Suspense>
    </section>
  );
};

export default page;
