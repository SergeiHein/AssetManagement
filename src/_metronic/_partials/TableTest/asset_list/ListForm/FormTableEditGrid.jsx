import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import {
  EditableFormButtonStyles,
  EditableFormStyles,
  EditableInputStyles,
  SelectStyles,
} from "../../../../layout/components/custom/css/FormTableGrid_Styles";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  select: {
    // background: "#87a9ff",
    border: "1px solid #87a9ff",
    borderRadius: "5px",
    maxHeight: "300px",
    "& li": {
      // color: "#fff",
    },
  },
}));

export default function FormTableEditGrid({ formGridPropsValues }) {
  const {
    newValues,
    setNewValues,
    setFormValuesErr,
    openSnack,
    setOpenSnack,
    handleChange,
    selectedEditableID,
    setSelectedEditableID,
    setDialogOpen,
    editFormApiValues,
    CategoryApi,
    formValuesErr,
  } = formGridPropsValues;

  const classes = useStyles();

  return (
    <EditableFormStyles
      onSubmit={(e) => {
        e.preventDefault();
        if (newValues.asset_Status === "") {
          setFormValuesErr({
            status: true,
          });
          return;
        }
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "Updated successfully",
          title: "saved",
        });
        handleChange(newValues, selectedEditableID);
        setDialogOpen(false);
      }}
    >
      <Grid container spacing={3} style={{ margin: "0", width: "100%" }}>
        {(newValues.supplier !== undefined || null) && (
          <Grid item xs={6}>
            <FormControl style={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
              <SelectStyles
                MenuProps={{ classes: { paper: classes.select } }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                onChange={(e) => {
                  const id = editFormApiValues.supplier.find(
                    (one) => one.supplier_Name === e.target.value
                  ).supplier_ID;

                  setNewValues({
                    ...newValues,
                    supplier: e.target.value,
                  });

                  if (!id) return;

                  setSelectedEditableID({
                    ...selectedEditableID,
                    supplier_ID: id,
                  });
                }}
                value={
                  editFormApiValues.supplier.length > 0
                    ? newValues.supplier
                    : ""
                }
              >
                {editFormApiValues.supplier.map((one) => (
                  <MenuItem value={one.supplier_Name} key={one.supplier_ID}>
                    {one.supplier_Name}
                  </MenuItem>
                ))}
              </SelectStyles>
            </FormControl>
          </Grid>
        )}

        {(newValues.brand !== undefined || null) && (
          <Grid item xs={6}>
            <FormControl style={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">Brand</InputLabel>
              <SelectStyles
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                MenuProps={{ classes: { paper: classes.select } }}
                value={
                  editFormApiValues.brand.length > 0 ? newValues.brand : ""
                }
                onChange={(e) => {
                  const id = editFormApiValues.brand.find(
                    (one) => one.brand_Name === e.target.value
                  ).brand_ID;

                  setSelectedEditableID({
                    ...selectedEditableID,
                    brandID: id,
                  });
                  setNewValues({ ...newValues, brand: e.target.value });
                }}
              >
                {editFormApiValues.brand.map((one) => (
                  <MenuItem value={one.brand_Name} key={one.brand_ID}>
                    {one.brand_Name}
                  </MenuItem>
                ))}
              </SelectStyles>
            </FormControl>
          </Grid>
        )}
        {(newValues.asset_Tag !== undefined || null) && (
          <Grid item xs={6}>
            <EditableInputStyles
              style={{ width: "100%", marginTop: "-7px" }}
              disabled={CategoryApi.generate_Code ? true : false}
              id="filled-disabled"
              label="Asset Tag"
              defaultValue={newValues.asset_Tag}
              variant={CategoryApi.generate_Code ? "filled" : "standard"}
              onChange={(e) =>
                setNewValues({ ...newValues, asset_Tag: e.target.value })
              }
            />
          </Grid>
        )}
        {(newValues.model_No !== undefined || null) && (
          <Grid item xs={6}>
            <EditableInputStyles
              label="Model No."
              value={newValues.model_No}
              onChange={(e) =>
                setNewValues({ ...newValues, model_No: e.target.value })
              }
            />
          </Grid>
        )}
        {(newValues.searial_No !== undefined || null) && (
          <Grid item xs={6}>
            <EditableInputStyles
              id="standard-number"
              label="Serial Number"
              onChange={(e) =>
                setNewValues({ ...newValues, searial_No: e.target.value })
              }
              value={newValues.searial_No}
            />
          </Grid>
        )}
        {(newValues.product_Key !== undefined || null) && (
          <Grid item xs={6}>
            <EditableInputStyles
              id="standard-number"
              label="Product Key"
              onChange={(e) =>
                setNewValues({
                  ...newValues,
                  product_Key: e.target.value,
                })
              }
              value={newValues.product_Key}
            />
          </Grid>
        )}
        {(newValues.purchase_Cost !== undefined || null) && (
          <Grid item xs={6}>
            <EditableInputStyles
              type="number"
              label="Cost "
              onChange={(e) =>
                setNewValues({
                  ...newValues,
                  purchase_Cost: parseInt(e.target.value),
                })
              }
              value={newValues.purchase_Cost}
            />
          </Grid>
        )}
        {(newValues.asset_Status !== undefined || null) && (
          <Grid item xs={6}>
            <FormControl style={{ width: "100%" }} error={formValuesErr.status}>
              <InputLabel id="demo-simple-select-label" required>
                Asset Status
              </InputLabel>
              <SelectStyles
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                MenuProps={{ classes: { paper: classes.select } }}
                value={
                  editFormApiValues.asset_Status.length > 0
                    ? newValues.asset_Status
                    : ""
                }
                required
                onChange={(e) => {
                  const id = e.currentTarget.dataset.id;

                  setSelectedEditableID({
                    ...selectedEditableID,
                    asset_Status_ID: parseInt(id),
                  });
                  setFormValuesErr({
                    status: false,
                  });
                  setNewValues({
                    ...newValues,
                    asset_Status: e.target.value,
                  });
                }}
              >
                {editFormApiValues.asset_Status
                  .filter((one) => one.statusType_Name === "Asset Status")
                  .map((one) => (
                    <MenuItem
                      value={one.status_Name}
                      key={one.status_ID}
                      data-id={one.status_ID}
                    >
                      {one.status_Name}
                    </MenuItem>
                  ))}
              </SelectStyles>
              {formValuesErr.status && (
                <FormHelperText>Asset Status can't be empty</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        {(newValues.asset_Condition !== undefined || null) && (
          <Grid item xs={6}>
            <FormControl style={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">
                Asset Condition
              </InputLabel>
              <SelectStyles
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                MenuProps={{ classes: { paper: classes.select } }}
                value={
                  editFormApiValues.status_Condition.length > 0
                    ? newValues.asset_Condition
                    : ""
                }
                onChange={(e) => {
                  const id = e.currentTarget.dataset.id;

                  console.log(id);

                  setSelectedEditableID({
                    ...selectedEditableID,
                    asset_Condition_ID: id,
                  });
                  setFormValuesErr({
                    status: false,
                  });
                  setNewValues({
                    ...newValues,
                    asset_Condition: e.target.value,
                  });
                }}
              >
                {editFormApiValues.status_Condition
                  .filter((one) => one.statusType_Name === "Asset Condition")
                  .map((one) => (
                    <MenuItem
                      value={one.status_Name}
                      key={one.status_ID}
                      data-id={one.status_ID}
                    >
                      {one.status_Name}
                    </MenuItem>
                  ))}
              </SelectStyles>
            </FormControl>
          </Grid>
        )}

        {(newValues.owner_Book_Status !== undefined || null) && (
          <Grid item xs={6}>
            <FormControl style={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">
                Owner Book Status
              </InputLabel>
              <SelectStyles
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                MenuProps={{ classes: { paper: classes.select } }}
                value={
                  editFormApiValues.owner_Book_Status.length > 0
                    ? newValues.owner_Book_Status
                    : ""
                }
                onChange={(e) => {
                  const id = e.currentTarget.dataset.id;

                  // console.log(id);

                  setSelectedEditableID({
                    ...selectedEditableID,
                    owner_Book_Status_ID: parseInt(id),
                  });
                  setNewValues({
                    ...newValues,
                    owner_Book_Status: e.target.value,
                  });
                }}
              >
                {editFormApiValues.owner_Book_Status
                  .filter((one) => one.statusType_Name === "Owner Book Status")
                  .map((one) =>
                    one.statusType_ID === 3 ? (
                      <MenuItem
                        value={one.status_Name}
                        key={one.status_ID}
                        data-id={one.status_ID}
                      >
                        {one.status_Name}
                      </MenuItem>
                    ) : null
                  )}
              </SelectStyles>
            </FormControl>
          </Grid>
        )}

        {(newValues.warranty !== undefined || null) && (
          <Grid item xs={6}>
            <EditableInputStyles
              type="number"
              label="Warranty (years)"
              onChange={(e) =>
                setNewValues({
                  ...newValues,
                  warranty: parseInt(e.target.value),
                })
              }
              value={newValues.warranty}
            />
          </Grid>
        )}

        {(newValues.expiry_Date !== undefined || null) && (
          <Grid
            item
            xs={6}
            style={{
              marginTop: "-15px",
            }}
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Expiry Date"
                format="dd/MM/yyyy"
                // maxDate={new Date()}
                inputValue={newValues.expiry_Date}
                onChange={(e) => {
                  setNewValues({
                    ...newValues,
                    expiry_Date: moment(e)
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
        )}
      </Grid>

      <EditableFormButtonStyles>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{
            minWidth: "120px",
            color: "#fff",
            marginRight: "15px",
          }}
        >
          Save
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setDialogOpen(false);
          }}
          style={{ minWidth: "80px" }}
        >
          Cancel
        </Button>
      </EditableFormButtonStyles>
    </EditableFormStyles>
  );
}
