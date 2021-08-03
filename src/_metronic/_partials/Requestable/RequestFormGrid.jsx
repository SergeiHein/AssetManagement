import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import Checkbox from "@material-ui/core/Checkbox";
import MakeTreeview from "../../layout/components/custom/MakeTreeview";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";

const RequestFormStyles = styled.form`
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

const useStyles = makeStyles((theme) => ({
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

const RequestFormBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export default function RequestFormGrid({ requestFormPropValues }) {
  const {
    handleRequestFormSubmit,
    checked,
    handleCheckedChange,
    formValuesErr,
    setFormValuesErr,
    newValues,
    setNewValues,
    showTreeview,
    selectedID,
    setSelectedID,
    formApiValues,
    setDialogOpen,
    setEmployeeList,
    employeeList,
  } = requestFormPropValues;
  const classes = useStyles();

  return (
    <RequestFormStyles onSubmit={handleRequestFormSubmit}>
      <Grid
        container
        spacing={3}
        style={{ margin: "0 0 25px 0", width: "100%" }}
      >
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleCheckedChange}
                name="checkedB"
                color="primary"
              />
            }
            label="For Myself"
          />
        </Grid>
        {!checked && (
          <Grid item xs={6}>
            <FormControl
              style={{ width: "100%" }}
              error={formValuesErr.company}
            >
              <InputLabel id="demo-simple-select-label" required>
                Company
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                MenuProps={{ classes: { paper: classes.select } }}
                value={newValues.company}
                required
                onChange={(e) => {
                  const id = e.currentTarget.dataset.id;

                  setSelectedID({
                    ...selectedID,
                    company_ID: parseInt(id),
                  });
                  setFormValuesErr({
                    ...formValuesErr,
                    company: false,
                  });
                  setNewValues({ ...newValues, company: e.target.value });
                }}
              >
                {formApiValues.company.map((one) => (
                  <MenuItem
                    value={one.company_Name}
                    key={one.company_ID}
                    data-id={one.company_ID}
                  >
                    {one.company_Name}
                  </MenuItem>
                ))}
              </Select>
              {formValuesErr.company && (
                <FormHelperText>Company can't be empty</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        <Grid item xs={6}>
          <TextField
            id="standard-number"
            label="Request Quantity"
            type="number"
            required
            error={formValuesErr.request_Qty}
            helperText={
              formValuesErr.request_Qty ? "Request Quantity can't be empty" : ""
            }
            style={{ width: "100%" }}
            value={newValues.request_Qty}
            onChange={(e) => {
              setFormValuesErr({
                ...formValuesErr,
                request_Qty: false,
              });
              setNewValues({
                ...newValues,
                request_Qty: parseFloat(e.target.value),
              });
            }}
            inputProps={{ min: "0", max: "100" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        {!checked && (
          <Grid item xs={6} className="mid-grid">
            <FormControl
              style={{ width: "100%" }}
              error={formValuesErr.location}
            >
              <InputLabel id="demo-simple-select-label" required>
                Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                required
                MenuProps={{ classes: { paper: classes.select } }}
                value={newValues.location}
                onChange={(e) => {
                  const id = e.currentTarget.dataset.id;
                  setSelectedID({
                    ...selectedID,
                    asset_Location_ID: parseInt(id),
                  });
                  setFormValuesErr({
                    ...formValuesErr,
                    location: false,
                  });
                  setNewValues({ ...newValues, location: e.target.value });
                }}
              >
                {Array.isArray(formApiValues.location) ? (
                  formApiValues.location.map((one) => (
                    <MenuItem
                      value={one.location_Name}
                      key={one.location_ID}
                      data-id={one.location_ID}
                    >
                      {one.location_Name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem
                    value={formApiValues.location.location_Name}
                    key={formApiValues.location.location_ID}
                    data-id={formApiValues.location.location_ID}
                  >
                    {formApiValues.location.location_Name}
                  </MenuItem>
                )}
              </Select>

              {formValuesErr.location && (
                <FormHelperText>Location can't be empty</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        <Grid item xs={6}>
          <TextField
            id="outlined-multiline-static"
            label="Reason"
            style={{ width: "100%" }}
            value={newValues.request_Reason}
            onChange={(e) =>
              setNewValues({
                ...newValues,
                request_Reason: e.target.value,
              })
            }
            multiline
            rows={4}
            variant="outlined"
          />
        </Grid>
        {!checked && (
          <Grid item xs={6}>
            <FormControl style={{ width: "100%" }} error={formValuesErr.branch}>
              <InputLabel id="demo-simple-select-label" required>
                Branch
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={newValues.branch}
                MenuProps={{ classes: { paper: classes.select } }}
                required
                onChange={(e) => {
                  const id = e.currentTarget.dataset.id;

                  setSelectedID({
                    ...selectedID,
                    branch_ID: parseInt(id),
                  });
                  setFormValuesErr({
                    ...formValuesErr,
                    branch: false,
                  });
                  setNewValues({ ...newValues, branch: e.target.value });
                }}
              >
                {formApiValues.branch.map((one) => (
                  <MenuItem
                    value={one.branch_Name}
                    key={one.branch_ID}
                    data-id={one.branch_ID}
                  >
                    {one.branch_Name}
                  </MenuItem>
                ))}
              </Select>
              {formValuesErr.branch && (
                <FormHelperText>Branch can't be empty</FormHelperText>
              )}
            </FormControl>
          </Grid>
        )}

        {!checked && (
          <Grid item xs={12}>
            <MakeTreeview
              showTreeview={showTreeview}
              company_ID={selectedID.company_ID}
              checked={checked}
              setEmployeeList={setEmployeeList}
              employeeList={employeeList}
            ></MakeTreeview>
          </Grid>
        )}
      </Grid>
      <RequestFormBtn>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{
            minWidth: "120px",
            marginRight: "15px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          Request
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
      </RequestFormBtn>
    </RequestFormStyles>
  );
}
