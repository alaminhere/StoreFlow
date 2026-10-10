'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import PopupModal from '../PopupModal';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import handleAlert from '@/helpers/handleAlert';
import getInitials from '@/helpers/getInitials';
import { Loader, Upload } from '@/helpers/icon/icon';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import generateImgURL from '@/helpers/cloudinary/generateImgURL';
import { useCreateStoreMutation } from '@/redux/feature/storeSlice';
import { deleteCloudinaryImage } from '@/helpers/cloudinary/deleteCloudinaryImage';
import { useRouter } from 'next/navigation';

type LogoState = {
  url: string;
  public_id: string;
} | null;

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export interface CreateStoreForm {
  name: string;
  email: string;
  phone: string;
  tagline: string;
  address: string;
}
const StoreForm = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [prevUrls, setPrevUrls] = useState<LogoState>(null);
  const [createStore, { isLoading: loading }] = useCreateStoreMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateStoreForm>();

  // eslint-disable-next-line react-hooks/incompatible-library
  const name = watch('name');
  const { color, initials } = getInitials(name || '');

  // Upload image
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 1024 * 1024 * 1;
    if (file.size > MAX_FILE_SIZE) {
      handleAlert(false, 'Image size must be less than 1MB');
      e.target.value = '';
      return;
    }

    try {
      setIsLoading(true);
      const res = await generateImgURL(file);

      if (res.success) {
        setPrevUrls({
          url: res.url,
          public_id: res.public_id,
        });
      } else {
        setPrevUrls(null);
        handleAlert(res.success, res.message);
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Remove image
  const removeImage = async () => {
    if (!prevUrls) return;
    setIsLoading(true);
    try {
      await deleteCloudinaryImage(prevUrls.public_id);
      setPrevUrls(null);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
    setIsLoading(false);
  };

  // Submit form
  const onSubmit = async (data: CreateStoreForm) => {
    if (!prevUrls) {
      handleAlert(false, 'Please upload a store logo');
      return;
    }
    const payload = {
      ...data,
      ...(prevUrls && { logo: prevUrls }),
    }; 
    try {
      const res = await createStore(payload).unwrap();
      if (!res) return;

      handleAlert(res.success, res.message);

      if (res.success) {
        router.push('/dashboard');
        reset();
        setPrevUrls(null);
        setOpen(false);
      }
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };
  return (
    <>
      {open && (
        <PopupModal onClose={() => setOpen(false)} label="Add New Store">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Header: avatar + role */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-border mb-5">
              <div className="relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-2xl">
                <div
                  className={clsx(
                    'flex h-full w-full items-center justify-center text-white font-medium uppercase',
                    !prevUrls && (name ? color : 'bg-primary'),
                  )}
                >
                  {isLoading ? (
                    <Loader size={18} className="animate-spin" />
                  ) : prevUrls ? (
                    <Image
                      src={prevUrls.url}
                      alt="Store logo"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  ) : name ? (
                    initials
                  ) : (
                    '?'
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate"> {watch('name') || 'New Store'}</h4>
                <p className="p12 truncate">
                  {watch('email') || 'example@gmail.com'}
                </p>
              </div>

              <span className="shrink-0 rounded-md bg-warning-bg px-2.5 py-1 p12 font-medium text-warning">
                Owner
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              {/* Name */}
              <Input
                label="Store Name"
                type="text"
                {...register('name', { required: 'Store name is required' })}
                placeholder="Rahim Electronics"
                error={errors.name}
              />

              {/* Email / Phone */}
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                <Input
                  label="Email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="store@example.com"
                  error={errors.email}
                />

                <Input
                  label="Phone"
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                  })}
                  placeholder="+880 1711-123456"
                  error={errors.phone}
                />
              </div>
              <Input
                label="Tagline"
                type="text"
                {...register('tagline', {
                  required: 'Tagline number is required',
                })}
                placeholder="Business Store"
                error={errors.tagline}
              />
              <Input
                label="Address"
                type="text"
                {...register('address', {
                  required: 'Address number is required',
                })}
                placeholder="Mymensingh Bangladesh"
                error={errors.tagline}
              />

              {/* Logo upload row (only when no logo yet) */}
              {!prevUrls && (
                <label
                  htmlFor="logo"
                  className="flex cursor-pointer items-center gap-2.5 rounded-md border-2 border-dashed border-border px-4 py-3 text-text-muted"
                >
                  <Upload size={16} />
                  <span className="p13">Upload logo</span>
                </label>
              )}
              <input
                onChange={uploadImage}
                type="file"
                name="logo"
                id="logo"
                accept="image/*"
                className="hidden"
              />
              {prevUrls && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="w-fit p13 text-danger cursor-pointer"
                >
                  Remove logo
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-border">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={loading}>
                Create Store
              </Button>
            </div>
          </form>
        </PopupModal>
      )}
    </>
  );
};

export default StoreForm;
