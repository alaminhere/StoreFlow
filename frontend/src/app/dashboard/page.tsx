import DashboardCardsSection from '@/components/shared/store/DashboardCardsSection';
import DashboardOverviewSection  from '@/components/shared/store/DashboardOverviewSection';
import SectionBar from '@/components/ui/sectionBr';

const page = () => {
  return (
    <>
      <section className="p-5">
        <div className="flex flex-wrap justify-between items-center gap-2.5">
          <SectionBar
            title="Dashboard"
            description="Welcome back, Admin. Here's what's happening with your business today."
          />
        </div>
        < DashboardOverviewSection />
        <DashboardCardsSection />
      </section>
    </>
  );
};

export default page;
