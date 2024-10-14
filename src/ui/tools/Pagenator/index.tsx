"use client";

import React, { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/shadcn/Pagination";

type PagenatorProps = {
  page: number;
  itemsPerPage: number;
  numData: number;
  // totalPage: number;
  pageWindowLen?: number;
  onPageChange: (page: number) => void;
}

export function Pagenator({
  page,
  itemsPerPage,
  numData,
  pageWindowLen = 3,
  onPageChange
}: PagenatorProps) {
  const totalPage = Math.ceil(numData / itemsPerPage);

  const pageArray = useMemo(() => {
    const arr = [];
    for (let i = Math.max(0, page - pageWindowLen); i < Math.min(totalPage, page + pageWindowLen + 1); i++) {
      arr.push(i);
    }
    return arr;
  }, [page, totalPage]);

  function handlePageClick(page: number) {
    if (page < 0) {
      alert("첫 페이지 입니다.");
      return;
    }
    if (page > totalPage - 1) {
      alert("마지막 페이지 입니다.");
      return;
    }
    onPageChange(page);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem onClick={() => handlePageClick(page - 1)}>
          <PaginationPrevious className="bg-[#121212] text-white"/>
        </PaginationItem>

        {page - pageWindowLen > 1 && (
          <>
            <PaginationItem onClick={() => handlePageClick(0)}>
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {pageArray.map((idx) => {
          return (
            <PaginationItem key={idx} onClick={() => handlePageClick(idx)}>
              <PaginationLink isActive={page == idx}>
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {page + pageWindowLen < totalPage - 2 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem onClick={() => handlePageClick(totalPage - 1)}>
              <PaginationLink>{totalPage}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem onClick={() => handlePageClick(page + 1)}>
          <PaginationNext className="bg-[#121212] text-white" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}