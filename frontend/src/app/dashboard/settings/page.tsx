import SettingMenu from '@/components/shared/store/StoreSettingMenu';
import SectionBar from '@/components/ui/sectionBr';

const page = () => {
  return (
    <section className="p-5  md:pt-10 max-w-7xl w-full mx-auto">
      <SectionBar
        className="mb-8"
        title=" Settings"
        description="A quick snapshot of my settings."
      />

      <SettingMenu />
    </section>
  );
};

export default page;
