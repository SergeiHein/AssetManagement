import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
  return <MuiAlert elevation={2} variant="filled" {...props} />;
}

export function SnackBarSave({ Postsuccess, Setpostsuccess }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    Setpostsuccess(false);
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={Postsuccess}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="success">
        This Record has saved Successfully!
      </Alert>
    </Snackbar>
  );
}

export function SnackBarSaveError({ PostError, setposterror }) {
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setposterror(false);
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={PostError}
      autoHideDuration={3000}
      onClose={handleCloseError}
    >
      <Alert onClose={handleCloseError} severity="error">
        There is a problem saving this record. Please try again.
      </Alert>
    </Snackbar>
  );
}

export function SnackBarUpdate({ UpdateSuccess, setUpdateSuccess }) {
  const handleUpdateBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateSuccess(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={UpdateSuccess}
      autoHideDuration={3000}
      onClose={handleUpdateBar}
    >
      <Alert onClose={handleUpdateBar} severity="info">
        This record has updated successfully!
      </Alert>
    </Snackbar>
  );
}

export function SnackBarUpdateError({ UpdateError, setUpdateError }) {
  const handleUpdateError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateError(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={UpdateError}
      autoHideDuration={3000}
      onClose={handleUpdateError}
    >
      <Alert onClose={handleUpdateError} severity="error">
        There is a problem updating this record. Please try again.
      </Alert>
    </Snackbar>
  );
}

export function SnackBarDelete({ DelSuccess, SetdelSuccess }) {
  const handleDeleteBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    SetdelSuccess(false);
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={DelSuccess}
      autoHideDuration={3000}
      onClose={handleDeleteBar}
    >
      <Alert onClose={handleDeleteBar} severity="info">
        This Record has Removed Successfully!
      </Alert>
    </Snackbar>
  );
}

export function SnackBarDeleteError({ DelError, SetdelError }) {
  const handleDeleteError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    SetdelError(false);
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={DelError}
      autoHideDuration={3000}
      onClose={handleDeleteError}
    >
      <Alert onClose={handleDeleteError} severity="error">
        There is a problem removing this record.Please Try Agian!
      </Alert>
    </Snackbar>
  );
}

export function SnackBarCheckError({ checkError, setCheckError }) {
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCheckError(false);
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={checkError}
      autoHideDuration={3000}
      onClose={handleCloseError}
    >
      <Alert onClose={handleCloseError} severity="error">
        You cannot issue more than issue Qty!
      </Alert>
    </Snackbar>
  );
}
