import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { appsetting } from "../../../envirment/appsetting";
import SupplierEdit from "./SupplierEdit";
import TablePagination from "@material-ui/core/TablePagination";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { EditableFormStyles } from "../../layout/components/custom/css/FormTableGrid_Styles";
import moment from "moment";
import { TokenContext } from "../../../app/BasePage";
import {
  SnackBarSave,
  SnackBarSaveError,
  SnackBarUpdate,
  SnackBarUpdateError,
  SnackBarDelete,
  SnackBarDeleteError,
} from "./SnackBar";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";
import { NoSupplierDataText } from "../Requested/RequestedIndex_Styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const Bottomarea = styled.div`
  width: 100%;
  /* margin: auto; */
`;
const Checkarea = styled.div`
  margin: 20px auto 0 auto;
  width: 90%;
  display: flex;
  justify-content: space-between;
`;
const Buttonarea = styled.div`
  margin-bottom: 40px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-top: 100px;

  div {
    margin-top: 7px;
  }
`;

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

const DeleteButton = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgba(244, 67, 54, 0.5) !important;
  transition: all 300ms;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: rgba(244, 67, 54, 0.8) !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  formContainer: {
    boxShadow: "0 0 50px 0 rgba(82,63,105,0.15) !important",
    marginBottom: "30px",
    flexGrow: 1,
    background: "#fff",
  },
  type: {
    paddingBottom: 20,
    width: "90%",
  },
  leftGrid: {
    display: "flex",
    flexDirection: "column",
  },
  RightGrid: {
    display: "flex",
    flexDirection: "column",
  },
  remark: {
    marginTop: 10,
    width: "90%",
  },
  savebtn: {
    height: "30px",
    color: "#fff",
    width: "20%",
  },
  cancelbtn: {
    marginLeft: "10px",
    height: "30px",
    width: "20%",
  },
  supplierId: {
    display: "none",
  },
  tablehead: {
    color: "rgba(0, 0, 0, 0.57)",
    padding: "25px",
    fontSize: "14px",
  },
}));

export default function SuppilerTable(props) {
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
  const [added, setAdded] = useState(false);
  const [helperNameText, SethelperNameText] = useState();
  const [NameError, setNameError] = useState(false);
  const [Postsuccess, Setpostsuccess] = useState(false);
  const [PostError, setposterror] = useState(false);
  const [DelSuccess, SetdelSuccess] = useState(false);
  const [DelError, SetdelError] = useState(false);
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [UpdateError, setUpdateError] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClear = () => {
    setOpen(false);
  };
  const [SelectDel, setSelectDel] = useState({});
  const [DelOpen, setDelOpen] = React.useState(false);

  const CheckDel = () => {
    setDelOpen(false);
  };
  const [CheckDelOpen, setCheckDelOpen] = React.useState(false);

  const CheckDelClose = () => {
    setCheckDelOpen(false);
  };

  const SupplierApi = `${server_path}api/supplier`;
  const [GetApi, setGetApi] = useState([
    {
      supplier_ID: 0,
      supplier_Name: "",
      supplier_Address: "",
      supplier_ContactNo: "",
      supplier_Email: "",
      supplier_Remark: "",
      active: true,
      create_By: 0,
      modified_By: 0,
      message: null,
    },
  ]);
  const [newData, setNewData] = useState({
    supplier_ID: 0,
    supplier_Name: "",
    supplier_Address: "",
    supplier_ContactNo: "",
    supplier_Email: "",
    supplier_Remark: "",
    active: true,
    created_By: parseInt(empID),
    modified_By: parseInt(empID),
  });

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
        description: "Supplier page",
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
    fetch(`${server_path}api/supplier`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setShowErrTable(true);
          setLoading(false);
          setGetApi(data);
          return;
        }
        setGetApi(data);
        setShowErrTable(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setShowErrTable(true);
      });
  }, [server_path, token, added]);

  const Apidata = {
    supplier_ID: newData.supplier_ID,
    supplier_Name: newData.supplier_Name,
    supplier_Address: newData.supplier_Address,
    supplier_ContactNo: newData.supplier_ContactNo,
    supplier_Email: newData.supplier_Email,
    supplier_Remark: newData.supplier_Remark,
    active: newData.active,
    created_By: parseInt(empID),
    modified_By: 0,
  };

  function handleActive() {
    setNewData((prevProps) => ({ ...prevProps, active: !prevProps.active }));
  }

  function handleonSubmit(e) {
    const checking = GetApi.filter(
      (item) => item.supplier_Name === newData.supplier_Name
    );

    e.preventDefault();

    if (newData.supplier_Name === "") {
      setNameError(true);
      SethelperNameText("*Supplier name cannot be empty");
    } else {
      setNameError(false);
      if (checking.length > 0) {
        setOpen(true);
      } else {
        fetch(`${server_path}api/supplier`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(Apidata),
        }).then((res) => {
          if (res.status === 200) {
            const AuditData = {
              activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
              action_By: parseInt(empID),
              event: "Entry",
              asset_Detail_ID: "0",
              asset_ID: 0,
              assetLocation_ID: 0,
              description: "",
              assetObject: [],
              categoryObjects: null,
              brandObject: null,
              supplierObject: {
                supplierName: newData.supplier_Name,
                address: newData.supplier_Address,
                contactNo: newData.supplier_ContactNo,
                email: newData.supplier_Email,
                remark: newData.supplier_Remark,
                active: `${newData.active}`,
              },
              typeObject: null,
              statusObject: null,
              locationObject: null,
              allocationObject: [],
              requestObject: null,
            };
            fetch(`${server_path}api/AuditTrial`, {
              method: "POST",

              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(AuditData),
            });

            setAdded(!added);
            Setpostsuccess(true);
            setGetApi([...GetApi, newData]);
            setNewData({
              supplier_Name: "",
              supplier_Address: "",
              supplier_ContactNo: "",
              supplier_Email: "",
              supplier_Remark: "",
              active: true,
            });
            setposterror(false);
            SethelperNameText("");
          } else {
            setposterror(true);
          }
        });
      }
    }
  }
  function handleOnClear() {
    setNewData({
      supplier_Name: "",
      supplier_Address: "",
      supplier_ContactNo: "",
      supplier_Email: "",
      supplier_Remark: "",
      active: true,
    });
    setNameError(false);
    SethelperNameText("");
  }

  const [updatedata, Setupdatedata] = useState();
  const EditRow = GetApi.find((data) => data.supplier_ID === updatedata);
  const [SelectedId, SetSelectedId] = useState(null);

  function HandleDelete(data) {
    let DeleteAuditData;
    fetch(`${server_path}api/supplier/${data.ID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        DeleteAuditData = {
          activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
          action_By: parseInt(empID),
          event: "Delete",
          asset_Detail_ID: "0",
          asset_ID: 0,
          assetLocation_ID: 0,
          description: "",
          assetObject: [],
          categoryObjects: null,
          brandObject: null,
          supplierObject: {
            supplierName: data.name,
            address: "",
            contactNo: "",
            email: "",
            remark: "",
            active: "",
          },
          typeObject: null,
          statusObject: null,
          locationObject: null,
          allocationObject: [],
          requestObject: null,
        };
        fetch(`${server_path}api/AuditTrial`, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(DeleteAuditData),
        });
        const array = [...GetApi];
        array.splice(data.index, 1);
        setGetApi(array);
        SetdelSuccess(true);
        setDelOpen(false);
        SetdelError(false);
      } else {
        SetdelError(true);
      }
    });
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" className={classes.formContainer}>
        <EditableFormStyles>
          <Grid container spacing={2}>
            {/* <form className={classes.root} noValidate autoComplete="off"> */}
            <Grid item xs={12} sm={6} className={classes.leftGrid}>
              <TextField
                id="Supplier Name"
                label="Supplier Name*"
                helperText={helperNameText}
                error={NameError}
                className={classes.type}
                value={newData.supplier_Name}
                onChange={(e) => {
                  setNewData({
                    ...newData,
                    supplier_Name: e.target.value,
                  });
                  setNameError(false);
                  SethelperNameText("");
                }}
              />
              <TextField
                id="Email"
                label="Email"
                type="email"
                className={classes.type}
                value={newData.supplier_Email}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    supplier_Email: e.target.value,
                  })
                }
              />
              <TextField
                id="Contact No"
                label="Contact No"
                className={classes.type}
                value={newData.supplier_ContactNo}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    supplier_ContactNo: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.RightGrid}>
              <TextField
                multiline
                rowsMax={4}
                id="Address"
                label="Address"
                className={classes.type}
                value={newData.supplier_Address}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    supplier_Address: e.target.value,
                  })
                }
              />

              <TextField
                multiline
                rows={4}
                variant="outlined"
                id="outlined-multiline-static"
                label="Remark"
                className={classes.remark}
                value={newData.supplier_Remark}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    supplier_Remark: e.target.value,
                  })
                }
              />
            </Grid>
            <Bottomarea>
              <Checkarea>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newData.active}
                      onChange={handleActive}
                      color="secondary"
                      style={{
                        float: "left",
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="Active"
                  labelPlacement="end"
                />
              </Checkarea>
              <Buttonarea>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.savebtn}
                  onClick={handleonSubmit}
                >
                  Save
                </Button>
                <Button
                  color="secondary"
                  className={classes.cancelbtn}
                  onClick={handleOnClear}
                  style={{ minWidth: "80px" }}
                >
                  Cancel
                </Button>
              </Buttonarea>
            </Bottomarea>
            {/* </form> */}
          </Grid>
        </EditableFormStyles>
        <Dialog
          open={open}
          onClose={handleClear}
          style={{
            marginLeft: 250,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              There is a duplicate record for this supplier name. Please check
              and try again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClear} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={DelOpen}
          onClose={CheckDel}
          style={{
            marginLeft: 250,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you wish to remove this record?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => HandleDelete(SelectDel)}
              color="primary"
              autoFocus
            >
              Yes
            </Button>

            <Button onClick={CheckDel} color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={CheckDelOpen}
          onClose={CheckDelClose}
          style={{
            marginLeft: 250,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This supplier is in used. You cannot remove this supplier.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={CheckDelClose} color="primary" autoFocus>
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Container maxWidth="xl">
        {loading ? (
          <LoadingStyle>
            <CircularProgress />
            <div>Loading ..</div>
          </LoadingStyle>
        ) : showErrTable ? (
          <NoSupplierDataText>
            There is no information to display
          </NoSupplierDataText>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    className={classes.tablehead}
                    style={{
                      width: "16%",
                    }}
                  >
                    Supplier Name
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Address
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Contact No
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Email
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Remark
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Active
                  </TableCell>
                  <TableCell
                    align="center"
                    className={classes.tablehead}
                    style={{
                      width: "16%",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {GetApi.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ).map((row, index) =>
                  row.supplier_ID === SelectedId ? (
                    <SupplierEdit
                      key={row.supplier_ID}
                      EditRow={EditRow}
                      GetApi={GetApi}
                      setGetApi={setGetApi}
                      SupplierApi={SupplierApi}
                      setUpdateSuccess={setUpdateSuccess}
                      setUpdateError={setUpdateError}
                      SelectedId={SelectedId}
                      SetSelectedId={SetSelectedId}
                    />
                  ) : (
                    <TableRow key={row.supplier_ID}>
                      <TableCell align="center" className={classes.supplierId}>
                        {Number(row.supplier_ID)}
                      </TableCell>
                      <TableCell align="center">{row.supplier_Name}</TableCell>
                      <TableCell align="center">
                        {row.supplier_Address}
                      </TableCell>
                      <TableCell align="center">
                        {row.supplier_ContactNo}
                      </TableCell>
                      <TableCell align="center">{row.supplier_Email}</TableCell>
                      {row.supplier_Remark.length > 20 ? (
                        <TableCell align="center">
                          {row.supplier_Remark.substr(0, 20) + "..."}
                        </TableCell>
                      ) : (
                        <TableCell align="center">
                          {row.supplier_Remark}
                        </TableCell>
                      )}

                      <TableCell align="center">
                        <Checkbox
                          checked={row.active}
                          color="secondary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>

                      <TableCell
                        align="center"
                        style={{
                          minWidth: "120px",
                        }}
                      >
                        <span
                          style={{
                            cursor: "pointer",
                            color: "#353535",
                            textDecoration: "underline",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            if (
                              row.eMessage ===
                              "Supplier Name already used in Asset Form."
                            ) {
                              setCheckDelOpen(true);
                            } else {
                              setDelOpen(true);
                            }

                            setSelectDel({
                              ID: row.supplier_ID,
                              index: index,
                              name: row.supplier_Name,
                            });
                          }}
                        >
                          <Tooltip title="Delete Row">
                            <DeleteButton aria-label="delete">
                              <DeleteIcon fontSize="small" />
                            </DeleteButton>
                          </Tooltip>
                        </span>
                        <span
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            Setupdatedata(row.supplier_ID);
                            SetSelectedId(row.supplier_ID);
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
            component="div"
            count={GetApi.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10]}
          />
        )}
        {Postsuccess ? (
          <SnackBarSave
            Postsuccess={Postsuccess}
            Setpostsuccess={Setpostsuccess}
          ></SnackBarSave>
        ) : (
          ""
        )}
        {PostError ? (
          <SnackBarSaveError
            PostError={PostError}
            setposterror={setposterror}
          ></SnackBarSaveError>
        ) : (
          ""
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

        {DelSuccess ? (
          <SnackBarDelete
            DelSuccess={DelSuccess}
            SetdelSuccess={SetdelSuccess}
          ></SnackBarDelete>
        ) : (
          ""
        )}
        {DelError ? (
          <SnackBarDeleteError
            DelError={DelError}
            SetdelError={SetdelError}
          ></SnackBarDeleteError>
        ) : (
          ""
        )}
      </Container>
    </React.Fragment>
  );
}
