export interface ApiError {
  message: string;
  code?: string;
  statusCode?: string | number;
  details?: any;
  originalError?: any;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}
