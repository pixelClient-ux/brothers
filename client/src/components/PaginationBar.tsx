"use client";
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
}

export function PaginationBar({ currentPage, totalPage }: PaginationProps) {
  const searchParams = useSearchParams();
  if (totalPage <= 1) return null;
  function getLink(page: number) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    return `?${newSearchParams.toString()}`;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getLink(currentPage - 1)}
            className={`${currentPage === 1 && "text-muted-foreground pointer-events-none"} transition-colors duration-300 hover:bg-transparent hover:text-gray-600`}
          />
        </PaginationItem>
        {Array.from({ length: totalPage }).map((_, i) => {
          const page = i + 1;
          const isEdage = page === 1 || page === totalPage;
          const IsNearCurrentPage = Math.abs(currentPage - page) <= 2;
          if (!isEdage && !IsNearCurrentPage) {
            if (i === 1 || i === totalPage - 2) {
              return (
                <PaginationItem key={page} className="hidden md:block">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          }
          return (
            <PaginationItem
              key={page}
              className={`${currentPage === page ? "pointer-events-none block" : "hidden md:block"} `}
            >
              <PaginationLink
                href={getLink(page)}
                isActive={currentPage === page}
                className={`${currentPage === page ? "bg-gray-900 text-white" : "text-white"} hover:bg-gray-400`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={getLink(currentPage + 1)}
            className={`${currentPage === totalPage && "text-muted-foreground pointer-events-none"} transition-colors duration-300 hover:bg-transparent hover:text-gray-600`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
