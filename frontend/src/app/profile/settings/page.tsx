import SectionBar from '@/components/ui/sectionBr';
import SettingMenu from '@/components/shared/user/UserSettingMenu';

const SettingsPage = async () => {
  return (
    <section className="p-5  md:pt-10">
      <SectionBar
        className="mb-8"
        title=" Settings"
        description="A quick snapshot of my settings."
      />
      <SettingMenu />
    </section>
  );
};

export default SettingsPage;
