import "./Pagination.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
}

function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(currentPage, totalPages);

    return (
        <nav className={`pagination ${className}`} aria-label="Phân trang">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Trang trước"
            >
                ‹
            </button>

            {pages.map((page, index) =>
                page === "..." ? (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">…</span>
                ) : (
                    <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                        onClick={() => onPageChange(page as number)}
                        aria-current={currentPage === page ? "page" : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Trang sau"
            >
                ›
            </button>
        </nav>
    );
}

export default Pagination;
