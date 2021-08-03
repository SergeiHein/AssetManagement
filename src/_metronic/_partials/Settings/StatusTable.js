import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditTable from "./EditTable";
import CreateIcon from "@material-ui/icons/Create";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import TablePagination from "@material-ui/core/TablePagination";
import { SnackBarUpdate, SnackBarUpdateError } from "./SnackBar";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";
import moment from "moment";
import { NoRequestedTableText } from "../Requested/RequestedIndex_Styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  tableContainer: {
    boxShadow: "0 0 50px 0 rgba(82,63,105,0.15) !important",
  },

  Donebtn: {
    minWidth: 20,
    marginRight: 10,
  },
  Clearbtn: {
    minWidth: 20,
    marginLeft: 10,
  },

  DelIcon: {
    width: 18,
    background: "",
  },
  EditIcon: {
    width: 18,
  },
  btn: {
    float: "right",
    marginBottom: "20px",
  },

  input: {
    width: "60%",
  },
  statusId: {
    display: "none",
  },
  tablehead: {
    color: "rgba(0, 0, 0, 0.57)",
    padding: "25px",
    fontSize: "14px",
  },
});

const EditButton = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgba(54, 153, 255, 0.5) !important;
  transition: all 300ms;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: rgba(54, 153, 255, 0.8) !important;
  }
`;
const LoadingStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-top: 250px;

  div {
    margin-top: 7px;
  }
`;

export default function StatusTable(props) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  const [loading, setLoading] = useState(true);
  const [showErrTable, setShowErrTable] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [EditData, SetEditdata] = useState(false);
  const [SelectedId, SetSelectedId] = useState(null);
  const GetApi = ` ${server_path}api/status`;
  const [StatusApi, SetstatusApi] = useState([
    {
      status_ID: 0,
      status_Name: "",
      created_By: 1,
      modified_By: 0,
      statusType_ID: 1,
      asset: "",
      chartColour_Code: "",
      note: "",
      message: null,
    },
  ]);

  const [StatusTypeApi, SetstatusTypeApi] = useState([]);

  const [updatedata, Setupdatedata] = useState();
  const EditRow = StatusApi.find((data) => data.status_ID === updatedata);

  useEffect(() => {
    if (props.location.state) {
      let auditObj = {
        action_By: parseInt(empID),
        event: "View",
        asset_Detail_ID: "0",
        asset_Location_ID: 0,
        asset_ID: 0,
        activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
        assetObject: [],
        categoryObjects: null,
        brandObject: null,
        supplierObject: null,
        typeObject: null,
        statusObject: null,
        locationObject: null,
        allocationObject: [],
        description: "Status page",
        requestObject: null,
      };

      fetch(`${server_path}api/AuditTrial`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auditObj),
      });
    }
  }, [empID, server_path, token, props.location.state]);

  useEffect(() => {
    fetch(`${server_path}api/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setShowErrTable(true);
          setLoading(false);
          SetstatusApi(data);
          return;
        }
        SetstatusApi(data);
        setShowErrTable(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setShowErrTable(true);
      });
  }, [server_path, token]);

  useEffect(() => {
    fetch(`${server_path}api/statusType`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => SetstatusTypeApi(data));
  }, [server_path, token]);

  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [UpdateError, setUpdateError] = useState(false);

  const typeArray = StatusTypeApi.filter((val) => {
    return StatusApi.some((item) => {
      return item.statusType_ID === val.statusType_ID;
    });
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.container}>
        {loading ? (
          <LoadingStyle>
            <CircularProgress />
            <div>Loading ..</div>
          </LoadingStyle>
        ) : showErrTable ? (
          <NoRequestedTableText>
            There is no information to display
          </NoRequestedTableText>
        ) : (
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={classes.tablehead}>
                    Status Name
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Status Type
                  </TableCell>

                  <TableCell align="center" className={classes.tablehead}>
                    Chart Colour
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Note
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {StatusApi.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ).map((row) =>
                  row.status_ID === SelectedId ? (
                    <EditTable
                      key={row.status_ID}
                      EditRow={EditRow}
                      EditData={EditData}
                      SetEditdata={SetEditdata}
                      SetstatusApi={SetstatusApi}
                      StatusApi={StatusApi}
                      StatusTypeApi={StatusTypeApi}
                      GetApi={GetApi}
                      SetSelectedId={SetSelectedId}
                      setUpdateSuccess={setUpdateSuccess}
                      setUpdateError={setUpdateError}
                    />
                  ) : (
                    <TableRow className={classes.Rowheader} key={row.status_ID}>
                      <TableCell align="center" className={classes.statusId}>
                        {Number(row.status_ID)}
                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {row.status_Name}
                      </TableCell>
                      {typeArray.length === 0 ? (
                        <TableCell align="center"></TableCell>
                      ) : (
                        typeArray.map(
                          (subrow) =>
                            subrow.statusType_ID === row.statusType_ID && (
                              <TableCell
                                key={subrow.statusType_ID}
                                align="center"
                              >
                                {subrow.statusType_Name}
                              </TableCell>
                            )
                        )
                      )}
                      {/* {StatusTypeApi.forEach((subrow) =>
                          subrow.statusType_ID === row.statusType_ID ? (
                            <TableCell
                              align="center"
                              key={subrow.statusType_ID}
                            >
                              {subrow.statusType_Name}
                            </TableCell>
                          ) : (
                            <TableCell
                              align="center"
                              key={subrow.statusType_ID}
                            >
                              ..
                            </TableCell>
                          )
                        )} */}

                      <TableCell align="center">
                        <div
                          style={{
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: `${row.chartColour_Code}`,
                              width: "15px",
                              marginRight: "7px",
                            }}
                          ></div>
                          {row.chartColour_Code}
                        </div>
                      </TableCell>
                      <TableCell align="center">{row.note}</TableCell>
                      <TableCell
                        align="center"
                        style={{
                          minWidth: "120px",
                        }}
                      >
                        <span
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            Setupdatedata(row.status_ID);
                            SetSelectedId(row.status_ID);
                          }}
                        >
                          <Tooltip title="Edit Row">
                            <EditButton aria-label="Edit">
                              <CreateIcon fontSize="small" />
                            </EditButton>
                          </Tooltip>
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {loading || showErrTable ? null : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={StatusApi.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
        {UpdateSuccess ? (
          <SnackBarUpdate
            UpdateSuccess={UpdateSuccess}
            setUpdateSuccess={setUpdateSuccess}
          ></SnackBarUpdate>
        ) : (
          ""
        )}
        {UpdateError ? (
          <SnackBarUpdateError
            UpdateError={UpdateError}
            setUpdateError={setUpdateError}
          ></SnackBarUpdateError>
        ) : (
          ""
        )}
      </Container>
    </React.Fragment>
  );
}
