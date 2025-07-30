interface PaginationProps {
  total: number;
  current: number;
  perPage: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  handleFirstPage: () => void;
  handleLastPage: () => void;
}

export type { PaginationProps };
