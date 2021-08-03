import React, { useState, useEffect } from "react";
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
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import EditTable from "./EditTable";
import CreateIcon from "@material-ui/icons/Create";

const useStyles = makeStyles({
  tableContainer: {
    boxShadow: "0 0 50px 0 rgba(82,63,105,0.15) !important",
  },
  container: {
    marginTop: 100,
  },
  // Delete: {
  //   minWidth: 20,
  //   marginRight: 10,
  //   borderRadius: 5,
  // },
  // Edit: {
  //   minWidth: 20,
  //   marginLeft: 10,
  //   borderRadius: 5,
  //   background: "rgba(54,153,255,0.5) !important",
  //   opacity: "0.8",
  // },
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
    position: "absolute",
    right: "3%",
    top: "25%",
  },

  input: {
    width: "60%",
  },
  statusId: {
    display: "none",
  },
});

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

export default function StatusTable() {
  const classes = useStyles();
  const [AddData, SetAddData] = useState(false);
  const [EditData, SetEditdata] = useState(false);
  const GetApi = "http://192.168.1.2:8087/api/status";
  const [StatusApi, SetstatusApi] = useState([
    {
      created_By: 0,
      message: null,
      modified_By: 0,
      status_ID: "",
      status_Name: "",
    },
  ]);
  const [newData, setNewData] = useState({
    status_ID: "",
    status_Name: "",
    created_By: "",
    modified_By: "",
    message: "",
  });
  const [helperText, SethelperText] = useState();
  const [Error, SetError] = useState(false);
  const [added, setAdded] = useState(null);
  const [updatedata, Setupdatedata] = useState();
  const EditRow = StatusApi.find((data) => data.status_ID === updatedata);
  // const [GetData, SetGetData] = useState();
  // console.log(EditRow);

  useEffect(() => {
    fetch(GetApi)
      .then((res) => res.json())
      .then((data) => SetstatusApi(data));
  }, [added]);

  function AddHandler() {
    SetAddData(true);
    // SetstatusApi([...StatusApi, newData]);
  }
  const Apidata = {
    status_Name: newData.status_Name,
    created_By: newData.created_By,
    modified_By: newData.modified_By,
    message: newData.message,
  };
  const [Postsuccess, Setpostsuccess] = useState(false);
  function handleonSubmit(e) {
    e.preventDefault();
    if (newData.status_Name === "") {
      SetError(true);
      SethelperText("* required");
      SetAddData(true);
    } else {
      SetError(false);

      SetAddData(false);
      fetch(GetApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Apidata),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          Setpostsuccess(true);
          setAdded(!added);
        });
      SetstatusApi([...StatusApi, newData]);

      console.log(newData);
      setNewData({
        status_ID: "",
        status_Name: "",
        created_By: "",
        modified_By: "",
        message: "",
      });
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    Setpostsuccess(false);
  };
  const [DelSuccess, SetdelSuccess] = useState(false);
  function HandleDelete(status_ID) {
    const selectedRow = StatusApi.find((row) => row.status_ID === status_ID);
    fetch(`http://192.168.1.2:8087/api/status/${selectedRow.status_ID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedRow.status_ID),
    });

    const array = [...StatusApi];
    const index = array.indexOf(selectedRow);
    array.splice(index, 1);
    SetstatusApi(array);
    console.log(selectedRow.status_ID);
    SetdelSuccess(true);
  }
  const handleDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    SetdelSuccess(false);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="fixed" className={classes.container}>
        <Button
          variant="contained"
          color="secondary"
          className={classes.btn}
          onClick={AddHandler}
        >
          Add new
        </Button>
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Status_Name</TableCell>
                <TableCell align="center">Created-by</TableCell>
                <TableCell align="center">modified_By</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {AddData && (
                <TableRow className={classes.formControl}>
                  <TableCell>
                    <TextField
                      // error={error.length === 0 ? false : true}
                      id="statusName"
                      helperText={helperText}
                      error={Error}
                      className={classes.input}
                      value={newData.status_Name}
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          status_Name: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      id="createId"
                      type="number"
                      className={classes.input}
                      value={newData.created_By}
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          created_By: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      id="ModifieBy"
                      type="number"
                      className={classes.input}
                      value={newData.modified_By}
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          modified_By: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
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
                        SethelperText("");
                        SetError(false);
                      }}
                    >
                      <ClearIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {EditData && (
                <EditTable
                  EditRow={EditRow}
                  EditData={EditData}
                  SetEditdata={SetEditdata}
                  SetstatusApi={SetstatusApi}
                  StatusApi={StatusApi}
                  GetApi={GetApi}
                  Apidata={Apidata}
                  added={added}
                  newData={newData}
                />
              )}
              {StatusApi.map(
                (row) => (
                  <TableRow className={classes.Rowheader}>
                    <TableCell align="center" className={classes.statusId}>
                      {Number(row.status_ID)}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {row.status_Name}
                    </TableCell>
                    <TableCell align="center">{row.created_By}</TableCell>
                    <TableCell align="center">{row.modified_By}</TableCell>
                    <TableCell align="center">
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#353535",
                          textDecoration: "underline",
                          marginRight: "10px",
                        }}
                        onClick={() => HandleDelete(row.status_ID)}
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
                          Setupdatedata(row.status_ID);
                          SetEditdata(true);
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
                // )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {Postsuccess ? (
          <Snackbar
            // style={{
            //   background: "green",
            // }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={Postsuccess}
            autoHideDuration={3000}
            onClose={handleClose}
            message="Successfully Added"
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        ) : (
          ""
        )}
        {DelSuccess ? (
          <Snackbar
            // style={{
            //   background: "green",
            // }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={DelSuccess}
            autoHideDuration={3000}
            onClose={handleDelete}
            message="Row Deleted"
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleDelete}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        ) : (
          ""
        )}
      </Container>
    </React.Fragment>
  );
}
