import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import styled from "styled-components";
import { FormTitle } from "../../../layout/components/custom/FormTitle";
import EditDetailFormGrid from "./EditDetailFormGrid";
import moment from "moment";

const DialogStyles = styled(Dialog)`
  .MuiDialog-paper {
    padding: 0 0 15px 0;
  }
`;

export default function TableEditDetailForm({
  selectedRow,
  detailRow,
  setDialogOpen,
  dialogOpen,
  server_path,
  token,
  empID,
  openSnack,
  setOpenSnack,
  newChanges,
  setNewChanges,
  formValuesErr,
  setFormValuesErr,
  edited,
  setEdited,
}) {
  const [newValues, setNewValues] = useState({
    ...selectedRow,
    supplier: detailRow.supplier,
    expiry_Date: moment(detailRow.expire_On).format("DD/MM/YYYY"),
    type: detailRow.type,
    category: detailRow.category,
  });

  // console.log(newValues);

  const [formApiValues, setFormApiValues] = useState({
    supplier: [],
    brand: [],
    asset_Status: [],
    asset_Condition: [],
    owner_Book_Status: [],
    asset_Type: [],
    category: [],
    location: [],
  });

  //   console.log(formApiValues);

  useEffect(() => {
    const urls = [
      `${server_path}api/supplier/supplierDropDownList`,
      `${server_path}api/Brand/GetDropDown`,
      `${server_path}api/statustreeview`,
      `${server_path}api/AssetType/AssetTypeDropDownList`,
      `${server_path}api/Category/CategoryDropDownList`,
      `${server_path}api/AssetLocation/LocationTreeView`,
    ];

    const requests = urls.map((one) =>
      fetch(one, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(requests)
      .then((res) => {
        return Promise.all(res.map((one) => one.json()));
      })
      .then((arr) => {
        console.log(arr);
        setFormApiValues((prev) => {
          return {
            ...prev,
            // location: setting,
            supplier: arr[0],
            brand: arr[1],
            asset_Status: arr[2],
            asset_Condition: arr[2],
            owner_Book_Status: arr[2],
            asset_Type: arr[3],
            category: arr[4],
            location: arr[5],
          };
        });
      });
  }, [server_path, token]);

  const gridPropValues = {
    newValues: newValues,
    setNewValues: setNewValues,
    formApiValues: formApiValues,
    // handleChange: handleChange,
    // selectedEditableID: selectedEditableID,
    // setSelectedEditableID: setSelectedEditableID,
    selectedRow: {
      ...selectedRow,
      supplier: detailRow.supplier,
      expiry_Date: moment(detailRow.expire_On).format("DD/MM/YYYY"),
      type: detailRow.type,
      category: detailRow.category,
    },
    formValuesErr: formValuesErr,
    setFormValuesErr: setFormValuesErr,
    setDialogOpen: setDialogOpen,
    openSnack: openSnack,
    setOpenSnack: setOpenSnack,
    newChanges: newChanges,
    setNewChanges: setNewChanges,
    empID: empID,
    // selectedRow: selectedRow,
    token: token,
    server_path: server_path,
    edited: edited,
    setEdited: setEdited,
  };

  //   function handleChange(changes, selectedEditableID) {
  //     handleEditChange(selectedRow.id, {
  //       ...newValues,
  //       ...changes,
  //       ...selectedEditableID,
  //     });
  //   }

  return (
    // <></>
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
