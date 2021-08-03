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
  callbackFunc,
  deletableTitle,
  unDeletableTitle,
}) {
  return cancelDialogOpen.isDeletable ? (
    <DialogStyles
      open={cancelDialogOpen.dialogOpen}
      onClose={() =>
        setCancelDialogOpen({
          isDeletable: true,
          dialogOpen: false,
        })
      }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{deletableTitle}</DialogTitle>

      <DialogActions style={{ justifyContent: "center" }}>
        <YesButton
          onClick={() => {
            callbackFunc();
          }}
        >
          Yes
        </YesButton>
        <NoButton onClick={() => setCancelDialogOpen(false)} autoFocus>
          No
        </NoButton>
      </DialogActions>
    </DialogStyles>
  ) : (
    <DialogStyles
      open={cancelDialogOpen.dialogOpen}
      onClose={() =>
        setCancelDialogOpen({
          isDeletable: false,
          dialogOpen: false,
        })
      }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{unDeletableTitle}</DialogTitle>

      <DialogActions style={{ justifyContent: "center" }}>
        <NoButton
          onClick={() => {
            setCancelDialogOpen({
              isDeletable: false,
              dialogOpen: false,
            });
          }}
        >
          Back
        </NoButton>
      </DialogActions>
    </DialogStyles>
  );
}
