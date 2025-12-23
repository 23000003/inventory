import { PaginationDetails } from "./pagination";

export type ApiResponse<T = undefined> = {
    success: boolean;
    message: string;
    data?: T;
};

export type PaginatedApiResponse<T = undefined> = ApiResponse<T> & {
    pagination: PaginationDetails;
}
