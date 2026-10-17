import Card from '@/components/ui/card';
import SectionBar from '@/components/ui/sectionBr';
import AddCustomerButton from '@/components/shared/entity-forms/AddCustomerButton';
import SearchInput from '@/components/shared/store/SearchInput';
import CustomerSection from '@/components/table/customer/CustomerSection';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';

const page = () => {
  return (
    <section className="p-5">
      <div className="flex flex-wrap justify-between items-center gap-2.5">
        <SectionBar
          title="Customers"
          description="Manage customers and their purchase history."
        />
        <AddCustomerButton />
      </div>
      <Card className="hover:border-border! flex flex-col xl:flex-row gap-2 md:gap-5 my-5">
        <Suspense fallback={<Loading />}>
          <SearchInput placeholder="search customer name" />
        </Suspense>
      </Card>
      <Suspense fallback={<Loading />}>
        <CustomerSection />
      </Suspense>
    </section>
  );
};

export default page;
