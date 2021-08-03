import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import styled from "styled-components";
import { FormTitle } from "../../../layout/components/custom/FormTitle";
import DetailGrid from "./DetailGrid";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const CloseIconButon = styled(IconButton)`
  position: absolute !important;
  right: 15px;
  top: 7px;
  width: 50px;
  height: 50px;
  color: #fff !important;
`;
const DialogStyles = styled(Dialog)`
  position: relative;
  .MuiPaper-root {
    min-width: 50%;
    max-width: 700px;
    padding: 0 0 25px 0;
  }

  .mid-grid {
    display: flex;
    align-items: center;
  }
`;

export default function DetailDialog({ dialogOpen, setDialogOpen }) {
  return (
    <DialogStyles
      aria-labelledby="simple-dialog-title"
      open={dialogOpen.open}
      onClose={() => setDialogOpen(false)}
    >
      <CloseIconButon onClick={() => setDialogOpen(false)}>
        <CloseIcon></CloseIcon>
      </CloseIconButon>
      <FormTitle>Asset Detail Information</FormTitle>
      <DialogContent>
        <DetailGrid dialogOpen={dialogOpen}></DetailGrid>
      </DialogContent>
    </DialogStyles>
  );
}
