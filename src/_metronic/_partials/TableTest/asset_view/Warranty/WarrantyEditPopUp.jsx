import React, { useState, useEffect, useContext } from "react";

import styled from "styled-components";
import { DatePicker } from "antd";

import { Input } from "antd";
import { appsetting } from "../../../../../envirment/appsetting";
import { TokenContext } from "../../../../../app/BasePage";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { KTCookie } from "../../../../../_metronic/_assets/js/components/cookie";

const FormContainer = styled.div``;

const WarrantyBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const NoteBox = styled.div`
  display: flex;
  justify-content: space-around;
`;

const WarrantyQtyBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    minWidth: 600,
  },
}))(MuiDialogActions);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function WarrantyEditPopUp({
  setWarrantyEdit,
  WarrantyEdit,
  selectedId,
  setWarrantyApiValues,

  setUpdateSuccess,
  setUpdateError,
  EditRow,
}) {
  const { TextArea } = Input;

  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [EditPopUpApiValues, setEditPopUpApiValues] = useState({ ...EditRow });
  const [empID] = useState(KTCookie.getCookie("empID"));

  useEffect(() => {
    setEditPopUpApiValues(EditRow);
  }, [EditRow]);

  const WarrantyHandleClose = () => {
    setWarrantyEdit({ open: false, id: null });
  };

  function HandleOnUpdate(e) {
    e.preventDefault();
    fetch(`${server_path}api/AssetView/SaveAssetWarranty`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        warranty_ID: selectedId,
        assetDetail_ID: WarrantyEdit.id,
        expiry_Date: EditPopUpApiValues.expiry_On,
        warranty: EditPopUpApiValues.warranty,
        note: EditPopUpApiValues.note,
        created_By: parseInt(empID),
        modified_By: parseInt(empID),
      }),
    }).then((res) => {
      if (res.status === 200) {
        fetch(
          `${server_path}api/AssetView/GetWarrantyList?AssetDetail_ID=${WarrantyEdit.id}
            `,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            setWarrantyApiValues(data);

            setUpdateSuccess(true);

            setWarrantyEdit({ open: false, id: null });
          });
      } else {
        setUpdateError(true);
      }
    });
  }

  return (
    <div>
      <Dialog
        onClose={WarrantyHandleClose}
        aria-labelledby="customized-dialog-title"
        open={WarrantyEdit.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={WarrantyHandleClose}>
          Asset Warranty
        </DialogTitle>
        <DialogContent dividers>
          <FormContainer>
            <WarrantyBox>
              <p
                style={{
                  marginTop: 5,
                }}
              >
                Expiry On<span style={{ color: "red" }}>*</span>
              </p>
              <DatePicker
                format="DD/MM/YYYY hh:mm:ss"
                showTime
                style={{
                  marginLeft: 8,
                  height: "90%",
                }}
                onChange={(e, l) => {
                  setEditPopUpApiValues({
                    ...EditPopUpApiValues,
                    expiry_On: l,
                  });
                }}
                allowClear={false}
                popupStyle={{ zIndex: 9999 }}
              />
            </WarrantyBox>

            <WarrantyQtyBox>
              <p
                style={{
                  marginTop: 5,
                }}
              >
                Warranty
              </p>
              <Input
                type="number"
                min="0"
                placeholder="Warranty(months)"
                value={EditPopUpApiValues.warranty}
                onChange={(e) => {
                  setEditPopUpApiValues({
                    ...EditPopUpApiValues,
                    warranty: parseInt(e.target.value),
                  });
                }}
                style={{
                  width: "38%",
                  marginLeft: 18,
                  height: "90%",
                }}
              />
            </WarrantyQtyBox>
            <NoteBox>
              <p
                style={{
                  marginTop: 5,
                }}
              >
                Note
              </p>
              <TextArea
                rows={4}
                style={{
                  width: "38%",
                  marginLeft: 40,
                }}
                value={EditPopUpApiValues.note}
                onChange={(e) => {
                  setEditPopUpApiValues({
                    ...EditPopUpApiValues,
                    note: e.target.value,
                  });
                }}
              />
            </NoteBox>
          </FormContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={WarrantyHandleClose} color="default">
            Cancel
          </Button>
          <Button
            autoFocus
            style={{
              background: "rgba(54, 153, 255, 0.75)",
              color: "#fff",
            }}
            variant="contained"
            onClick={HandleOnUpdate}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
