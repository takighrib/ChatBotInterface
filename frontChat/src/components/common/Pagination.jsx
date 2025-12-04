import React from "react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border transition ${
          currentPage === 1
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        Précédent
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md border transition ${
            currentPage === page
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border transition ${
          currentPage === totalPages
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
