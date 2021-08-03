import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import styled from "styled-components";

const DialogStyles = styled(Dialog)`
  .MuiPaper-root {
    padding: 25px 15px;
  }
`;

const YesButton = styled(Button)`
  background: rgba(54, 153, 255, 0.65) !important;
  padding: 6px 30px !important;
  color: #fff !important;
  transition: all 300ms;

  &:hover {
    background: rgba(54, 153, 255, 0.9) !important;
  }
`;

const NoButton = styled(Button)`
  color: rgba(244, 67, 54, 0.8) !important;
`;

export default function CancelDialog({
  setCancelDialogOpen,
  cancelDialogOpen,
  //   callbackFunc,
  //   deletableTitle,
  //   unDeletableTitle,
}) {
  console.log(cancelDialogOpen);
  return (
    <DialogStyles
      open={cancelDialogOpen.open}
      onClose={() =>
        setCancelDialogOpen({
          isDeletable: true,
          open: false,
        })
      }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {cancelDialogOpen.title}
      </DialogTitle>

      <DialogActions style={{ justifyContent: "center" }}>
        <YesButton
          onClick={() => {
            cancelDialogOpen.info.event.remove();

            setCancelDialogOpen({ ...cancelDialogOpen, open: false });
            // callbackFunc();
          }}
        >
          Yes
        </YesButton>
        <NoButton
          onClick={() =>
            setCancelDialogOpen({ ...cancelDialogOpen, open: false })
          }
          autoFocus
        >
          No
        </NoButton>
      </DialogActions>
    </DialogStyles>
  );
}
