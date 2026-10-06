'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';

import PopupModal from '../PopupModal';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import handleAlert from '@/helpers/handleAlert';

import {
  useCreateStoreMemberMutation,
  useUpdateStoreMemberMutation,
} from '@/redux/feature/memberSlice';

import { useLazyGetUserByEmailQuery } from '@/redux/feature/user/userSlice';
import { CreateStoreMember, StoreMember } from '@/types/store.types';

type Props = {
  member?: StoreMember | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type SelectedUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
} | null;

export const ROLE = [
  {
    value: 'OWNER',
    label: 'Owner',
  },
  {
    value: 'ADMIN',
    label: 'Admin',
  },
  {
    value: 'MANAGER',
    label: 'Manager',
  },
  {
    value: 'SALESMAN',
    label: 'Salesman',
  },
] as const;

const MemberForm = ({ member, open, setOpen }: Props) => {
  // create and update mutations
  const [createStoreMember, { isLoading: loadingCreate }] =
    useCreateStoreMemberMutation();
  const [updateStoreMember, { isLoading: loadingUpdate }] =
    useUpdateStoreMemberMutation();
  //  user search by email
  const [getUserByEmail, { isFetching: loadingUser }] =
    useLazyGetUserByEmailQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateStoreMember>();

  // store searched email separately because email is only used for finding the user, not for create payload
  const [email, setEmail] = useState('');

  //store selected user information
  const [selectedUser, setSelectedUser] = useState<SelectedUser>(null);

  const isEdit = !!member;
  const isLoading = loadingCreate || loadingUpdate;

  //set initial data when editing
  useEffect(() => {
    if (member) {
      reset({
        userId: member.userId,
        role: member.role,
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedUser({
        id: member.userId,
        name: member.name,
        email: member.email,
        phone: member.phone,
      });

      return;
    }

    reset({
      userId: '',
      role: undefined,
    });

    setEmail('');
    setSelectedUser(null);
  }, [member, reset]);

  // search user by email
  const handleSearchUser = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      handleAlert(false, 'Please enter member email');
      return;
    }

    try {
      const res = await getUserByEmail(trimmedEmail).unwrap();
      const data = res.data;

      if (!res.success || !data) {
        setSelectedUser(null);
        setValue('userId', '');

        handleAlert(false, res.message || 'User not found');

        return;
      }

      // set selected user information
      setSelectedUser({
        id: data.id!,
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      setValue('userId', data.id!, {
        shouldValidate: true,
      });
    } catch (err) {
      setSelectedUser(null);
      setValue('userId', '');

      handleAlert(false, getApiErrorMessage(err));
    }
  };

  const onSubmit = async (data: CreateStoreMember) => {
    try {
      const res = isEdit
        ? await updateStoreMember({
            id: member.id,
            role: data.role,
          }).unwrap()
        : await createStoreMember({
            userId: data.userId,
            role: data.role,
          }).unwrap();

      if (!res) return;

      handleAlert(res.success, res.message);

      if (res.success) {
        reset();
        setEmail('');
        setSelectedUser(null);
        setOpen(false);
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      {open && (
        <PopupModal
          className="max-w-xl"
          onClose={() => setOpen(false)}
          label={isEdit ? 'Edit Member' : 'Add New Member'}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Member Email */}
            {!isEdit && (
              <>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      label="Member Email *"
                      type="email"
                      placeholder="Enter member email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      readOnly={isEdit}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleSearchUser}
                    loading={loadingUser}
                    disabled={loadingUser || !email.trim()}
                    className="mb-1"
                  >
                    Search
                  </Button>
                </div>

                <p className="text-sm text-text-muted">
                  Enter an Global user email to find the member.
                </p>
              </>
            )}


            {selectedUser && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <h4>Member Information</h4>

                <div>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="w-10 p12">Name</span>

                    <span className="p14 text-text">{selectedUser.name}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="w-10 p12">Email</span>

                    <span className="p14 text-text">{selectedUser.email}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="w-10 p12">Phone</span>

                    <span className="p14 text-text">{selectedUser.phone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden User ID */}
            <input
              type="hidden"
              {...register('userId', {
                required: !isEdit
                  ? 'Please search and select a valid user'
                  : false,
              })}
            />

            {/* Member Role */}
            <Select
              label="Member Role *"
              placeholder="Select member role"
              {...register('role', {
                required: 'Member role is required',
              })}
              error={errors.role}
            >
              <option value="" className="bg-surface">
                Select member role
              </option>

              {ROLE.map(role => (
                <option
                  key={role.value}
                  value={role.value}
                  className="bg-surface"
                >
                  {role.label}
                </option>
              ))}
            </Select>

            {/* Submit */}
            <Button
              loading={isLoading}
              disabled={isLoading || (!isEdit && !selectedUser)}
              type="submit"
            >
              {isEdit ? 'Update Member' : 'Save Member'}
            </Button>
          </form>
        </PopupModal>
      )}
    </>
  );
};

export default MemberForm;
