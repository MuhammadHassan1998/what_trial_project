export type FormData = {
  username: string;
  password: string;
};

export type User = {
  refreshToken: string;
  accessToken: string;
  username: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  login: (formData: FormData) => void;
  logout: () => void;
};


export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  selected: boolean;
}

export interface ProductsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
