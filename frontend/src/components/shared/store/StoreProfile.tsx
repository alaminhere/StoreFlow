'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';

import handleAlert from '@/helpers/handleAlert';
import { Loader, Plus, X } from '@/helpers/icon/icon';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import { deleteCloudinaryImage } from '@/helpers/cloudinary/deleteCloudinaryImage';
import generateImgURL from '@/helpers/cloudinary/generateImgURL';

import { useUpdateStoreMutation } from '@/redux/feature/storeSlice';
import { Store } from '@/types/store.types';

type LogoState = {
  url: string;
  public_id: string;
} | null;

const StoreProfile = ({ store }: { store: Store }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prevUrls, setPrevUrls] = useState<LogoState>(null);
  const [updateStore, { isLoading: uploading }] = useUpdateStoreMutation();

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

      setIsLoading(false);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    const url = store.logo.url.trim();
    const public_id = store.logo.public_id.trim();

    if (url && public_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrevUrls({
        url: url,
        public_id: public_id,
      });
    }
  }, [store]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { file, ...data } = Object.fromEntries(formData.entries());
    const payload = {
      ...data,
      logo: {
        url: prevUrls?.url ?? '',
        public_id: prevUrls?.public_id ?? '',
      },
    };
    console.log(payload);
    try {
      const res = await updateStore(payload).unwrap();
      if (!res) return;

      handleAlert(res.success, res.message || '');
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Business Profile</h3>

      <p className="p14">This appears on your invoices and dashboard.</p>

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        {/* Profile Logo */}
        <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
          {prevUrls && (
            <div className="relative aspect-square overflow-hidden rounded-md border border-border">
              <Image
                src={prevUrls.url || '/'}
                alt="img"
                width={50}
                height={50}
                className="h-full w-full object-cover"
              />

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <Loader size={20} className="animate-spin text-text" />
                </div>
              )}

              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 h-fit w-fit cursor-pointer rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <label
            htmlFor="file"
            className={`flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border ${prevUrls ? 'hidden' : ''}`}
          >
            {isLoading ? (
              <Loader size={20} className="animate-spin text-text" />
            ) : (
              <Plus className="text-muted-foreground" size={18} />
            )}
          </label>

          <input
            onChange={uploadImage}
            type="file"
            name="file"
            id="file"
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
        <div className="flex flex-col gap-5 lg:flex-row">
          <Input
            label="Business Name"
            type="text"
            name="name"
            defaultValue={store?.name || ''}
            placeholder="Hafu Traders"
          />

          <Input
            name="tagline"
            label="Tagline"
            type="text"
            defaultValue={store?.tagline || ''}
            placeholder="Wholesale & Retail Supplier"
          />
        </div>
        <div className="flex flex-col gap-5 lg:flex-row">
          <Input
            label="Email"
            type="email"
            name="email"
            defaultValue={store?.email || ''}
            placeholder="hello@novatraders.com"
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            defaultValue={store?.phone || ''}
            placeholder="+880 1711-123456"
          />
        </div>

        <Textarea
          label="Address"
          name="address"
          defaultValue={store?.address || ''}
          placeholder="address"
        />
        <Button
          disabled={uploading}
          loading={uploading}
          type="submit"
          className="w-fit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default StoreProfile;
