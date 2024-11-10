import { Dispatch, SetStateAction, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";

export default function Paginator({
  currentPage,
  totalPages,
  pageWindowLen = 3,
  setFilters
}: {
  currentPage: number;
  totalPages: number;
  pageWindowLen?: number;
  setFilters: Dispatch<SetStateAction<any>>;
  // setFilters: Dispatch<SetStateAction<{
  //   page: number;
  //   [extra_key: string]: any;
  // }>>; //TODO
}) {
  const pageArray = useMemo(() => {
    const arr = [];
    for (let i = Math.max(1, currentPage - pageWindowLen); i <= Math.min(totalPages, currentPage + pageWindowLen); i++) {
      arr.push(i);
    }
    return arr;
  }, [currentPage, pageWindowLen, totalPages]);

  const changePage = (page: number) => {
    setFilters((prev: any) => ({
      ...prev, page
    }));
  };

  return (
    <Pagination className="mt-6">
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