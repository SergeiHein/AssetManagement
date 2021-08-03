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
import CreateIcon from "@material-ui/icons/Create";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import TypeEdit from "./TypeEdit";
import { appsetting } from "../../../envirment/appsetting";
import MuiAlert from "@material-ui/lab/Alert";
import { TokenContext } from "../../../app/BasePage";
import { SnackBarUpdate, SnackBarUpdateError } from "./SnackBar";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";
import moment from "moment";
import { NoRequestedTableText } from "../Requested/RequestedIndex_Styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  typeId: {
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

export default function TestTable(props) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  const [loading, setLoading] = useState(true);
  const [showErrTable, setShowErrTable] = useState(false);

  const Api = `${server_path}api/assetType`;

  const [TypeApi, SetTypeApi] = useState([
    {
      type_ID: "",
      type_Name: "",
      description: "",
      active: true,
      created_By: parseInt(empID),
      modified_By: parseInt(empID),
    },
  ]);
  // const [open, setOpen] = React.useState(false);
  const [updatedata, Setupdatedata] = useState();
  const EditRow = TypeApi.find((data) => data.type_ID === updatedata);

  const [SelectedId, SetSelectedId] = useState(null);

  function Alert(props) {
    return <MuiAlert elevation={2} variant="filled" {...props} />;
  }
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [UpdateError, setUpdateError] = useState(false);

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
        description: "Type page",
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
    fetch(`${server_path}api/AssetType`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setShowErrTable(true);
          setLoading(false);
          SetTypeApi(data);
          return;
        }
        SetTypeApi(data);
        setShowErrTable(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setShowErrTable(true);
      });
  }, [server_path, token]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md" className={classes.container}>
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
                  <TableCell
                    align="center"
                    className={classes.tablehead}
                    style={{
                      width: "15%",
                    }}
                  >
                    Type
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Description
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classes.tablehead}
                    style={{
                      width: "15%",
                    }}
                  >
                    Active
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classes.tablehead}
                    style={{
                      width: "20%",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {TypeApi.map((row) =>
                  row.type_ID === SelectedId ? (
                    <TypeEdit
                      key={row.type_ID}
                      EditRow={EditRow}
                      TypeApi={TypeApi}
                      SetTypeApi={SetTypeApi}
                      Api={Api}
                      SelectedId={SelectedId}
                      SetSelectedId={SetSelectedId}
                      setUpdateSuccess={setUpdateSuccess}
                      setUpdateError={setUpdateError}
                    ></TypeEdit>
                  ) : (
                    <TableRow className={classes.Rowheader} key={row.type_ID}>
                      <TableCell align="center" className={classes.typeId}>
                        {row.type_ID}
                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {row.type_Name}
                      </TableCell>
                      {row.description.length > 30 ? (
                        <TableCell align="center">
                          <Tooltip title={row.description}>
                            <span
                              style={{
                                fontWeight: "normal",
                                cursor: "pointer",
                              }}
                            >
                              {row.description?.substr(0, 30) + "..."}
                            </span>
                          </Tooltip>{" "}
                        </TableCell>
                      ) : (
                        <TableCell align="center">{row.description}</TableCell>
                      )}
                      <TableCell align="center">
                        <Checkbox
                          checked={row.active}
                          color="secondary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <span
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            Setupdatedata(row.type_ID);
                            SetSelectedId(row.type_ID);
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

                {/* )
              )} */}
              </TableBody>
            </Table>
          </TableContainer>
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
      {/* <button>Click</button> */}
    </React.Fragment>
  );
}
