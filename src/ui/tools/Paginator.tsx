import { Dispatch, SetStateAction, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/shadcn/Pagination";

export function Paginator({
  currentPage,
  totalPages,
  pageWindowLen = 3,
  setFilters
}: {
  currentPage: number;
  totalPages: number;
  pageWindowLen?: number;
  setFilters: Dispatch<SetStateAction<{
    page: number;
    [extra_key: string]: any;
  }>>;
}) {
  const pageArray = useMemo(() => {
    const arr = [];
    for (let i = Math.max(1, currentPage - pageWindowLen); i <= Math.min(totalPages, currentPage + pageWindowLen); i++) {
      arr.push(i);
    }
    return arr;
  }, [currentPage, totalPages]);

  const changePage = (page: number) => {
    setFilters(prev => ({
      ...prev, page
    }));
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="bg-[#121212] text-white"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
          />
        </PaginationItem>

        {currentPage - pageWindowLen > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => changePage(1)}>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {pageArray.map(pageNum => {
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={currentPage == pageNum}
                onClick={() => changePage(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })
        }

        {currentPage + pageWindowLen < totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => changePage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            className="bg-[#121212] text-white"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}