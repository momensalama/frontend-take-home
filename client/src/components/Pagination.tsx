import type { Pagination as PaginationType } from "../types";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={!pagination.hasPreviousPage}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600 min-w-[120px] text-center">
        Page {pagination.page} of {pagination.totalPages}
      </span>
      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={!pagination.hasNextPage}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
