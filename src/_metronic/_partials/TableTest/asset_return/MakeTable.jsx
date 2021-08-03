import React, { useState, useEffect, useMemo } from "react";
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
import GetAppIcon from "@material-ui/icons/GetApp";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import GlobalFilter from "../../../layout/components/custom/GlobalFilter";
import CircularProgress from "@material-ui/core/CircularProgress";

import {
  TableStyles,
  useStyles,
  TableHeadSpan,
} from "../../../layout/components/custom/css/MakeTable_Styles";

import IconButton from "@material-ui/core/IconButton";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import styled from "styled-components";
import { useExportData } from "react-table-plugins";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

export const AddAssetWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TableOptionsWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const TableNavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TableNavRight = styled.div`
  display: flex;
  margin-bottom: 15px;
  flex-direction: row;

  justify-content: space-between;
  align-items: flex-end;
  max-width: 500px;
  width: 400px;
`;

export const TableHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background: #fff;
  border-radius: 3px;
  box-shadow: rgba(82, 63, 105, 0.15) 0px 0px 50px 0px;
  margin: 25px auto;
  padding: 25px;
  height: 135px;

  @media (max-width: 1024px) {
    height: 180px;
  }
`;

const BottomArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
`;

const BottomWrapper = styled.div`
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  margin: 25px 0 0 auto;
  background: white;
  height: 70px;
`;

const PaginationStyles = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

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
    state,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    exportData,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    pageOptions,
    allColumns,
    selectedFlatRows,
    toggleAllRowsSelected,
    state: { pageIndex, pageSize },
  } = useMemo(() => instanceTable, [instanceTable]);

  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });

  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

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

  const [personName, setPersonName] = useState([]);
  const [option, setOption] = React.useState("");

  function handleChange(event) {
    setPersonName(event.target.value);
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

      exportData("xlsx", true);

      toggleAllRowsSelected(false);

      setOption("");
    }
    if (event.target.value.toLowerCase() === "pdf") {
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

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    if (fileType === "xlsx") {
      const header = columns.map((c) => c.exportValue);
      const selectedData = selectedFlatRows
        .map((one) => {
          prepareRow(one);
          return one.cells.map((one) => {
            if (one.column.Header === "Asset Tag") {
              one.value = one.row.values.asset_Tag;
            }
            return one.value;
          });
        })
        .map((one) => one.splice(2));
      const compatibleData = selectedData.map((row) => {
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
      XLSX.utils.book_append_sheet(wb, ws1, "Asset Return/Transfer Data");
      XLSX.writeFile(wb, `${fileName}.xlsx`);
      // Returning false as downloading of file is already taken care of
      // setExportOption("");
      return false;
    }

    // PDF example
    else if (fileType === "pdf") {
      let selectedPdf;
      selectedPdf = selectedFlatRows
        .map((one) => {
          prepareRow(one);
          return one.cells.map((one) => {
            if (one.column.Header === "Asset Tag") {
              one.value = one.row.values.asset_Tag;
            }
            return one.value;
          });
        })
        .map((one) => one.splice(2));
      var pdfsize = "a4";
      const headerNames = columns.map((column) => column.exportValue);
      const doc = new jsPDF("l", "pt", pdfsize);

      let wantedTableWidth = 595;
      let pageWidth = doc.internal.pageSize.width;
      let margin = (pageWidth - wantedTableWidth) / 2;

      doc.text(130, 40, "Asset Return/Transfer");
      doc.autoTable({
        head: [headerNames],
        body: selectedPdf,
        startY: 70,
        margin: { left: margin, right: margin },
        theme: "grid",
        tableWidth: "auto",
        showHead: "everyPage",
        tableLineColor: 200,

        tableLineWidth: 0,
        columnStyles: {
          0: { cellWidth: 120 },
          3: { cellWidth: 120 },
        },
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

  return (
    <>
      <TableHeaderWrapper>
        <TableNavWrapper>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={state.globalFilter}
          ></GlobalFilter>

          <TableNavRight>
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
      {!loading.finish ? (
        <LoadingStyle>
          <CircularProgress />
          <div>Loading ..</div>
        </LoadingStyle>
      ) : loading.success ? (
        <>
          <TableContainer
            component={Paper}
            style={{ overflowY: "hidden", height: "auto" }}
          >
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
                        className={classes.tablecell}
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
                                width: `${(cell.column.Header ===
                                  "Asset Name" ||
                                  cell.column.Header === "Location") &&
                                  "20%"}`,
                              },
                            },
                          ])}
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
            <BottomWrapper>
              <BottomArea>
                {/* <IssueBtn
                  variant="contained"
                  onClick={handleOnIssue}
                  color="secondary"
                >
                  Issue
                </IssueBtn> */}
                <PaginationStyles bottom>
                  {" "}
                  <IconButton
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    <NavigateBeforeIcon></NavigateBeforeIcon>
                  </IconButton>{" "}
                  <IconButton
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
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
                      {getDropDownOptionsFromRows(data.length).map(
                        (pageSize) => (
                          <MenuItem
                            id={pageSize}
                            value={pageSize}
                            key={pageSize}
                          >
                            Show {pageSize}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </PaginationStyles>
              </BottomArea>
            </BottomWrapper>
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
