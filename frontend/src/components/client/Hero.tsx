import { Zap } from '@/helpers/icon/icon';
import Button from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import ProjectInfoButton from '../shared/ProjectInfoButton';

const Hero = () => {
  return (
    <section className=" bg-surface py-15 pt-20 md:pt-25 ">
      <div className="app-container flex flex-col lg:flex-row justify-between items-center gap-5 md:gap-10">
        <div className="w-full lg:w-[45%] order-2 lg:order-1">
          <div className="mt-5 px-4 py-0.5 border border-primary/40! bg-primary/10! rounded-full w-fit flex justify-center items-center gap-2">
            <Zap size={14} className="text-primary!" />
            <p className="text-primary p14">Multi-Warehouse Support</p>
          </div>
          <h1 className="animate-slide-up  text-text mt-5  ">
            Built to Manage.
            <span className="text-primary"> Designed to Grow. </span>
          </h1>
          <p className="animate-slide-up mt-3 md:text-[18px]">
            Track stock, manage sales, generate invoices, and grow your business
            all in one beautiful, easy to use platform. Built for Bangladesh,
            ready for the world.
          </p>
          <div className="mt-8 flex flex-col md:flex-row  gap-5">
            <ProjectInfoButton autoOpen className="w-full md:w-fit" >
              Show project info again
            </ProjectInfoButton >
            <Link href={'/signin'}>
              <Button variant='secondary' size="md" className='w-full'>Start Free Today</Button>
            </Link>
          </div>
        </div>
        <div className="w-full flex justify-center lg:justify-end lg:w-[55%]  rounded-2xl overflow-hidden  order-1 lg:order-2">
          <Image
            src="/hero_.webp"
            alt="hero"
            width={1000}
            height={1000}
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
