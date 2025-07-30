import { PaginationProps } from '@components/common/Pagination/Typing';
import { CaretLeft, CaretLeftSquare, CaretRight, CaretRightSquare } from 'react-bootstrap-icons';

import React from 'react';
/**
 * @title Pagination Component
 * @notice Handles the display and interaction of a pagination system in a React application
 * @dev This component provides navigation controls for paginating through data sets
 */
export default function PaginationComponent({
  total,
  current,
  perPage,
  handleNextPage,
  handlePreviousPage,
  handleFirstPage,
  handleLastPage,
}: PaginationProps) {
  /**
   * @dev State to track total number of records
   * @param total The total number of records passed as a prop
   */
  const [totalRecords, setTotalRecords] = React.useState(total);

  /**
   * @dev State to keep track of the current page
   * @param current The current page number passed as a prop
   */
  const [currentPage, setCurrentPage] = React.useState(current);

  /**
   * @dev Constant to define maximum number of records per page
   * @param perPage Number of records per page, passed as a prop
   */
  const maxPerPage = perPage;

  /**
   * @dev Function to calculate the total number of pages
   * @return The total number of pages based on total records and records per page
   */
  const totalPages = () => {
    return Math.ceil(totalRecords / maxPerPage);
  };

  /**
   * @dev Effect hook to synchronize currentPage state with current prop
   * @param current Dependency array including the current page
   */
  React.useEffect(() => {
    setCurrentPage(current);
  }, [current]);

  return (
    <>
      <div className="flex items-center gap-2">
        <CaretLeftSquare
          className="w-6 h-5 transition-all duration-200 hover:scale-110 rounded-xs fill-[#5E6992] cursor-pointer"
          onClick={() => handleFirstPage?.()}
        />
        <CaretLeft
          size={24}
          className="transition-all duration-200 hover:scale-110"
          style={{
            cursor: 'pointer',
            pointerEvents: currentPage === 1 ? 'none' : 'auto',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
          onClick={() => handlePreviousPage?.()}
        />
        <p className="text-sm md:text-base">Page</p>
        <p className="w-5 h-fit md:w-6 md:h-fit border border-blue-gray rounded-xs grid justify-items-center items-center fill-blue-gray text-sm md:text-base">
          {currentPage}
        </p>
        <p className="text-sm md:text-base">of</p>
        <p className="text-sm md:text-base">{totalPages()}</p>
        <CaretRight
          className="w-5 h-5 transition-all duration-200 hover:scale-110 rounded-xs fill-[#5E6992] cursor-pointer"
          style={{
            cursor: 'pointer',
            pointerEvents: currentPage === totalPages() ? 'none' : 'auto',
            opacity: currentPage === totalPages() ? 0.5 : 1,
          }}
          onClick={() => handleNextPage?.()}
        />
        <CaretRightSquare
          className="w-6 h-5 transition-all duration-200 hover:scale-110 rounded-xs fill-[#5E6992] cursor-pointer"
          onClick={() => handleLastPage?.()}
        />
      </div>
    </>
  );
}
