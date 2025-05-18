export interface ApiResponse<T> {
  data: T;
  error?: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}