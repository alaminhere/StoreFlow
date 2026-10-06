import SectionBar from '@/components/ui/sectionBr';
import SignOutCard from '@/components/shared/user/SignOutCard';
import QuickActions from '@/components/shared/user/QuickActions';
import WelcomeBanner from '@/components/shared/user/WelcomeBanner';
import StoreOverview from '@/components/shared/user/StoreOverview';

const page = () => {
  return (
    <>
      <section className="p-5  md:pt-10">
        <SectionBar
          className="mb-8"
          title=" Overview"
          description="Your account, stores, and recent activities at a glance."
        />
        <WelcomeBanner />
        <QuickActions />
        <StoreOverview limit={3} showViewAll />
        <SignOutCard />
      </section>
    </>
  );
};

export default page;
