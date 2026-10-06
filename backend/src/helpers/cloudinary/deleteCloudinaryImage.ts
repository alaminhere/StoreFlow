'use server';

import cloudinary from './cloudinary.js';

export const deleteCloudinaryImage = async (public_id: string) => {
  await cloudinary.uploader.destroy(public_id);
};
