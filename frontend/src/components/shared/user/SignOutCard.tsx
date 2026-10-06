'use client';

import { useRouter } from 'next/navigation';

import Card from '@/components/ui/card';
import Button from '@/components/ui/button';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import { LogOut } from '@/helpers/icon/icon';
import { useSignOutMutation } from '@/redux/feature/user/authSlice';

const SignOutCard = () => {
  const router = useRouter();
  const [signOut] = useSignOutMutation();

  const onSignOut = async () => {
    try {
      const res = await signOut().unwrap();
      if (!res) return;

      handleAlert(res.success, res.message);
      if (res.success) {
        router.push('/signin');
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <Card className="mt-5 flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-3">
        <div>
          <LogOut
            size={40}
            className="flex shrink-0 items-center justify-center rounded-xl bg-danger-bg p-2 text-danger!"
          />
        </div>
        <div>
          <h4>Sign Out</h4>
          <p className="p14">Log out of your account on this device</p>
        </div>
      </div>
      <Button onClick={onSignOut} className="w-full bg-danger md:w-fit">
        SignOut
      </Button>
    </Card>
  );
};

export default SignOutCard;
