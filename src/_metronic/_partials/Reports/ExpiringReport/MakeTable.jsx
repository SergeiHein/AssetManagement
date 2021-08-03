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
import CircularProgress from "@material-ui/core/CircularProgress";
import Papa from "papaparse";
import {
  TableStyles,
  useStyles,
  TableHeadSpan,
} from "../../../layout/components/custom/css/MakeTable_Styles";
import { PaginationStyles } from "../../../layout/components/custom/css/MakeTable_Styles";
import IconButton from "@material-ui/core/IconButton";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import styled from "styled-components";
import { useExportData } from "react-table-plugins";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import moment from "moment";

const LoadingStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;

  div {
    margin-top: 7px;
  }
`;

const ErrTableStyles = styled.div`
  height: 100%;
  width: 93%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`;

export default function MakeTable({
  columns,
  data,
  subject,
  hideLicenseColumns,
  hideVehicleColumns,
  loading,
  exportOption,
  setExportOption,
}) {
  const instanceTable = useTable(
    {
      columns,
      data,
      getExportFileBlob,
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
    exportData,
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

  useEffect(() => {
    if (exportOption === "pdf") {
      exportData("pdf", true);
    } else if (exportOption === "csv") {
      exportData("csv", true);
    } else if (exportOption === "xlsx") {
      exportData("xlsx", true);
    }
  }, [exportOption]);

  const addFooters = (doc) => {
    console.log(doc);
    const pageCount = doc.internal.getNumberOfPages();

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        "Printed Date -" + moment(new Date()).format("DD-MM-YYYY hh:mm:ss A"),
        235,
        doc.internal.pageSize.height - 15,
        {
          align: "center",
        }
      );
      doc.text(
        "Page " + String(i) + " of " + String(pageCount),
        600,
        doc.internal.pageSize.height - 15,
        {
          align: "center",
        }
      );
    }
  };

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "csv") {
      // CSV example
      const headerNames = columns.map((col) => col.exportValue);
      const csvString = Papa.unparse({ fields: headerNames, data });
      setExportOption("");
      return new Blob([csvString], { type: "text/csv" });
    } else if (fileType === "xlsx") {
      // XLSX example
      const header = columns.map((c) => c.exportValue);
      const compatibleData = data.map((row) => {
        const obj = {};
        header.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });
      let wb = XLSX.utils.book_new();
      let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
        header,
      });
      XLSX.utils.book_append_sheet(wb, ws1, "Expiring Report Data");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      setExportOption("");
      return false;
    }
    //PDF example
    else if (fileType === "pdf") {
      var pdfsize = "a3";
      const headerNames = columns.map((column) => column.exportValue);
      const doc = new jsPDF("l", "pt", pdfsize);

      let wantedTableWidth = 595;
      let pageWidth = doc.internal.pageSize.width;
      let margin = (pageWidth - wantedTableWidth) / 2;
      doc.text(30, 40, "Expiring Report");
      doc.autoTable({
        head: [headerNames],
        body: data,
        startY: 70,
        theme: "grid",
        showHead: "everyPage",
        tableLineColor: 200,

        tableLineWidth: 0,
        didParseCell: function(table) {
          if (table.section === "head") {
            table.cell.styles.fillColor = "#ffffff";
            table.cell.styles.textColor = "#000000";
            table.cell.styles.lineWidth = "1";
          }
        },

        headStyles: {
          theme: "grid",
        },
        styles: {
          overflow: "linebreak",
          halign: "center",
          valign: "middle",
          fontSize: 10,
          cellPadding: 8,
          overflowColumns: "linebreak",
        },
      });

      addFooters(doc);

      doc.save(`${fileName}.pdf`);

      setExportOption("");
      return false;
    }
    // Other formats goes here
    return false;
  }

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
      {!loading.finish ? (
        <LoadingStyle>
          <CircularProgress />
          <div>Loading ..</div>
        </LoadingStyle>
      ) : loading.success ? (
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
                  <TableRow
                    {...headerGroup.getHeaderGroupProps()}
                    className="tr"
                  >
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
                                background: `${
                                  (cell.column.Header === "Status" ||
                                    cell.column.Header === "Asset Status") &&
                                  cell.row.original.chartColor
                                    ? cell.row.original.chartColor
                                    : ""
                                }`,
                                color: `${
                                  (cell.column.Header === "Status" ||
                                    cell.column.Header === "Asset Status") &&
                                  cell.row.original.chartColor
                                    ? "rgba(0, 0, 0, 0.87)"
                                    : ""
                                }`,
                                fontWeight: `${
                                  (cell.column.Header === "Status" ||
                                    cell.column.Header === "Asset Status") &&
                                  cell.row.original.chartColor
                                    ? 400
                                    : 400
                                }`,
                                left: `${
                                  cell.column.Header === "Actions"
                                    ? "87.2px"
                                    : "0px"
                                }`,
                                padding: 14,
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
      ) : (
        <ErrTableStyles>
          Seems like there is no data for this table
        </ErrTableStyles>
      )}
    </>
  );
}
