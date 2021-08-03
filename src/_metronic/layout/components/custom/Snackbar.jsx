import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

export default function SnackBar({ content, openSnackOpen, setOpenSnack }) {
  const [snack, setSnack = setOpenSnack] = useState({
    open: openSnackOpen,
    vertical: "top",
    horizontal: "center",
    SContent: content,
  });

  const { open, vertical, horizontal, SContent } = snack;

  function handleCloseSnack() {
    setSnack({
      ...snack,
      setSnack: false,
    });
  }
  return (
    <Snackbar
      autoHideDuration={2000}
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleCloseSnack}
      key={vertical + horizontal}
    >
      <SnackbarContent
        aria-describedby="message-id2"
        style={{
          background: "#4caf50",
        }}
        message={
          <span id="message-id2">
            <div>{SContent}</div>
          </span>
        }
      />
    </Snackbar>
  );
}
