import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import styled from "styled-components";
import { FormTitle } from "../../../../layout/components/custom/FormTitle";
import EditDetailFormGrid from "./EditDetailFormGrid";

const DialogStyles = styled(Dialog)`
  .MuiDialog-paper {
    padding: 0 0 15px 0;
  }
`;

export default function TableEditDetailForm({
  selectedRow,
  formApiValues,
  setDialogOpen,
  dialogOpen,
  handleEditChange,
  selectedEditableID,
  setSelectedEditableID,
  openSnack,
  setOpenSnack,
  newChanges,
  setNewChanges,
}) {
  const [newValues, setNewValues] = useState({ ...selectedRow });

  const [formValuesErr, setFormValuesErr] = useState({
    status: false,
  });

  const gridPropValues = {
    newValues: newValues,
    setNewValues: setNewValues,
    formApiValues: formApiValues,
    handleChange: handleChange,
    selectedEditableID: selectedEditableID,
    setSelectedEditableID: setSelectedEditableID,
    formValuesErr: formValuesErr,
    setFormValuesErr: setFormValuesErr,
    setDialogOpen: setDialogOpen,
    openSnack: openSnack,
    setOpenSnack: setOpenSnack,
    newChanges: newChanges,
    setNewChanges: setNewChanges,
  };

  function handleChange(changes, selectedEditableID) {
    handleEditChange(selectedRow.id, {
      ...newValues,
      ...changes,
      ...selectedEditableID,
    });
  }

  return (
    <DialogStyles
      aria-labelledby="simple-dialog-title"
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
    >
      <FormTitle>Item Detail Information</FormTitle>
      <DialogContent>
        <EditDetailFormGrid
          gridPropValues={gridPropValues}
        ></EditDetailFormGrid>
      </DialogContent>
    </DialogStyles>
  );
}
