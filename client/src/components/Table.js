import React, { useMemo, useImperativeHandle } from "react";
import { useTable, useGlobalFilter } from "react-table";

import "../assets/css/table.css";

export const Table = React.forwardRef(({ dashData, COLUMNS, bodyBg }, ref) => {
  const columns = useMemo(() => COLUMNS, [COLUMNS]);
  const data = useMemo(() => dashData, [dashData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  useImperativeHandle(ref, () => tableInstance);

  return (
    <div className="mt-3" style={{ overflowX: "auto" }}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} style={{ backgroundColor: bodyBg }}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
