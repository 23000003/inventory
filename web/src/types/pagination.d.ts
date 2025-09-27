export type Pagination = {
  page: number;
  pageSize: number;
}

export type PaginationDetails = {
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
};