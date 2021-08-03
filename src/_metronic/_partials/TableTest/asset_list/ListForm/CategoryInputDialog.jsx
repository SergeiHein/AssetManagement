import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import { FormTitle } from "../../../../layout/components/custom/FormTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

const DialogStyles = styled(Dialog)`
  position: relative;
  .MuiDialog-paper {
    min-width: 500px;
    align-items: center;
    height: 300px;
  }
`;

const AssetDialogForm = styled.form`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  align-items: center;

  .MuiFormLabel-asterisk {
    color: red;
  }

  .Mui-error {
    color: #f44336 !important;

    &::after {
      border-bottom: 1px solid #f44336 !important;
    }
  }
`;

const DialogButtons = styled.div`
  margin-top: 70px;
`;

const CloseIconButton = styled(IconButton)`
  position: absolute !important;
  top: 10px;
  right: 15px;
`;

export default function InputDialog(props) {
  const {
    open,
    setOpen,
    setAssetNameValues,
    assetNameValues,
    setNewAssetName,
    formData,
    setFormData,
    selectedTypeId,
    setSelectedTypeId,
  } = props;
  const [newValue, setNewValue] = useState("");
  const [assetNameErr, setAssetNameErr] = useState({
    err: null,
    title: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DialogStyles
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <FormTitle style={{ width: "100%" }}>Add Asset Name</FormTitle>

      <AssetDialogForm>
        <TextField
          required
          id="standard-required"
          label="Asset Name"
          value={newValue}
          onChange={(e) => {
            setAssetNameErr({
              err: false,
              title: "Asset Name can't be empty",
            });
            setNewValue(e.target.value);
          }}
          error={assetNameErr.err}
          helperText={assetNameErr.err ? assetNameErr.title : ""}
          style={{ width: "80%", margin: "0 auto" }}
        />
        <DialogButtons>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (newValue === "") {
                setAssetNameErr({
                  err: true,
                  title: "Asset Name can't be empty",
                });

                return;
              }

              const isSame = assetNameValues.options.some(
                (val) => val === newValue
              );

              if (isSame) {
                setAssetNameErr({
                  err: true,
                  title: "Asset Name is already used",
                });

                return;
              }
              setNewAssetName(newValue);
              setAssetNameValues({
                options: [...assetNameValues.options, newValue],
              });
              setSelectedTypeId({
                ...selectedTypeId,
                asset_ID: 0,
              });

              setFormData({
                ...formData,
                asset_Name: newValue,
              });
              setOpen(false);
              setNewValue("");
            }}
            style={{ minWidth: "80px", margin: "0 auto", color: "#fff" }}
          >
            Add Asset Name
          </Button>
        </DialogButtons>
      </AssetDialogForm>

      <CloseIconButton onClick={() => setOpen(false)}>
        <CloseIcon style={{ color: "#fff" }}></CloseIcon>
      </CloseIconButton>
    </DialogStyles>
  );
}

InputDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
