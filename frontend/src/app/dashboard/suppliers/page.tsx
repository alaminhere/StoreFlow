import Card from '@/components/ui/card';
import SectionBar from '@/components/ui/sectionBr';
import SearchInput from '@/components/shared/store/SearchInput';
import SuppliersSection from '@/components/table/suppliers/SupplierSection';
import AddSupplierButton from '@/components/shared/entity-forms/AddSupplierButton';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';

const page = () => {
  return (
    <>
      <section className="p-5">
        <div className="flex flex-wrap justify-between items-center gap-2.5">
          <SectionBar
            title="Suppliers"
            description="Manage suppliers and their purchase relationships."
          />
          <AddSupplierButton />
        </div>
        <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
          <Suspense fallback={<Loading />}>
            <SearchInput placeholder="Search supplier name" />
          </Suspense>
        </Card>
        <Suspense fallback={<Loading />}>
          <SuppliersSection />
        </Suspense>
      </section>
    </>
  );
};

export default page;
