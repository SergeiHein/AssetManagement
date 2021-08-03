import React, { useState, useEffect, useMemo } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
  useBlockLayout,
  useRowSelect,
} from "react-table";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import { useSticky } from "react-table-sticky";
import TableBody from "@material-ui/core/TableBody";
import InputLabel from "@material-ui/core/InputLabel";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Input from "@material-ui/core/Input";
import GetAppIcon from "@material-ui/icons/GetApp";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import { useExportData } from "react-table-plugins";
import Papa from "papaparse";
import {
  TableStyles,
  CreateAssetLink,
  useStyles,
  TableHeadSpan,
  AddAssetWrapper,
  TableOptionsWrapper,
  TableNavWrapper,
  TableNavRight,
  TableHeaderWrapper,
  PaginationStyles,
} from "../../../layout/components/custom/css/MakeTableMain_Styles";
import GlobalFilter from "../../../layout/components/custom/GlobalFilter";
import IconButton from "@material-ui/core/IconButton";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import styled from "styled-components";

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
}) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 105,
      width: 130,
      maxWidth: 150,
    }),
    []
  );
  const instanceTable = useTable(
    {
      columns,
      data,
      defaultColumn,
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
    useBlockLayout,
    useSticky,
    useRowSelect,
    useExportData
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    state,
    prepareRow,
    exportData,
    preGlobalFilteredRows,
    setGlobalFilter,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    pageOptions,
    allColumns,
    selectedFlatRows,
    toggleAllRowsSelected,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useMemo(() => instanceTable, [instanceTable]);
  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });

  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

  // hide columns

  useEffect(() => {
    hideLicenseColumns &&
      allColumns.map((column) => column.show && column.toggleHidden(true));

    hideVehicleColumns &&
      allColumns.map((column) => column.show && column.toggleHidden(true));
  }, [allColumns, hideLicenseColumns, hideVehicleColumns]);

  const [personName, setPersonName] = useState([]);
  const [option, setOption] = React.useState("");

  useEffect(() => {
    allColumns.map((column) => column.hidden && column.toggleHidden(true));
  }, [allColumns]);

  const classes = useStyles();

  // export function

  function handleOptionChange(event) {
    setOption(event.target.value);

    if (event.target.value.toLowerCase() === "excel") {
      if (selectedFlatRows.length === 0) {
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "Please select at least one row to export",
          title: "fill all detail",
        });

        setOption("");

        return;
      }

      exportData("csv", true);

      toggleAllRowsSelected(false);

      setOption("");
    } else if (event.target.value.toLowerCase() === "pdf") {
      if (selectedFlatRows.length === 0) {
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "Please select at least one row to export",
          title: "fill all detail",
        });

        setOption("");

        return;
      }

      exportData("pdf", true);

      toggleAllRowsSelected(false);

      setOption("");
    }
  }

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "csv") {
      // CSV example

      let headerNames;
      let selectedRows;

      let newHiddenColumns;
      if (state.hiddenColumns.length > 0) {
        newHiddenColumns = state.hiddenColumns.map((one) => {
          return one
            .replace(/_/gi, " ")
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        });

        headerNames = columns
          .map((col) => col.exportValue)
          .filter((one) => !newHiddenColumns.includes(one))
          .filter((one) => one !== "Image");

        selectedRows = selectedFlatRows
          .map((one) => {
            prepareRow(one);
            return one.cells.filter((two) => {
              return !newHiddenColumns.includes(two);
            });
          })
          .map((one) => {
            prepareRow(one);

            return one.map((one) => {
              if (one.column.Header === "Asset Tag") {
                one.value = one.value.props.to.state.name;
              }

              if (one.column.Header === "Image") {
                one.value = "Image";
              }
              return one.value;
            });
          })
          .map((one) => one.splice(2));

        for (let i in selectedRows) {
          for (let j in selectedRows[i]) {
            if (selectedRows[i][j] === "Image") {
              const index = selectedRows[i].indexOf("Image");

              selectedRows[i].splice(index, 1);
            }
          }
        }
      } else {
        headerNames = columns
          .map((col) => {
            return col.exportValue;
          })
          .filter((one) => one !== "Image");

        selectedRows = selectedFlatRows
          .map((one) => {
            prepareRow(one);

            return one.cells.map((one) => {
              if (one.column.Header === "Asset Tag") {
                one.value = one.value.props.to.state.name;
              }
              return one.value;
            });
          })
          .map((one) => one.splice(2));

        for (let i in selectedRows) {
          selectedRows[i].splice(1, 1);
        }
      }

      data = selectedRows;

      const csvString = Papa.unparse({ fields: headerNames, data });
      return new Blob([csvString], { type: "text/csv" });
    }

    //PDF example
    else if (fileType === "pdf") {
      let headerNames;
      let selectedRows;

      let newHiddenColumns;
      if (state.hiddenColumns.length > 0) {
        newHiddenColumns = state.hiddenColumns.map((one) => {
          return one
            .replace(/_/gi, " ")
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        });

        headerNames = columns
          .map((col) => col.exportValue)
          .filter((one) => !newHiddenColumns.includes(one))
          .filter((one) => one !== "Image");

        selectedRows = selectedFlatRows
          .map((one) => {
            prepareRow(one);
            return one.cells.filter((two) => {
              return !newHiddenColumns.includes(two);
            });
          })
          .map((one) => {
            prepareRow(one);

            return one.map((one) => {
              if (one.column.Header === "Asset Tag") {
                one.value = one.value.props.to.state.name;
              }

              if (one.column.Header === "Image") {
                one.value = "Image";
              }
              return one.value;
            });
          })
          .map((one) => one.splice(2));

        for (let i in selectedRows) {
          for (let j in selectedRows[i]) {
            if (selectedRows[i][j] === "Image") {
              const index = selectedRows[i].indexOf("Image");

              selectedRows[i].splice(index, 1);
            }
          }
        }
      } else {
        headerNames = columns
          .map((col) => {
            return col.exportValue;
          })
          .filter((one) => one !== "Image");

        selectedRows = selectedFlatRows
          .map((one) => {
            prepareRow(one);
            // console.log(one);
            return one.cells.map((one) => {
              if (one.column.Header === "Asset Tag") {
                one.value = one.value.props.to.state.name;
              }
              return one.value;
            });
          })
          .map((one) => one.splice(2));

        for (let i in selectedRows) {
          selectedRows[i].splice(1, 1);
        }
      }

      data = selectedRows;

      const unit = "pt";
      const size = "A1"; // Use A1, A2, A3 or A4
      const orientation = "portrait"; // portrait or landscape

      const doc = new jsPDF(orientation, unit, size);

      doc.text(130, 40, "Asset List");

      doc.autoTable({
        head: [headerNames],
        body: data,
        startY: 70,

        theme: "grid",
        tableWidth: "auto",
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

      doc.save(`${fileName}.pdf`);
    }
    // Other formats goes here
    return false;
  }

  // export function finish

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  function getDropDownOptionsFromRows(rows) {
    if (rows <= 50)
      return Array(Math.floor(rows / 10))
        .fill(undefined)
        .map((el, i) => (i + 1) * 10);
    return getDropDownOptionsFromRows(50).concat(
      Array(Math.floor(rows / 100))
        .fill(undefined)
        .map((el, i) => (i + 1) * 100)
    );
  }

  function handleChange(event) {
    setPersonName(event.target.value);
  }

  return (
    <>
      {subject === "main" && (
        <TableHeaderWrapper>
          <TableNavWrapper>
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              setGlobalFilter={setGlobalFilter}
              globalFilter={state.globalFilter}
            ></GlobalFilter>

            <TableNavRight>
              <AddAssetWrapper>
                <CreateAssetLink
                  to={{
                    pathname: "list-table/list-new-form",
                  }}
                  variant="contained"
                  color="secondary"
                  size="small"
                  style={{ minHeight: "35px" }}
                >
                  <Button
                    color="secondary"
                    style={{
                      background: "rgba(54, 153, 255, 0.75)",
                      padding: "7px 15px",
                      color: "#fff",
                      minHeight: "35px",
                    }}
                  >
                    Create Asset
                  </Button>
                </CreateAssetLink>
              </AddAssetWrapper>

              <TableOptionsWrapper>
                <FormControl style={{ width: "75px" }}>
                  <InputLabel id="demo-simple-select-label">
                    <GetAppIcon></GetAppIcon>
                  </InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={option}
                    onChange={handleOptionChange}
                    label="Option"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Excel">Excel</MenuItem>
                    <MenuItem value="PDF">PDF</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  className={classes.formControl}
                  style={{ maxWidth: "150px" }}
                >
                  <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>

                  <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={{
                      getContentAnchorEl: null,
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: "250px",
                        },
                      },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                    }}
                  >
                    {allColumns
                      .filter((column) => column.accessor)
                      .map((column) =>
                        column.Header === "Asset Id" ? (
                          undefined
                        ) : (
                          <InputLabel
                            style={{ cursor: "pointer" }}
                            key={column.Header}
                          >
                            <Checkbox
                              checked={personName.indexOf(column.Header) > -1}
                              {...column.getToggleHiddenProps()}
                            />
                            {column.Header}
                          </InputLabel>
                        )
                      )}
                  </Select>
                </FormControl>
              </TableOptionsWrapper>
            </TableNavRight>
          </TableNavWrapper>
        </TableHeaderWrapper>
      )}
      {!loading.finish ? (
        <LoadingStyle>
          <CircularProgress />
          <div>Loading ..</div>
        </LoadingStyle>
      ) : loading.success ? (
        <>
          <TableContainer component={Paper} style={{ height: "650px" }}>
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
                              ? "checkbox"
                              : "default"
                          }` +
                          `${
                            column.id === "checkbox" && column.sticky === "left"
                              ? " left-sticky-cell-c"
                              : ""
                          }` +
                          ` ${
                            column.sticky === "left"
                              ? " left-sticky-cell"
                              : column.sticky === "right"
                              ? " right-sticky-cell"
                              : ""
                          }` +
                          " th"
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
                                  cell.column.Header === "Asset Status" &&
                                  cell.row.original.chartColor
                                    ? cell.row.original.chartColor
                                    : ""
                                }`,
                                color: `${
                                  (cell.column.Header === "Expiry Date" &&
                                    cell.row.original.is_Asset_Expired ===
                                      true) ||
                                  (cell.column.Header === "Return Due On" &&
                                    cell.row.original.is_Asset_Returned ===
                                      true)
                                    ? "rgba(244, 67, 54, 1)"
                                    : "rgba(0, 0, 0, 0.87)"
                                }`,
                                fontWeight: `${
                                  cell.column.Header === "Asset Status" &&
                                  cell.row.original.chartColor
                                    ? 400
                                    : 400
                                }`,
                              },
                            },
                          ])}
                          className={
                            `${
                              cell.column.id === "checkbox" &&
                              cell.column.sticky === "left"
                                ? " left-sticky-cell-c"
                                : ""
                            }` +
                            `${
                              cell.column.sticky === "left"
                                ? " left-sticky-cell"
                                : cell.column.sticky === "right"
                                ? " right-sticky-cell"
                                : " default-cell"
                            }`
                          }
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
                    <MenuItem id={pageSize} value={pageSize} key={pageSize}>
                      Show {pageSize}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </PaginationStyles>
          )}
          <Snackbar
            autoHideDuration={2000}
            anchorOrigin={{ vertical, horizontal }}
            open={openSnackOpen}
            onClose={handleCloseSnack}
            key={vertical + horizontal}
          >
            <SnackbarContent
              aria-describedby="message-id2"
              style={{
                background: `${
                  title === "saved"
                    ? "#4caf50"
                    : title === "fill all detail"
                    ? "#ff9100"
                    : "#f44306"
                }`,
              }}
              message={
                <span id="message-id2">
                  <div>{message}</div>
                </span>
              }
            />
          </Snackbar>
        </>
      ) : (
        <ErrTableStyles>
          Seems like there is no data for this table
        </ErrTableStyles>
      )}
    </>
  );
}
