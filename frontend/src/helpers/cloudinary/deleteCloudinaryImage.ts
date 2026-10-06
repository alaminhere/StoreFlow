'use server';

import cloudinary from "./cloudinary";

export const deleteCloudinaryImage = async (public_id: string) => {
  await cloudinary.uploader.destroy(public_id);
};
