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
import LocationEdit from "./LocationEdit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import TablePagination from "@material-ui/core/TablePagination";
import AddBoxIcon from "@material-ui/icons/AddBox";
import AddNewPopUp from "./AddNewPopUp";
import AddChildPopUp from "./AddChildPopUp";
import {
  SnackBarSave,
  SnackBarSaveError,
  SnackBarUpdate,
  SnackBarUpdateError,
  SnackBarDelete,
  SnackBarDeleteError,
} from "../SnackBar";
import moment from "moment";

import { NoLocationDataTable } from "../../Requested/RequestedIndex_Styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { oneOf } from "prop-types";

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

const AddButton = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgb(128, 128, 128) !important;
  transition: all 300ms;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: rgb(169, 169, 169) !important;
  }
`;

const DisableButton = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgba(128, 128, 128, 0.3) !important;
  transition: all 300ms;

  svg {
    color: #fff;
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
  locationId: {
    display: "none",
  },
});
// function Alert(props) {
//   return <MuiAlert elevation={2} variant="filled" {...props} />;
// }

export default function LocationTable(props) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const [AddData, SetAddData] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [loading, setLoading] = useState(true);
  const [showErrTable, setShowErrTable] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [Added, setAdded] = useState(false);
  const [treeViewData, setTreeViewData] = useState([]);

  const LocationApi = `${server_path}api/assetlocation/GetAllAssetLocation`;

  const [GetApi, setGetApi] = useState([
    {
      asset_Location_ID: 0,
      asset_Location_Name: "",
      asset_Location_Description: "",
      parent_ID: 0,
      location_Type: "",
      hrLocation_ID: "",
      tag_Prefix: "",
      created_By: 0,
      modified_By: 0,
      active: true,
      eMessage: null,
      message: null,
    },
  ]);

  const [newData, setNewData] = useState({
    asset_Location_ID: 0,
    asset_Location_Name: "",
    asset_Location_Description: "",
    parent_ID: 0,
    location_Type: "",
    hrLocation_ID: 0,
    tag_Prefix: "",
    created_By: 0,
    modified_By: 0,
    active: true,
  });

  useEffect(() => {
    const urls = [
      `${server_path}api/assetlocation/GetAllAssetLocation`,
      `${server_path}api/assetlocation/LocationTreeView`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(requests)
      .then((res) => Promise.all(res.map((req) => req.json())))
      .then((arr) => {
        if (!arr[0] || arr[0].length === 0) {
          setShowErrTable(true);
          setLoading(false);
          setGetApi(arr[0]);
          return;
        }

        var props = ["Group_List"];

        const get_Group_List = arr[1]
          .filter(function(o1) {
            return arr[0].some(function(o2) {
              return o1.AssetLocation_ID === o2.asset_Location_ID;
            });
          })
          .map(function(o) {
            return props.reduce(function(newo, name) {
              newo[name] = o[name];
              return newo;
            }, {});
          });

        arr[0].forEach(
          (v, i) => (v["Group_List"] = get_Group_List[i].Group_List)
        );

        setGetApi(arr[0]);
        setShowErrTable(false);
        setLoading(false);
        setTreeViewData(arr[1]);
      })
      .catch((err) => {
        setLoading(false);
        setShowErrTable(true);
      });
  }, [server_path, token, Added]);

  console.log(GetApi);

  function handleChange() {
    setNewData((prevProps) => ({ ...prevProps, active: !prevProps.active }));
  }

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

  const Apidata = {
    asset_Location_ID: newData.asset_Location_ID,
    asset_Location_Name: newData.asset_Location_Name,
    asset_Location_Description: newData.asset_Location_Description,
    parent_ID: newData.parent_ID,
    location_Type: newData.location_Type,
    hrLocation_ID: newData.hrLocation_ID,
    tag_Prefix: newData.tag_Prefix,
    active: newData.active,
  };

  function AddHandler() {
    SetAddData(true);
  }

  const [updatedata, Setupdatedata] = useState();
  const [SelectedId, SetSelectedId] = useState(null);
  const [PopUpId, setPopUpId] = useState(null);
  const [PopUp, setPopUp] = useState(false);
  const EditRow = GetApi.find((data) => {
    if (data.asset_Location_ID === updatedata) {
      // delete data.Parent_Location;
      return data;
    }
    return null;
  });

  const [SelectDel, setSelectDel] = useState({});
  const [DelOpen, setDelOpen] = React.useState(false);

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
        description: "Asset Location page",
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

  const CheckDel = () => {
    setDelOpen(false);
  };

  const [CheckDelOpen, setCheckDelOpen] = React.useState(false);

  const CheckDelClose = () => {
    setCheckDelOpen(false);
  };

  function HandleDelete(data) {
    let DeleteAuditData;
    const selectedRow = GetApi.find((row) => row.asset_Location_ID === data.ID);
    fetch(`${server_path}api/assetlocation/${data.ID}`, {
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
          supplierObject: null,
          typeObject: null,
          statusObject: null,
          locationObject: {
            locationName: data.name,
            tagPrefix: "",
            description: "",
            active: "",
          },
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
        const index = array.indexOf(selectedRow);
        array.splice(index, 1);
        setGetApi(array);

        SetdelSuccess(true);
        setDelOpen(false);
        SetdelError(false);
      } else {
        SetdelError(true);
      }
    });
  }

  const SelectedData = GetApi.find((row) => row.asset_Location_ID === PopUpId);

  let grouped = treeViewData.reduce((rv, x) => {
    (rv[x["Group_List"]] = rv[x["Group_List"]] || []).push(x);
    return rv;
  }, []);

  console.log(grouped);

  // function checkButtonState(row, i, a) {
  //   const filtered = [
  //     ...new Set(
  //       a
  //         .filter((v) => v.Group_List === row.Group_List)
  //         .map((v) => v.parent_ID)
  //     ),
  //   ];

  //   var iterator = filtered.values();

  //   // Here all the elements of the array is being printed.
  //   for (let elements of iterator) {
  //     return elements;
  //   }
  //   // const TestData = filtered.map((val) => {
  //   //   return val;
  //   // });

  //   // console.log(TestData);

  //   if (row.assetLocation_ID === elements) {
  //     reu
  //   }

  // const values = [
  //   "Location",
  //   "Branch",
  //   "Department",
  //   "Section",
  //   "Asset Location",
  // ];

  // const AssetId = GetApi.filter((val) => val.assetLocation_ID);
  // console.log(AssetId);

  //   if (GetApi.find((v) => v.assetLocation_ID === filtered.includes(v))) {
  //     // if (row.location_Type === "Section") {
  //     //   return false;
  //     // } else {
  //     return true;
  //     // }
  //   } else {
  //     return false;
  //   }
  // }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
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

        {loading ? (
          <LoadingStyle>
            <CircularProgress />
            <div>Loading ..</div>
          </LoadingStyle>
        ) : showErrTable ? (
          <NoLocationDataTable>
            There is no information to display
          </NoLocationDataTable>
        ) : (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={classes.tablehead}>
                    Location Name
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Parent Location
                  </TableCell>
                  <TableCell align="center" className={classes.tablehead}>
                    Tag Prefix
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
                      This location is in used. You cannot remove this location.
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
                ).map((row, i, a) =>
                  // console.log(row)
                  row.asset_Location_ID === SelectedId ? (
                    <LocationEdit
                      key={row.asset_Location_ID}
                      EditRow={EditRow}
                      GetApi={GetApi}
                      setGetApi={setGetApi}
                      LocationApi={LocationApi}
                      handleChange={handleChange}
                      Apidata={Apidata}
                      SelectedId={SelectedId}
                      SetSelectedId={SetSelectedId}
                      setUpdateSuccess={setUpdateSuccess}
                      setUpdateError={setUpdateError}
                    />
                  ) : (
                    <TableRow key={row.asset_Location_ID}>
                      <TableCell align="center" className={classes.locationId}>
                        {Number(row.asset_Location_ID)}
                      </TableCell>
                      <TableCell align="center">
                        {row.asset_Location_Name}
                      </TableCell>
                      <TableCell align="center">
                        {row.Parent_Location}
                      </TableCell>
                      <TableCell align="center">{row.tag_Prefix}</TableCell>
                      <TableCell align="center">
                        {row.asset_Location_Description}
                      </TableCell>
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
                          width: "10%",
                          minWidth: "170px",
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
                              "Location Name already used in Asset Form."
                            ) {
                              setCheckDelOpen(true);
                            } else {
                              setDelOpen(true);
                            }

                            setSelectDel({
                              ID: row.asset_Location_ID,
                              name: row.asset_Location_Name,
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
                            // color: "grey",
                            textDecoration: "underline",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            Setupdatedata(row.asset_Location_ID);
                            SetSelectedId(row.asset_Location_ID);
                          }}
                        >
                          <Tooltip title="Edit Row">
                            <EditButton aria-label="Edit">
                              <CreateIcon fontSize="small" />
                            </EditButton>
                          </Tooltip>
                        </span>
                        {/* {checkButtonState(row, i, a) === true ? (
                          <span
                            style={{
                              textDecoration: "underline",
                            }}
                          >
                            <DisableButton aria-label="Add" disabled>
                              <AddBoxIcon fontSize="small" />
                            </DisableButton>
                          </span>
                        ) : (
                          <span
                            style={{
                              cursor: "pointer",
                              // color: "grey",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              setPopUp(true);
                              setPopUpId(row.asset_Location_ID);
                            }}
                          >
                            <Tooltip title="Add Child">
                              <AddButton aria-label="Add">
                                <AddBoxIcon fontSize="small" />
                              </AddButton>
                            </Tooltip>
                          </span>
                        )} */}
                        {row.location_Type === "Asset Location" ? (
                          <span
                            style={{
                              textDecoration: "underline",
                            }}
                          >
                            <DisableButton aria-label="Add" disabled>
                              <AddBoxIcon fontSize="small" />
                            </DisableButton>
                          </span>
                        ) : (
                          <span
                            style={{
                              cursor: "pointer",
                              // color: "grey",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              setPopUp(true);
                              setPopUpId(row.asset_Location_ID);
                            }}
                          >
                            <Tooltip title="Add Child">
                              <AddButton aria-label="Add">
                                <AddBoxIcon fontSize="small" />
                              </AddButton>
                            </Tooltip>
                          </span>
                        )}
                        {PopUp &&
                          (row.asset_Location_ID === PopUpId ? (
                            <AddChildPopUp
                              PopUp={PopUp}
                              setPopUp={setPopUp}
                              newData={newData}
                              GetApi={GetApi}
                              setGetApi={setGetApi}
                              setNewData={setNewData}
                              Setpostsuccess={Setpostsuccess}
                              setposterror={setposterror}
                              Apidata={Apidata}
                              PopUpId={PopUpId}
                              Added={Added}
                              setAdded={setAdded}
                              SelectedData={SelectedData}
                              treeViewData={treeViewData}
                            ></AddChildPopUp>
                          ) : null)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {AddData && (
          <AddNewPopUp
            newData={newData}
            GetApi={GetApi}
            setGetApi={setGetApi}
            setNewData={setNewData}
            AddData={AddData}
            SetAddData={SetAddData}
            Setpostsuccess={Setpostsuccess}
            setposterror={setposterror}
            Apidata={Apidata}
            Added={Added}
            setAdded={setAdded}
          ></AddNewPopUp>
        )}
        {loading || showErrTable ? null : (
          <TablePagination
            component="div"
            count={GetApi.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
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
