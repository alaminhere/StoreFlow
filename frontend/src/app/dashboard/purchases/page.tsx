import Card from '@/components/ui/card';
import SectionBar from '@/components/ui/sectionBr';
import SearchInput from '@/components/shared/store/SearchInput';
import PurchasesSection from '@/components/table/purchase/PurchaseSection';
import AddPurchaseButton from '@/components/shared/entity-forms/AddPurchaseButton';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';

const page = () => {
  return (
    <>
      <section className="p-5">
        <div className="flex flex-wrap justify-between items-center gap-2.5">
          <SectionBar
            title="Purchases"
            description="Manage purchases and supplier payments."
          />
          <AddPurchaseButton />
        </div>
        <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
          <Suspense fallback={<Loading />}>
            <SearchInput placeholder="Search Purchase Name or Purchase id " />
          </Suspense>
        </Card>

        <Suspense fallback={<Loading />}>
          <PurchasesSection />
        </Suspense>
      </section>
    </>
  );
};

export default page;
