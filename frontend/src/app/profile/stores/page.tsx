import SectionBar from '@/components/ui/sectionBr';
import StoreOverview from '@/components/shared/user/Overview';

const page = () => {
  return (
    <section className="p-5  md:pt-10">
      <SectionBar
        className="mb-8"
        title=" My Stores"
        description="Manage your connected stores"
      />
      <StoreOverview />
    </section>
  );
};

export default page;
