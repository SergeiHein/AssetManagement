import React, { useState, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import styled from "styled-components";
import { appsetting } from "../../../../../envirment/appsetting";
import { FormTitle } from "../../../../layout/components/custom/FormTitle";
import FormTableEditGrid from "./FormTableEditGrid";
import Slide from "@material-ui/core/Slide";
import { TokenContext } from "../../../../../app/BasePage";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogStyles = styled(Dialog)`
  .MuiDialog-paper {
    padding: 0 0 15px 0;
  }
`;

export default function FormTableEdit({
  selectedRow,
  dialogOpen,
  handleEditChange,
  setDialogOpen,
  setOpenSnack,
  openSnack,
  selectedTypeId,
  CategoryApi,
}) {
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [newValues, setNewValues] = useState({
    ...selectedRow,
  });

  const [editFormApiValues, setEditFormApiValues] = useState({
    supplier: [],
    brand: [],
    asset_Status: [],
    status_Condition: [],
    owner_Book_Status: [],
  });

  const [formValuesErr, setFormValuesErr] = useState({
    status: false,
  });

  const [selectedEditableID, setSelectedEditableID] = useState({
    supplier_ID: newValues.supplier_ID ? newValues.supplier_ID : 0,
    asset_Status_ID: newValues.asset_Status_ID ? newValues.asset_Status_ID : 0,
    asset_Condition_ID: newValues.asset_Condition_ID
      ? newValues.asset_Condition_ID
      : 0,
    owner_Book_Status_ID: newValues.owner_Book_Status_ID
      ? newValues.owner_Book_Status_ID
      : 0,
    brandID: newValues.brandID ? newValues.brandID : 0,
    type_ID: selectedTypeId.type_ID,
    assetDetail_ID: 0,
    asset_ID: selectedTypeId.asset_ID,
  });

  function handleChange(changes, selectedEditableID) {
    handleEditChange(selectedRow.id, {
      ...newValues,
      ...changes,
      ...selectedEditableID,
    });
  }

  // get api values for entry edit form

  useEffect(() => {
    const urls = [
      `${server_path}api/statustreeview`,
      `${server_path}api/supplier/supplierDropDownList`,
      `${server_path}api/Brand/GetDropDown`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    Promise.all(requests)
      .then((res) => {
        return Promise.all(res.map((data) => data.json()));
      })
      .then((arr) => {
        setEditFormApiValues((prev) => {
          return {
            ...prev,
            asset_Status: arr[0],
            status_Condition: arr[0],
            owner_Book_Status: arr[0],
            supplier: arr[1],
            brand: arr[2],
          };
        });
      });
  }, [server_path, token]);

  // edit form grid props

  const formGridPropsValues = {
    newValues: newValues,
    setNewValues: setNewValues,
    setFormValuesErr: setFormValuesErr,
    openSnack: openSnack,
    setOpenSnack: setOpenSnack,
    handleChange: handleChange,
    selectedEditableID: selectedEditableID,
    setSelectedEditableID: setSelectedEditableID,
    setDialogOpen: setDialogOpen,
    editFormApiValues: editFormApiValues,
    CategoryApi: CategoryApi,
    formValuesErr: formValuesErr,
  };

  return (
    <>
      <DialogStyles
        aria-labelledby="simple-dialog-title"
        open={dialogOpen}
        TransitionComponent={Transition}
        onClose={() => setDialogOpen(false)}
      >
        <FormTitle>Item Detail Information</FormTitle>
        <DialogContent>
          <FormTableEditGrid
            formGridPropsValues={formGridPropsValues}
          ></FormTableEditGrid>
        </DialogContent>
      </DialogStyles>
    </>
  );
}
