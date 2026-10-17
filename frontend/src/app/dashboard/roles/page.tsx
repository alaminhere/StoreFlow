import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';
import SectionBar from '@/components/ui/sectionBr';
import MemberSection from '@/components/table/member/MemberSection';
import AddMemberButton from '@/components/shared/entity-forms/AddMemberButton';

const page = () => {
  return (
    <section className="p-5">
      <div className="flex flex-wrap justify-between items-center gap-2.5">
        <SectionBar
          title="Member & Roles"
          description="Manage store members, roles, and access permissions."
        />
        <AddMemberButton />
      </div>
      <Suspense fallback={<Loading />}>
        <MemberSection />
      </Suspense>
    </section>
  );
};

export default page;
