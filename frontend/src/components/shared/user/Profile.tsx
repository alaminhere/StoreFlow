'use client';

import Avatar from '../Avatar';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';

import handleAlert from '@/helpers/handleAlert';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';

import { useUpdateUserProfileMutation } from '@/redux/feature/user/userSlice';
import { UpdateUser, User } from '@/types/user/user.types';

const UserProfile = ({ user }: { user: User }) => {
  const [updateUserProfile, { isLoading: updating }] =
    useUpdateUserProfileMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: UpdateUser = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
    };

    try {
      const res = await updateUserProfile(data).unwrap();
      if (!res) return;

      handleAlert(res.success, res.message);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h4>Profile</h4>{' '}
      <p className="p13">
        This information is used across your account and communications.
      </p>{' '}
      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <Avatar size="lg" name={user?.name} details={user?.email} />

        <div className="flex flex-col gap-5 lg:flex-row">
          <Input
            label="Name"
            type="text"
            name="name"
            defaultValue={user?.name || ''}
            placeholder="John Doe"
          />
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          <Input
            label="Email"
            type="email"
            name="email"
            defaultValue={user?.email || ''}
            placeholder="john@example.com"
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            defaultValue={user?.phone || ''}
            placeholder="+880 1711-123456"
          />
        </div>

        <Textarea
          label="Address"
          name="address"
          defaultValue={user?.address || ''}
          placeholder="House, Road, City"
        />

        <Button
          disabled={updating}
          loading={updating}
          type="submit"
          className="w-fit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default UserProfile;
