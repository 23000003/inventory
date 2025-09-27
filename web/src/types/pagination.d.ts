export type PaginationType = {
  page: number;
  pageSize: number;
}

export type PaginationDetails = {
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalPageSize: number;
    hasPrevious: boolean;
    hasNext: boolean;
};