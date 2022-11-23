import React, { useImperativeHandle, useMemo } from "react";
import { useGlobalFilter, usePagination, useTable } from "react-table";
import {
  BsChevronRight,
  BsChevronLeft,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from "react-icons/bs";

import { classNames } from "../utils/classNames";

export const PaginationTable = React.forwardRef(
  ({ tableData, COLUMNS, bodyBg, handleSelection }, ref) => {
    const columns = useMemo(() => COLUMNS, [COLUMNS]);
    const data = useMemo(() => tableData, [tableData]);

    const tableInstance = useTable(
      {
        columns,
        data,
        initialState: { pageSize: 10 },
      },
      useGlobalFilter,
      usePagination
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      pageOptions,
      gotoPage,
      pageCount,
      prepareRow,
      setPageSize,
      state,
    } = tableInstance;

    useImperativeHandle(ref, () => tableInstance);

    return (
      <>
        <div className="overflow-x-auto flex justify-center  m-2 ">
          <table {...getTableProps()} className=" w-full ml-96 sm:ml-0">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="bg-secondry p-3 font-semibold text-lg text-white"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={() => handleSelection(row.original)}
                    className="hover:bg-zinc-200 hover:text-secondry duration-500 focus:bg-primary"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className=" text-center py-1 cursor-pointer"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="py-3 ml-16 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex gap-x-2 ml-5">
              <span className="text-sm text-gray-700">
                Page <span className="font-medium">{state.pageIndex + 1}</span>{" "}
                of <span className="font-medium">{pageOptions.length}</span>
              </span>
              <select
                className="outline-none cursor-pointer bg-zinc-300 rounded-md"
                value={state.pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[15, 20, 25].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <nav
                className="relative mr-5 z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <PageButton
                  className="rounded-l-md"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">First</span>
                  <BsChevronDoubleLeft className="h-5 w-5" aria-hidden="true" />
                </PageButton>
                <PageButton
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Previous</span>
                  <BsChevronLeft className="h-5 w-5" aria-hidden="true" />
                </PageButton>
                <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                  <span className="sr-only">Next</span>
                  <BsChevronRight className="h-5 w-5" aria-hidden="true" />
                </PageButton>
                <PageButton
                  className="rounded-r-md"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Last</span>
                  <BsChevronDoubleRight
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </PageButton>
              </nav>
            </div>
          </div>
        </div>
      </>
    );
  }
);

function Button({ children, className, ...rest }) {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PageButton({ children, className, ...rest }) {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-primary hover:bg-gray-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
