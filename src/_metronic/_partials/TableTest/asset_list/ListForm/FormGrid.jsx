import React, { useState, useEffect } from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import InputDialog from "./CategoryInputDialog";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import moment from "moment";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";

import {
  IconButtonStyles,
  TreeViewDropDown,
} from "../../../../layout/components/custom/css/ListForm_Styles";
import ValidateFormImage from "../../../../layout/components/custom/ValidateFormImage";

import "antd/dist/antd.css";

const useStyles = makeStyles(() => ({
  select: {
    border: "1px solid #87a9ff",
    borderRadius: "5px",
    "& li": {},
  },
  popper: {
    border: "1px solid #87a9ff",
    borderRadius: "5px",
    zIndex: 999,
  },
}));

export default function FormGrid({ formPropsValues }) {
  const {
    formValuesErr,
    setFormValuesErr,
    formData,
    setFormData,
    formApiValues,
    selectedTypeId,
    setSelectedTypeId,
    selectedTypeCategoryValues,
    assetNameValues,
    setAssetNameValues,
    setOpenSnack,
    openSnack,
    urlImg,
    setURLImg,
    newAssetName,
    setNewAssetName,
  } = formPropsValues;

  const [open, setOpen] = useState(false);
  const classes = useStyles();

  function onClose() {
    setOpen(false);
  }

  useEffect(() => {
    if (formData.category.toLowerCase() === "vehicle") {
      setFormData({
        ...formData,
        note: "",
      });
    }
  }, [formData.category]);

  const PopperMy = function(props) {
    return (
      <Popper {...props} className={classes.popper} placement="bottom-start" />
    );
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <FormControl error={formValuesErr.typeErr}>
          <InputLabel id="demo-simple-select-label" required>
            Type
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            MenuProps={{ classes: { paper: classes.select } }}
            required
            value={formData.type}
            onChange={(e) => {
              setFormValuesErr({
                ...formValuesErr,
                typeErr: false,
              });
              setFormData({
                ...formData,
                type: e.target.value,
              });

              const id = formApiValues.type.find(
                (one) => one.type_Name === e.target.value
              ).type_ID;

              if (!id) return;

              setSelectedTypeId({
                ...selectedTypeId,
                type_ID: id,
              });
            }}
          >
            {formApiValues.type.map((value) => (
              <MenuItem value={value.type_Name} key={value.type_ID}>
                {value.type_Name}
              </MenuItem>
            ))}
          </Select>
          {formValuesErr.typeErr && (
            <FormHelperText>Type can't be empty</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled
          id="Total-quantity"
          label="Total quantity"
          value={formData.total_Qty}
          variant="filled"
          tabIndex="-1"
        />
      </Grid>

      <Grid item xs={6} style={{ position: "relative" }}>
        <FormControl error={formValuesErr.categoryErr}>
          <InputLabel id="demo-simple-select-label" required>
            Category
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            MenuProps={{ classes: { paper: classes.select } }}
            required
            value={formData.category}
            onChange={(e) => {
              setFormValuesErr({
                ...formValuesErr,
                categoryErr: false,
              });

              const id = formApiValues.category.find(
                (one) => one.category_Name === e.target.value
              ).category_ID;

              setSelectedTypeId({
                ...selectedTypeId,
                category_ID: id,
              });
              setFormData({
                ...formData,
                category: e.target.value,
              });
            }}
          >
            {selectedTypeCategoryValues.map((value) => (
              <MenuItem
                value={value.category_Name === "" ? null : value.category_Name}
                key={value.category_ID}
              >
                {value.category_Name}
              </MenuItem>
            ))}
          </Select>
          {formValuesErr.categoryErr && (
            <FormHelperText>Category can't be empty</FormHelperText>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Remaining Quantity"
          disabled
          id="Remaining-Quantity"
          variant="filled"
          type="number"
          inputProps={{ min: "0", max: "100" }}
          value={formData.remaining_Qty}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item xs={6} style={{ position: "relative" }}>
        {" "}
        <Autocomplete
          {...assetNameValues}
          id="auto-select"
          className={classes.autoComplete}
          selectOnFocus
          PopperComponent={PopperMy}
          value={
            newAssetName
              ? newAssetName
              : formData.asset_Name
              ? formData.asset_Name
              : formData.asset_Name || newAssetName === ""
              ? null
              : formData.asset_Name
          }
          onChange={(e, v) => {
            setNewAssetName("");
            setFormValuesErr({
              ...formValuesErr,
              assetNameErr: false,
            });
            const id = formApiValues.assetName.find((one) => {
              return one.asset === v;
            });

            setFormData({
              ...formData,
              asset_Name: v,
            });

            if (!id) {
              setSelectedTypeId({
                ...selectedTypeId,
                asset_ID: 0,
              });

              return;
            }

            setSelectedTypeId({
              ...selectedTypeId,
              asset_ID: id.asset_ID,
            });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Asset Name"
              required
              error={formValuesErr.assetNameErr}
              value={newAssetName ? newAssetName : formData.asset_Name}
              helperText={`${
                formValuesErr.assetNameErr ? "Asset Name can't be empty" : ""
              }`}
              margin="normal"
            />
          )}
          style={{ flex: "1" }}
        />
        <IconButtonStyles onClick={() => setOpen(true)}>
          <AddBoxIcon></AddBoxIcon>
        </IconButtonStyles>
        <InputDialog
          onClose={onClose}
          open={open}
          setOpen={setOpen}
          setAssetNameValues={setAssetNameValues}
          assetNameValues={assetNameValues}
          setNewAssetName={setNewAssetName}
          setFormData={setFormData}
          formData={formData}
          selectedTypeId={selectedTypeId}
          setSelectedTypeId={setSelectedTypeId}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="Minimum-Quantity"
          label="Minimum Quantity"
          type="number"
          value={formData.minimum_Qty}
          onChange={(e) =>
            setFormData({
              ...formData,
              minimum_Qty: parseFloat(e.target.value),
            })
          }
          inputProps={{ min: "0", max: "100" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item xs={6} style={{ position: "relative" }}>
        <FormControl error={formValuesErr.locationErr}>
          <TreeViewDropDown
            style={{ width: "100%" }}
            dropdownStyle={{
              maxHeight: 400,
              overflow: "auto",
              minWidth: 300,
            }}
            treeData={formApiValues.location}
            placeholder="Asset Location*"
            onChange={(e, l) => {
              setFormValuesErr({
                ...formValuesErr,
                locationErr: false,
              });

              if (!e) return;
              setSelectedTypeId({
                ...selectedTypeId,
                location_ID: e,
              });
              setFormData({ ...formData, location: l[0] });
            }}
          />
          {/* {formValuesErr.locationErr && (
          <FormHelperText
            color="primary"
            style={{
              color: "#f44336",
              position: "absolute",
              top: "67%",
            }}
          >
            *Asset Location cannot be empty
          </FormHelperText>
        )} */}
        </FormControl>
        {formValuesErr.locationErr && (
          <FormHelperText
            color="primary"
            style={{
              color: "#f44336",
              position: "absolute",
              top: "calc(100% - 16px)",
            }}
          >
            *Asset Location cannot be empty
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="Purchase-Quantity"
          label="Purchase Quantity"
          type="number"
          required
          error={formValuesErr.purchaseQuantityErr}
          helperText={
            formValuesErr.purchaseQuantityErr
              ? "Purchase Quantity can't be empty"
              : ""
          }
          value={formData.purchase_Qty}
          onChange={(e) => {
            setFormValuesErr({
              ...formValuesErr,
              purchaseQuantityErr: false,
            });
            setFormData({
              ...formData,
              purchase_Qty: parseFloat(e.target.value),
            });
          }}
          inputProps={{ min: "0", max: "100" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      <Grid item xs={6} className="description-grid">
        <TextField
          id="outlined-multiline-static"
          label="Specification"
          value={
            formData.category.toLowerCase() === "vehicle" ? "" : formData.note
          }
          disabled={
            formData.category.toLowerCase() === "vehicle" ? true : false
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              note: e.target.value,
            })
          }
          multiline
          rows={4}
          variant={
            formData.category.toLowerCase() === "vehicle"
              ? "filled"
              : "outlined"
          }
        />
      </Grid>
      <Grid item xs={6}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Purchase Date"
            required
            error={formValuesErr.dateErr}
            helperText={
              formValuesErr.dateErr ? "Purchase Date can't be empty" : ""
            }
            format="dd/MM/yyyy"
            inputValue={formData.purchase_Date}
            InputLabelProps={{
              formlabelclasses: {
                asterisk: {
                  color: "#f44336",
                },
              },
            }}
            onChange={(e) => {
              setFormValuesErr({
                ...formValuesErr,
                dateErr: false,
              });

              setFormData({
                ...formData,
                purchase_Date: moment(e)
                  .format("DD-MM-YYYY")
                  .split("T")[0]
                  .replace(/-/gi, "/"),
              });
            }}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>

      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.is_Requestable}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  is_Requestable: e.target.checked,
                });
              }}
              name="checkedA"
            />
          }
          label="Requestable"
        />
      </Grid>

      <Grid item xs={6}>
        <input
          id="icon-button-file"
          type="file"
          tabIndex="2"
          onChange={(e) => {
            ValidateFormImage(
              e,
              setOpenSnack,
              openSnack,
              setURLImg,
              setFormData,
              formData
            );
          }}
          style={{ display: "none" }}
        />
        <label
          htmlFor="icon-button-file"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Button
            variant="contained"
            color="secondary"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Upload
          </Button>
          <span style={{ marginTop: "7px" }}>
            {urlImg.length < 15
              ? urlImg
              : urlImg.substring(0, 15).concat(" ..")}
          </span>
        </label>
      </Grid>
    </Grid>
  );
}
