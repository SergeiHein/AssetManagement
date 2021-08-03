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
import moment from "moment";
import { KTCookie } from "../../../../../_metronic/_assets/js/components/cookie";
import FormHelperText from "@material-ui/core/FormHelperText";
import { SnackBarSaveError } from "../../../Settings/SnackBar";

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

export default function WarrantyEntryPopUp({
  setWarrantyEntry,
  WarrantyEntry,
  setWarrantyApiValues,
  Setpostsuccess,
  setShowErrTable,
}) {
  const { TextArea } = Input;
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [empID] = useState(KTCookie.getCookie("empID"));
  const now = moment();

  const [ExpiryError, setExpiryError] = useState(false);
  const [WarrantyError, setWarrantyError] = useState(false);
  const [WarningError, setWarningError] = useState(false);

  const [PostError, setposterror] = useState(false);

  const [WarrantySaveValues, setWarrantySaveValues] = useState({
    warranty_ID: 0,
    assetDetail_ID: WarrantyEntry.id,
    expiry_Date: "",
    warranty: 0,
    note: "",
    created_By: 0,
    modified_By: 0,
  });

  const WarrantyHandleClose = () => {
    setWarrantyEntry({ open: false, id: null });
  };

  function HandleOnWarranty(e) {
    e.preventDefault();
    if (WarrantySaveValues.expiry_Date === "") {
      setExpiryError(true);
    } else {
      setExpiryError(false);
      if (WarrantySaveValues.warranty === 0) {
        setWarrantyError(true);
      } else {
        setWarrantyError(false);
        if (now.isAfter(WarrantySaveValues.expiry_Date)) {
          setWarningError(true);
        } else {
          setWarningError(false);
          fetch(`${server_path}api/AssetView/SaveAssetWarranty`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              warranty_ID: 0,
              assetDetail_ID: WarrantyEntry.id,
              expiry_Date: WarrantySaveValues.expiry_Date,
              warranty: WarrantySaveValues.warranty,
              note: WarrantySaveValues.note,
              created_By: parseInt(empID),
              modified_By: parseInt(empID),
            }),
          }).then((res) => {
            if (res.status === 200) {
              fetch(
                `${server_path}api/AssetView/GetWarrantyList?AssetDetail_ID=${WarrantyEntry.id}
            `,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
                .then((res) => res.json())
                .then((data) => {
                  setWarrantyApiValues([...data]);

                  Setpostsuccess(true);
                  setShowErrTable(false);

                  setWarrantyEntry({ open: false, id: null });
                });
            } else {
              setposterror(true);
            }
          });
        }
      }
    }
  }
  return (
    <div>
      <Dialog
        onClose={WarrantyHandleClose}
        aria-labelledby="customized-dialog-title"
        open={WarrantyEntry.open}
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
                  height: "90%",
                  marginLeft: 10,
                }}
                value={
                  WarrantySaveValues?.expiry_Date !== ""
                    ? moment(
                        WarrantySaveValues.expiry_Date,
                        "DD/MM/YYYY hh:mm:ss"
                      )
                    : null
                }
                onChange={(e, l) => {
                  setWarrantySaveValues({
                    ...WarrantySaveValues,
                    expiry_Date: l,
                  });
                  setExpiryError(false);
                  setWarningError(false);
                }}
                popupStyle={{ zIndex: 9999 }}
              />
            </WarrantyBox>
            {ExpiryError && (
              <FormHelperText
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "75%",
                  marginBottom: "5px",
                  marginTop: "-20px",
                  color: "#f44336",
                }}
              >
                *Expiry date cannot be empty
              </FormHelperText>
            )}
            {WarningError && (
              <FormHelperText
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "82%",
                  marginBottom: "5px",
                  marginTop: "-20px",
                  color: "#f44336",
                }}
              >
                *Expiry date cannot be less than now.
              </FormHelperText>
            )}
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
                placeholder="warranty(months)"
                onChange={(e) => {
                  setWarrantySaveValues({
                    ...WarrantySaveValues,
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
            {WarrantyError && (
              <FormHelperText
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "82%",
                  marginBottom: "5px",
                  marginTop: "-20px",
                  color: "#f44336",
                }}
              >
                *Warranty(months) cannot be empty
              </FormHelperText>
            )}
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
                value={WarrantySaveValues.note}
                onChange={(e) => {
                  setWarrantySaveValues({
                    ...WarrantySaveValues,
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
            onClick={HandleOnWarranty}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {PostError ? (
        <SnackBarSaveError
          PostError={PostError}
          setposterror={setposterror}
        ></SnackBarSaveError>
      ) : (
        ""
      )}
    </div>
  );
}
