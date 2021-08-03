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
// import { TokenContext } from "../../../../app/BasePage";
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
import moment from "moment";
import * as XLSX from "xlsx";

// const IndeterminateCheckbox = React.forwardRef(
//   ({ indeterminate, ...rest }, ref) => {
//     const defaultRef = React.useRef();
//     const resolvedRef = ref || defaultRef;

//     React.useEffect(() => {
//       resolvedRef.current.indeterminate = indeterminate;
//     }, [resolvedRef, indeterminate]);

//     return (
//       <>
//         <Checkbox type="checkbox" ref={resolvedRef} {...rest} />
//       </>
//     );
//   }
// );

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
  width: 100%;
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
  //   setExportLoading,
}) {
  const instanceTable = useTable(
    {
      columns,
      data,
      getExportFileBlob,
      disableSortRemove: true,
      initialState: {
        pageIndex: 0,
        pageSize: 10,

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
  // const { empID } = useContext(TokenContext);
  // const [paginationReady, setPaginationReady] = useState(false);

  // console.log(pageSize);

  // state.hiddenColumns = ["asset", "total_Qty"];

  // console.log(allColumns);

  // console.log(selectedFlatRows);

  useEffect(() => {
    hideLicenseColumns &&
      allColumns.map((column) => column.show && column.toggleHidden(true));

    hideVehicleColumns &&
      allColumns.map((column) => column.show && column.toggleHidden(true));
  }, [allColumns, hideLicenseColumns, hideVehicleColumns]);

  // const [formName, setFormName] = useState();

  // console.log(page.length);

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
    // console.log(doc);
    const pageCount = doc.internal.getNumberOfPages();

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        "Printed Date -" + moment(new Date()).format("DD-MM-YYYY hh:mm:ss A"),
        235,
        doc.internal.pageSize.height - 25,
        {
          align: "center",
        }
      );
      doc.text(
        "Page " + String(i) + " of " + String(pageCount),
        800,
        doc.internal.pageSize.height - 25,
        {
          align: "center",
        }
      );
    }
  };

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    fileName = "Branch-Report";
    if (fileType === "csv") {
      // CSV example
      const headerNames = columns.map((col) => col.exportValue);
      const csvString = Papa.unparse({ fields: headerNames, data });

      if (setExportOption) {
        setExportOption("");
      }

      return new Blob([csvString], { type: "text/csv" });

      // if (typeof window.navigator.msSaveBlob !== "undefined") {
      // IE doesn't allow using a blob object directly as link href.
      // Workaround for "HTML7007: One or more blob URLs were
      // revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing
      // the URL has been freed."
      //   window.navigator.msSaveBlob(blob, "Branch-Report.csv");
      //   return;
      // }
      // var url = window.URL.createObjectURL(blob);
      // var anchor = document.createElement("a");
      // anchor.download = "yes.csv";
      // anchor.href = url;
      // anchor.click();
    }

    //PDF example
    else if (fileType === "pdf") {
      // console.log(fileName);
      // console.log(data);
      // console.log(columns);
      var pdfsize = "a3";
      const headerNames = columns.map((column) => column.exportValue);
      const doc = new jsPDF("l", "pt", pdfsize);
      // doc.page = 1; // use this as a counter.

      // function footer(){
      //     doc.text(150,285, 'page ' + doc.page); //print number bottom right
      //     doc.page ++;
      // };

      // let wantedTableWidth = 595;
      // let pageWidth = doc.internal.pageSize.width;
      // let margin = (pageWidth - wantedTableWidth) / 2;

      // console.log(headerNames);
      // var height = doc.internal.pageSize.height;
      doc.text(50, 40, "Asset List by Branch/Employee Report");
      // doc.text(130, doc.internal.pageSize.height - 10, "Footer");
      // doc.text(125, 25, "Activity Report");
      doc.autoTable({
        // html: "#table",
        head: [headerNames],
        body: data,
        startY: 70,
        margin: { bottom: 50 },
        theme: "grid",
        // tableWidth: "auto",
        // cellWidth: "wrap",
        showHead: "everyPage",
        tableLineColor: 200,
        // minCellHeight: 10,

        tableLineWidth: 0,
        columnStyles: {
          //   0: { cellWidth: 45 },
          //   2: { cellWidth: 60 },
          //   3: { cellWidth: 80 },
          //   4: { cellWidth: 100 },
          // 5: { cellWidth: 200 },
          // 6: { cellWidth: 70 },
        },
        didParseCell: function(table) {
          if (table.section === "head") {
            table.cell.styles.fillColor = "#ffffff";
            table.cell.styles.textColor = "#000000";
            table.cell.styles.lineWidth = "1";
          }
          // if (table.section !== "head") {
          // table.cell.styles.cellPadding = 7;
          // didParseCell: function(cell, opts) {
          //   cell.styles.cellPadding = 50;
          // }
          // }
        },
        // didParseCell: function(cell, data) {
        // },

        headStyles: {
          theme: "grid",
        },
        styles: {
          overflow: "linebreak",
          // fontSize: 50,
          halign: "center",
          valign: "middle",
          // cellWidth: "wrap",
          fontSize: 10,
          cellPadding: 8,
          overflowColumns: "linebreak",
        },
      });

      addFooters(doc);

      // function addFooters() {
      //   const pageCount = doc.internal.getNumberOfPages();
      //   for (var i = 0; i < pageCount; i++) {
      //     doc.text(String(i), 196, 285);
      //   }
      // }

      // addFooters();
      doc.save(`${fileName}.pdf`);

      if (setExportOption) {
        setExportOption("");
        // setExportLoading(false);
      }

      // setTimeout(() => {
      // }, 1000);

      // return false;
    } else {
      //   // XLSX example
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

      console.log(fileName);
      XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      // Returning false as downloading of file is already taken care of
      if (setExportOption) {
        setExportOption("");
        // setExportLoading(false);
      }
      // return false;
      return false;
    }
    // Other formats goes here
    return false;
  }

  function getDropDownOptionsFromRows(rows) {
    // console.log(rows);
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

  // console.log(getDropDownOptionsFromRows(50).concat("Show All"));

  // function handleChange(event) {
  //   console.log(event.target.value);
  //   setPersonName(event.target.value);
  // }
  // console.log(getto);

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
              // aria-label="sticky table"
              // className="sticky table"
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
                        // style={{
                        //   cursor: "pointer",
                        //   minWidth: column.id === "actions" ? "135px" : "105px",
                        // }}
                      >
                        <TableHeadSpan
                        // style={{
                        //   cursor: "pointer",
                        //   minWidth: column.id === "actions" ? "135px" : "105px",
                        // }}
                        >
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

                              // display: `${
                              //   cell.column.Header === "actions" ? "none" : ""
                              // }`,
                            },
                          ])}
                          className={`${
                            cell.column.sticky === "left"
                              ? "left-sticky-cell"
                              : cell.column.sticky === "right"
                              ? "right-sticky-cell"
                              : ""
                          }`}
                          // style={{
                          //   color: `${
                          //     cell.column.Header === "Status" &&
                          //     cell.row.original.chartColor
                          //       ? cell.row.original.chartColor
                          //       : ""
                          //   }`,
                          // }}
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
        <ErrTableStyles>Seems like there is no data</ErrTableStyles>
      )}
    </>
  );
}
