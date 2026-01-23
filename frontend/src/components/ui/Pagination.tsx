import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const visiblePages = pages.filter(p =>
    p === 1 ||
    p === totalPages ||
    (p >= currentPage - 1 && p <= currentPage + 1)
  )

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex items-center justify-end space-x-2", className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 truncate"
      >
        <ChevronLeft size={16} className="mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="hidden sm:flex items-center space-x-1">
        {visiblePages.map((page, index) => {
          const isGap = index > 0 && page !== visiblePages[index - 1] + 1;

          return (
            <React.Fragment key={page}>
              {isGap && (
                <span className="w-9 h-9 flex items-center justify-center text-muted-foreground">
                  <MoreHorizontal size={14} />
                </span>
              )}
              <Button
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={cn(
                  "w-9 h-9 p-0 rounded-lg",
                  currentPage === page && "font-bold"
                )}
              >
                {page}
              </Button>
            </React.Fragment>
          )
        })}
      </div>

      <div className="sm:hidden text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-2">
        Page {currentPage} / {totalPages}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 truncate"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} className="ml-1" />
      </Button>
    </nav>
  )
}
