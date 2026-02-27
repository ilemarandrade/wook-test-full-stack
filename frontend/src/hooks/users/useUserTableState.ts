import { useState } from 'react';

const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export interface UserTableState {
  page: number;
  pageSize: PageSizeOption;
}

export interface UseUserTableStateResult extends UserTableState {
  setPage: (page: number) => void;
  setPageSize: (pageSize: PageSizeOption) => void;
  pageSizeOptions: readonly PageSizeOption[];
}

export function useUserTableState(initialState?: Partial<UserTableState>): UseUserTableStateResult {
  const [page, setPage] = useState(initialState?.page ?? 1);
  const [pageSize, setPageSizeInternal] = useState<PageSizeOption>(initialState?.pageSize ?? 10);

  const setPageSize = (nextPageSize: PageSizeOption) => {
    setPage(1);
    setPageSizeInternal(nextPageSize);
  };

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
  };
}

