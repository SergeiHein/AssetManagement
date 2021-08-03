import React, { useState } from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import moment from "moment";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import { appsetting } from "../../../../../envirment/appsetting";
import ValidateFormImage from "../../../../layout/components/custom/ValidateFormImage";
import { TreeViewDropDown } from "../../../../layout/components/custom/css/ListForm_Styles";

export const SelectStyles = styled(Select)`
  width: 100% !important;
`;

export const EditImg = styled.img`
  width: 100px;
  object-fit: cover;
  height: 100px;
  margin-right: 30px;
  transition: transform 300ms;
`;

export default function TableEditGrid({ gridPropValues }) {
  const {
    newValues,
    setNewValues,
    formApiValues,
    formValuesErr,
    setFormValuesErr,
    urlImg,
    setUrlImg,
    openSnack,
    setOpenSnack,
    setLocationID,
    newChanges,
    setNewChanges,
    updateLoading,
    setUpdateLoading,
  } = gridPropValues;

  const { server_path } = appsetting;
  const [imgErr, setImgErr] = useState(false);
  const [imgEx, setImgEx] = useState("");
  return (
    <>
      <Grid item xs={6}>
        <TextField
          label="Type"
          disabled
          id="filled-disabled-type"
          value={newValues.type ? newValues.type : ""}
        ></TextField>
      </Grid>

      <Grid item xs={6} style={{ position: "relative" }}>
        <TextField
          label="Category"
          disabled
          id="filled-disabled-category"
          value={newValues.category ? newValues.category : ""}
        ></TextField>
      </Grid>

      <Grid item xs={6} style={{ position: "relative" }}>
        {" "}
        <TextField
          label="Asset Name"
          disabled
          value={
            newValues.asset?.length < 25
              ? newValues.asset
              : newValues.asset?.substring(0, 25).concat(" ...")
          }
          margin="normal"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="standard-number-purchase-quantity"
          label="Purchase Quantity"
          type="number"
          disabled
          error={formValuesErr.purchaseQuantityErr}
          helperText={
            formValuesErr.purchaseQuantityErr
              ? "Purchase Quantity can't be empty"
              : ""
          }
          value={newValues.total_Qty}
          inputProps={{ min: "0", max: "100" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl error={formValuesErr.locationErr}>
          <TreeViewDropDown
            style={{ width: "100%" }}
            value={
              newValues.location === null
                ? ""
                : formApiValues.location.length > 0
                ? newValues.location
                : ""
            }
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
              setLocationID(e);

              setNewChanges({
                ...newChanges,
                location: l[0],
              });

              setNewValues({ ...newValues, location: l[0] });
            }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          id="standard-number-minimum-quantity"
          label="Minimum Quantity"
          type="number"
          value={newValues.min_Qty}
          onChange={(e) => {
            setNewChanges({
              ...newChanges,
              min_Qty: parseFloat(e.target.value),
            });
            setNewValues({
              ...newValues,
              min_Qty: parseFloat(e.target.value),
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
          value={newValues.note}
          onChange={(e) => {
            setNewChanges({
              ...newChanges,
              note: e.target.value,
            });
            setNewValues({
              ...newValues,
              note: e.target.value,
            });
          }}
          multiline
          rows={4}
          variant={"outlined"}
        />
      </Grid>
      <Grid item xs={6}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Purchase Date"
            format="dd/MM/yyyy"
            inputValue={newValues.purchase_Date}
            InputLabelProps={{
              formlabelclasses: {
                asterisk: {
                  color: "#f44336",
                },
              },
            }}
            onChange={(e) => {
              setNewChanges({
                ...newChanges,
                purchase_Date: moment(e)
                  .format("DD-MM-YYYY")
                  .split("T")[0]
                  .replace(/-/gi, "/"),
              });
              setNewValues({
                ...newValues,
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
              checked={newValues.requestable === "yes" ? true : false}
              onChange={(e) => {
                setNewChanges({
                  ...newChanges,
                  requestable: e.target.checked === true ? "yes" : "no",
                });

                setNewValues({
                  ...newValues,
                  requestable: e.target.checked === true ? "yes" : "no",
                });
              }}
              name="checkedA"
            />
          }
          label="Requestable"
        />
      </Grid>

      <Grid
        item
        xs={6}
        style={{ justifyContent: "flex-end", alignItems: "baseline" }}
      >
        {!imgErr && (
          <EditImg
            src={`${
              imgEx
                ? imgEx
                : `${server_path}Uploads/asset-photos/${newValues.asset_ID}.jpg`
            }`}
            alt="asset image"
            title={`asset ${newValues.asset_ID} image`}
            onError={(e) => {
              if (e.target.src.includes(".jpg")) {
                e.target.src = `${server_path}Uploads/asset-photos/${
                  newValues.asset_ID
                }.png?${new Date().getTime()}`;

                return;
              }
              if (e.target.src.includes(".png")) {
                e.target.src = `${server_path}Uploads/asset-photos/${
                  newValues.asset_ID
                }.jpeg?${new Date().getTime()}`;
                return;
              }
              if (e.target.src.includes(".jpeg")) {
                e.target.src = `${server_path}Uploads/asset-photos/${
                  newValues.asset_ID
                }.gif?${new Date().getTime()}`;
                return;
              }

              setImgErr(true);
            }}
          />
        )}

        <input
          id="icon-button-file"
          type="file"
          tabIndex="2"
          onChange={(e) => {
            ValidateFormImage(
              e,
              setOpenSnack,
              openSnack,
              setUrlImg,
              setNewValues,
              newValues,
              setImgEx,
              updateLoading,
              setUpdateLoading
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
            {imgErr ? "Upload" : "Update"}
          </Button>
          <span style={{ marginTop: "7px" }}>
            {urlImg.length < 15
              ? urlImg
              : urlImg.substring(0, 15).concat(" ..")}
          </span>
        </label>
      </Grid>
    </>
  );
}
