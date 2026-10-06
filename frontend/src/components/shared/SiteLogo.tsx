import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href={'/'}>
      <div className="flex justify-start items-center gap-2">
        <div className="w-9 h-9  bg-primary flex justify-center items-center rounded-[10px]">
          <Image src="/logo.svg" alt="logo" width={25} height={25} />
        </div>
        <h4 className="text-2xl font-bold text-text">StoreFlow</h4>
      </div>
    </Link>
  );
};

export default Logo;
