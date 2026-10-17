import Card from '@/components/ui/card';
import SectionBar from '@/components/ui/sectionBr';
import SearchInput from '@/components/shared/store/SearchInput';
import CategorySection from '@/components/table/category/CategorySection';
import AddCategoryButton from '@/components/shared/entity-forms/AddCategoryButton';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';

const page = () => {
  return (
    <section className="p-5">
      <div className="flex flex-wrap justify-between items-center gap-2.5">
        <SectionBar
          title="Product Categories"
          description="Organize products into clear categories."
        />
        <AddCategoryButton />
      </div>
      <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
        <Suspense fallback={<Loading />}>
          <SearchInput placeholder="search brands name" />
        </Suspense>
      </Card>
      <Suspense fallback={<Loading />}>
        <CategorySection />
      </Suspense>
    </section>
  );
};

export default page;
