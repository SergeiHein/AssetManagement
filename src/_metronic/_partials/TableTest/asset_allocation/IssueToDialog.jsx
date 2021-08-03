import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import styled from "styled-components";
import { FormTitle } from "../../../layout/components/custom/FormTitle";
import IssueToGrid from "./IssueToGrid";
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
    min-width: 80%;
    box-shadow: 0 0 7px 0 rgba(82, 63, 105, 0.15) !important;
  }

  .MuiDialogContent-root {
    padding: 50px 75px;
  }

  .mid-grid {
    display: flex;
    align-items: center;
  }
`;

export default function IssueToDialog({ issueDialogOpen, setIssueDialogOpen }) {
  return (
    <DialogStyles
      aria-labelledby="simple-dialog-title"
      open={issueDialogOpen}
      onClose={() => setIssueDialogOpen(false)}
    >
      <CloseIconButon onClick={() => setIssueDialogOpen(false)}>
        <CloseIcon></CloseIcon>
      </CloseIconButon>
      <FormTitle>Issue To</FormTitle>
      <DialogContent>
        <IssueToGrid></IssueToGrid>
      </DialogContent>
    </DialogStyles>
  );
}
