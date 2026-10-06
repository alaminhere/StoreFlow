export interface Brand {
  id: string; 
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrand {
  name: string;
}
export interface UpdateBrand {
  id: string;
  name: string;
}
