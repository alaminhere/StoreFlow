import AnalyticsCardsSection from '@/components/shared/store/AnalyticsCardsSection';
import AnalyticsOverviewSection from '@/components/shared/store/AnalyticsOverviewSection';
import SectionBar from '@/components/ui/sectionBr';

const page = () => {
  return (
    <>
      <section className="p-5">
        <div className="flex flex-wrap justify-between items-center gap-2.5">
          <SectionBar
            title="Analytics"
            description="Track your business performance and insights"
          />
        </div>
        <AnalyticsCardsSection />
        <AnalyticsOverviewSection />
      </section>
    </>
  );
};

export default page;
