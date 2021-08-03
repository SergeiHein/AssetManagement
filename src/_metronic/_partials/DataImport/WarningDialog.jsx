import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import styled from "styled-components";
import { FormTitle } from "../../layout/components/custom/FormTitle";
import WarningGrid from "./WarningGrid";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const DialogStyles = styled(Dialog)`
  position: relative;
  .MuiDialog-paper {
    padding: 0 0 15px 0;
  }
`;

const CloseIconButon = styled(IconButton)`
  position: absolute !important;
  right: 15px;
  top: 7px;
  width: 50px;
  height: 50px;
  color: #fff !important;
`;
// import EditDetailFormGrid from "./EditDetailFormGrid";

export default function WarningDialog({
  //   warningMsg,
  dialogOpen,
  setDialogOpen,
}) {
  //   console.log(dialogOpen);
  return (
    <DialogStyles
      aria-labelledby="simple-dialog-title"
      open={dialogOpen.open}
      onClose={() => setDialogOpen({ ...dialogOpen, open: false })}
    >
      <CloseIconButon
        onClick={() => setDialogOpen({ ...dialogOpen, open: false })}
      >
        <CloseIcon></CloseIcon>
      </CloseIconButon>
      <FormTitle>Excel Information</FormTitle>
      <DialogContent>
        <WarningGrid data={dialogOpen.data}></WarningGrid>
      </DialogContent>
    </DialogStyles>
  );
}
