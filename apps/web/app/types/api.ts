export interface ApiSuccessResponse<T> {
    success?: boolean;
    data?: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}
