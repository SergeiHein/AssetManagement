import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import CreateIcon from "@material-ui/icons/Create";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import TextField from "@material-ui/core/TextField";
import BrandEdit from "./BrandEdit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { appsetting } from "../../../envirment/appsetting";
import TablePagination from "@material-ui/core/TablePagination";
import { TokenContext } from "../../../app/BasePage";
import { EditableFormStyles } from "../../layout/components/custom/css/FormTableGrid_Styles";
import {
  SnackBarSave,
  SnackBarSaveError,
  SnackBarUpdate,
  SnackBarUpdateError,
  SnackBarDelete,
  SnackBarDeleteError,
} from "./SnackBar";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";
import moment from "moment";

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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  brandId: {
    display: "none",
  },
  tablehead: {
    color: "rgba(0, 0, 0, 0.57)",
    padding: "25px",
    fontSize: "14px",
  },
});
export default function BrandTable(props) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [AddData, SetAddData] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const BrandApi = `${server_path}api/brand`;

  const [GetApi, setGetApi] = useState([]);

  const [newData, setNewData] = useState({
    brand_ID: 0,
    brand_Name: "",
    description: "",
    active: true,
    created_By: parseInt(empID),
    modified_By: parseInt(empID),
  });
  const [newAdded, setNewAdded] = useState(false);

  useEffect(() => {
    fetch(`${server_path}api/brand`, {
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
  }, [server_path, newAdded, token]);

  const [helperNameText, SethelperNameText] = useState();
  const [NameError, setNameError] = useState(false);

  const [Postsuccess, Setpostsuccess] = useState(false);
  const [PostError, setposterror] = useState(false);
  const [DelSuccess, SetdelSuccess] = useState(false);
  const [DelError, SetdelError] = useState(false);
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [UpdateError, setUpdateError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showErrTable, setShowErrTable] = useState(false);
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

  const Apidata = {
    brand_ID: newData.brand_ID,
    brand_Name: newData.brand_Name,
    description: newData.description,
    active: newData.active,
    created_By: parseInt(empID),
    modified_By: 0,
  };

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
        description: "Brand page",
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

  function handleChange() {
    setNewData((prevProps) => ({ ...prevProps, active: !prevProps.active }));
  }

  function AddHandler() {
    SetAddData(true);
  }
  function handleonSubmit(e) {
    const checking = GetApi.filter(
      (item) => item.brand_Name === newData.brand_Name
    );
    e.preventDefault();
    if (newData.brand_Name === "") {
      setNameError(true);
      SethelperNameText("*Brand name cannot be empty");
    } else {
      setNameError(false);
      SethelperNameText("");

      if (checking.length > 0) {
        setOpen(true);
      } else {
        fetch(`${server_path}api/brand`, {
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
              brandObject: {
                brandName: newData.brand_Name,
                description: newData.description,
                active: `${newData.active}`,
              },
              supplierObject: null,
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

            setNewAdded(!newAdded);
            setGetApi([...GetApi, newData]);
            setNewData({
              brand_ID: 0,
              brand_Name: "",
              description: "",
              active: true,
            });
            SetAddData(false);
            Setpostsuccess(true);
          } else {
            setposterror(true);
          }
        });
      }
    }
  }

  const [updatedata, Setupdatedata] = useState();
  const [SelectedId, SetSelectedId] = useState(null);
  const EditRow = GetApi.find((data) => data.brand_ID === updatedata);

  function HandleDelete(data) {
    let DeleteAuditData;
    fetch(`${server_path}api/brand/${data.ID}`, {
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
          brandObject: {
            brandName: data.name,
            description: "",
            active: "",
          },
          supplierObject: null,
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
      <Container maxWidth="md">
        <Button
          variant="contained"
          color="secondary"
          style={{
            float: "right",
            marginBottom: "20px",
            color: "#fff",
          }}
          className={classes.btn}
          onClick={AddHandler}
        >
          Add new
        </Button>
        {/* {loading ? (
          <LoadingStyle>
            <CircularProgress />
            <div>Loading ..</div>
          </LoadingStyle>
        ) : showErrTable ? (
          <NoRequestedTableText>
            There is no information to display
          </NoRequestedTableText>
        ) : ( */}
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" className={classes.tablehead}>
                  Brand Name
                </TableCell>
                <TableCell align="center" className={classes.tablehead}>
                  Description
                </TableCell>
                <TableCell align="center" className={classes.tablehead}>
                  Active
                </TableCell>
                <TableCell align="center" className={classes.tablehead}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {AddData && (
                <TableRow className={classes.formControl}>
                  <TableCell align="center">
                    <EditableFormStyles>
                      <TextField
                        id="Brand Name"
                        className={classes.input}
                        value={newData.brand_Name}
                        error={NameError}
                        helperText={helperNameText}
                        onChange={(e) => {
                          setNewData({
                            ...newData,
                            brand_Name: e.target.value,
                          });
                          setNameError(false);
                          SethelperNameText("");
                        }}
                      />
                    </EditableFormStyles>
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      id="Description"
                      className={classes.input}
                      value={newData.description}
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          description: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={newData.active}
                      onChange={handleChange}
                      color="secondary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      className={classes.Donebtn}
                      color="primary"
                      type="submit"
                      size="small"
                      onClick={handleonSubmit}
                    >
                      <DoneIcon />
                    </Button>
                    <Button
                      className={classes.Clearbtn}
                      color="secondary"
                      size="small"
                      onClick={() => {
                        SetAddData(!AddData);
                        setNameError(false);
                        SethelperNameText("");
                        setNewData({
                          brand_ID: 0,
                          brand_Name: "",
                          description: "",
                          active: true,
                        });
                      }}
                    >
                      <ClearIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              )}

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
                    There is a duplicate record for this Brand Name. Please
                    check and try again.
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
                    This brand is in used. You cannot remove this brand.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={CheckDelClose} color="primary" autoFocus>
                    Okay
                  </Button>
                </DialogActions>
              </Dialog>

              {GetApi.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).map((row, index) =>
                row.brand_ID === SelectedId ? (
                  <BrandEdit
                    key={row.brand_ID}
                    EditRow={EditRow}
                    GetApi={GetApi}
                    setGetApi={setGetApi}
                    BrandApi={BrandApi}
                    handleChange={handleChange}
                    setUpdateSuccess={setUpdateSuccess}
                    setUpdateError={setUpdateError}
                    Apidata={Apidata}
                    SelectedId={SelectedId}
                    SetSelectedId={SetSelectedId}
                  />
                ) : (
                  <TableRow key={row.brand_ID}>
                    <TableCell align="center" className={classes.brandId}>
                      {Number(row.brand_ID)}
                    </TableCell>
                    <TableCell align="center">{row.brand_Name}</TableCell>
                    {row.description.length > 30 ? (
                      <TableCell align="center">
                        {row.description.substr(0, 30) + "..."}
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
                          color: "#353535",
                          textDecoration: "underline",
                          marginRight: "10px",
                        }}
                        onClick={() => {
                          if (
                            row.eMessage ===
                            "Brand Name already used in Asset Form."
                          ) {
                            setCheckDelOpen(true);
                          } else {
                            setDelOpen(true);
                          }

                          setSelectDel({
                            ID: row.brand_ID,
                            index: index,
                            name: row.brand_Name,
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
                          Setupdatedata(row.brand_ID);
                          SetSelectedId(row.brand_ID);
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
        {/* )} */}
        {loading || showErrTable ? null : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={GetApi.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
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
