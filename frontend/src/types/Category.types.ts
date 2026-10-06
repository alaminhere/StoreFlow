export interface Category {
  id: string; 
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreateCategory {
  name: string;
}
export type UpdateCategory = {
  id: string;
  name: string;
};
