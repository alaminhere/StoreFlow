import SectionBar from '@/components/ui/sectionBr';
import AddProductButton from '@/components/shared/entity-forms/AddProductButton';
import InventorySummaryCard from '@/components/shared/store/InventorySummaryCard';
import InventorySection from '@/components/table/inventory/InventorySection';

const page = () => {
  return (
    <>
      <section className="p-5">
        <div className="flex flex-wrap justify-between items-center gap-2.5">
          <SectionBar
            title="Inventory Management"
            description="Track stock levels, inventory value, and availability."
          />
          <AddProductButton />
        </div>
        <InventorySummaryCard />
        <InventorySection />
      </section>
    </>
  );
};

export default page;
