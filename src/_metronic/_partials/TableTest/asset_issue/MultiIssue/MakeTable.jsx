import React, { useEffect, useMemo } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
} from "react-table";
import { useSticky } from "react-table-sticky";
import TableBody from "@material-ui/core/TableBody";

import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";

import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import {
  TableStyles,
  useStyles,
  TableHeadSpan,
} from "../../../../layout/components/custom/css/MakeTable_Styles";
import { PaginationStyles } from "../../../../layout/components/custom/css/MakeTable_Styles";
import IconButton from "@material-ui/core/IconButton";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import styled from "styled-components";
import { useExportData } from "react-table-plugins";

export default function MakeTable({
  columns,
  data,
  subject,
  hideLicenseColumns,
  hideVehicleColumns,
  setExportOption,
}) {
  const instanceTable = useTable(
    {
      columns,
      data,

      disableSortRemove: true,
      initialState: {
        pageIndex: 0,
        sortBy: [
          subject === "main"
            ? {
                id: "asset",
                desc: false,
              }
            : subject === "form-sub"
            ? {
                id: "supplier",
                desc: false,
              }
            : {
                id: "asset_Name",
                desc: false,
              },
        ],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useSticky,
    useRowSelect,
    useExportData
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    pageOptions,
    allColumns,

    state: { pageIndex, pageSize },
  } = useMemo(() => instanceTable, [instanceTable]);

  useEffect(() => {
    hideLicenseColumns &&
      allColumns.map((column) => column.show && column.toggleHidden(true));

    hideVehicleColumns &&
      allColumns.map((column) => column.show && column.toggleHidden(true));
  }, [allColumns, hideLicenseColumns, hideVehicleColumns]);

  useEffect(() => {
    allColumns.map((column) => column.hidden && column.toggleHidden(true));
  }, [allColumns]);

  const classes = useStyles();

  function getDropDownOptionsFromRows(rows) {
    if (rows <= 50) {
      return Array(Math.floor(rows / 10))
        .fill(undefined)
        .map((el, i) => (i + 1) * 10);
    } else {
      if (setExportOption) {
        return getDropDownOptionsFromRows(50)
          .concat(100)
          .concat("All");
      } else {
        return getDropDownOptionsFromRows(50).concat(
          Array(Math.floor(rows / 100))
            .fill(undefined)
            .map((el, i) => (i + 1) * 100)
        );
      }
    }
  }

  return (
    <>
      <>
        <TableContainer component={Paper} style={{ overflowY: "hidden" }}>
          <TableStyles
            {...getTableProps}
            style={{
              borderCollapse: "unset",
            }}
            className="sticky"
          >
            <TableHead className="header">
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()} className="tr">
                  {headerGroup.headers.map((column) => (
                    <TableCell
                      {...column.getHeaderProps()}
                      {...column.getHeaderProps(
                        column.getSortByToggleProps({ title: undefined })
                      )}
                      className={
                        classes.tablecell +
                        ` table-cell-${
                          column.id === "actions"
                            ? "actions"
                            : column.id === "checkbox"
                            ? "c"
                            : column.id === "asset_Name"
                            ? "a"
                            : "default"
                        }` +
                        ` ${
                          column.sticky === "left"
                            ? "left-sticky-cell"
                            : column.sticky === "right"
                            ? "right-sticky-cell"
                            : ""
                        }`
                      }
                    >
                      <TableHeadSpan>
                        {column.render("Header")}
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ExpandMoreIcon
                              fontSize="large"
                              style={{
                                transition: "250ms transform",
                                marginLeft: "7px",
                                fontSize: "20px",
                              }}
                              color="disabled"
                            ></ExpandMoreIcon>
                          ) : (
                            <ExpandLessIcon
                              fontSize="large"
                              style={{
                                transition: "250ms transform",
                                marginLeft: "7px",
                                fontSize: "20px",
                              }}
                              color="disabled"
                            ></ExpandLessIcon>
                          )
                        ) : (
                          ""
                        )}
                      </TableHeadSpan>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps}>
              {page.map((row, i) => {
                prepareRow(row);

                return (
                  <TableRow
                    {...row.getRowProps()}
                    data-id={row.original.id ? row.original.id : ""}
                  >
                    {row.cells.map((cell) => (
                      <TableCell
                        {...cell.getCellProps([
                          {
                            style: {
                              left: `${
                                cell.column.Header === "Actions"
                                  ? "87.2px"
                                  : "0px"
                              }`,
                              padding: 14,
                              width: `${(cell.column.Header === "Asset Name" ||
                                cell.column.Header === "Location") &&
                                "30%"}`,
                            },
                          },
                        ])}
                        className={`${
                          cell.column.sticky === "left"
                            ? "left-sticky-cell"
                            : cell.column.sticky === "right"
                            ? "right-sticky-cell"
                            : ""
                        }`}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </TableStyles>
        </TableContainer>

        {subject !== "form-sub" && (
          <PaginationStyles bottom>
            {" "}
            <IconButton
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <NavigateBeforeIcon></NavigateBeforeIcon>
            </IconButton>{" "}
            <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
              <NavigateNextIcon></NavigateNextIcon>
            </IconButton>{" "}
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <FormControl>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {getDropDownOptionsFromRows(data.length).map((pageSize) => (
                  <MenuItem
                    id={pageSize}
                    value={pageSize === "All" ? data.length : pageSize}
                    key={pageSize}
                  >
                    Show {pageSize}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </PaginationStyles>
        )}
      </>
    </>
  );
}
