/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';

import PopupModal from '../PopupModal';
import handleAlert from '@/helpers/handleAlert';
import { Loader, Plus, X } from '@/helpers/icon/icon';
import getApiErrorMessage from '@/helpers/getApiErrorMessage';
import generateImgURL from '@/helpers/cloudinary/generateImgURL';
import { deleteCloudinaryImage } from '@/helpers/cloudinary/deleteCloudinaryImage';

import { useBrandListQuery } from '@/redux/feature/brandSlice';
import { useCategoryListQuery } from '@/redux/feature/categorySlice';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/redux/feature/productSlice';
import { CreateProduct, Product } from '@/types/product.types';

type LogoState = {
  url: string;
  public_id: string;
} | null;

type Props = {
  product?: Product | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ProductForm = ({ product, setOpen, open }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [prevUrls, setPrevUrls] = useState<LogoState>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProduct>();

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  // Queries
  const { data: brandData } = useBrandListQuery();
  const { data: categoryData } = useCategoryListQuery();
  const CATEGORY = categoryData?.data ?? [];
  const BRAND = brandData?.data ?? [];

  const isEdit = !!product;
  const loading = loadingCreate || loadingUpdate;

  // Set product data when editing
  useEffect(() => {
    if (!product) return;

    reset({
      name: product.name,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category.slug,
      brand: product.brand.slug,
      stock: product.stock,
      minimumStockLevel: product.minimumStockLevel,
      price: product.price,
      sellingPrice: product.sellingPrice,
      description: product.description,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrevUrls(product.image);
  }, [product, CATEGORY, BRAND, reset]);
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
      setIsLoading(false);
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

  const onsubmit = async (data: CreateProduct) => {
    if (!prevUrls) {
      handleAlert(false, 'Please upload an image');
      return;
    }
    const payload = {
      ...data,
      image: prevUrls,
    };
    try {
      const res = isEdit
        ? await updateProduct({
            id: product.id,
            ...payload,
          }).unwrap()
        : await createProduct(payload).unwrap();

      if (!res) return;
      if (res.success) {
        reset();
        setPrevUrls(null);
        setOpen(false);
      }
      handleAlert(res.success, res.message);
    } catch (err) {
      handleAlert(false, getApiErrorMessage(err));
    }
  };

  return (
    <>
      {open && (
        <PopupModal
          className=""
          onClose={() => setOpen(false)}
          label={isEdit ? 'Edit Product' : 'Add New Product'}
        >
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="flex flex-col gap-5"
          >
            {/* Image upload */}
            <div>
              <div className="grid grid-cols-4 gap-2">
                {prevUrls && (
                  <div className="relative aspect-square overflow-hidden rounded-md border border-border">
                    <Image
                      src={prevUrls.url || '/'}
                      alt="img"
                      width={100}
                      height={100}
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
                  className={`flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border ${
                    prevUrls ? 'hidden' : ''
                  }`}
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
            </div>

            {/* Name / SKU */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                label="Product Name *"
                placeholder="Enter product name"
                {...register('name', {
                  required: 'Name is required',
                })}
                error={errors.name}
              />

              <Input
                label="SKU *"
                placeholder="e.g KB-WM-01"
                {...register('sku', {
                  required: 'SKU is required',
                })}
                error={errors.sku}
              />
            </div>

            {/* Barcode */}
            <Input
              label="Barcode"
              placeholder="Enter barcode"
              {...register('barcode', {
                required: 'Barcode is required',
              })}
              error={errors.barcode}
            />

            {/* Category / Brand */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Select
                label="Category"
                {...register('category', {
                  required: 'Category is required',
                })}
                error={errors.category}
              >
                {CATEGORY.map(item => (
                  <option
                    key={item.id}
                    value={item.slug}
                    className="bg-surface"
                  >
                    {item.slug}
                  </option>
                ))}
              </Select>

              <Select
                label="Brand"
                {...register('brand', {
                  required: 'Brand is required',
                })}
                error={errors.brand}
              >
                {BRAND.map(item => (
                  <option
                    key={item.id}
                    value={item.slug}
                    className="bg-surface"
                  >
                    {item.slug}
                  </option>
                ))}
              </Select>
            </div>

            {/* Stock / Minimum Stock Level */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                disabled={isEdit}
                label="Stock"
                type="number"
                placeholder="0"
                {...register('stock', {
                  required: 'Stock is required',
                  valueAsNumber: true,
                })}
                error={errors.stock}
              />

              <Input
                disabled={isEdit}
                label="Minimum Stock Level"
                type="number"
                placeholder="e.g 10"
                {...register('minimumStockLevel', {
                  required: 'Minimum stock level is required',
                  valueAsNumber: true,
                })}
                error={errors.minimumStockLevel}
              />
            </div>

            {/* Price / Selling Price */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                label="Price"
                type="number"
                placeholder="0.00"
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                })}
                error={errors.price}
              />

              <Input
                label="Selling Price"
                type="number"
                placeholder="0.00"
                {...register('sellingPrice', {
                  required: 'Selling price is required',
                  valueAsNumber: true,
                })}
                error={errors.sellingPrice}
              />
            </div>

            {/* Description */}
            <Textarea
              label="Description"
              rows={3}
              placeholder="Enter product description"
              {...register('description', {
                required: 'Description is required',
              })}
              error={errors.description}
            />

            {/* Submit */}
            <Button loading={loading} disabled={loading} type="submit">
              {isEdit ? 'Update Product' : 'Save Product'}
            </Button>
          </form>
        </PopupModal>
      )}
    </>
  );
};

export default ProductForm;
