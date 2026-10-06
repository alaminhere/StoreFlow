import slugify from 'slugify';

export const createSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};
