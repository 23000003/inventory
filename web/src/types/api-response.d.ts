
type Pagination = {
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
};

export type ApiResponse<T = undefined> = {
    success: boolean;
    message: string;
    data?: T;
    pagination?: Pagination;
};
  