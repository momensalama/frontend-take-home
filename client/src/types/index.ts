export interface Load {
  id: string;
  origin: string;
  destination: string;
  status: number;
  date: string;
  weight: number;
  carrier: number;
  price: number;
}

export interface Status {
  id: number;
  label: string;
}

export interface Carrier {
  id: number;
  label: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LoadsResponse {
  data: Load[];
  pagination: Pagination;
}

export interface LoadsQueryParams {
  page?: number;
  limit?: number;
  status?: number;
  carrier?: number;
  search?: string;
}
