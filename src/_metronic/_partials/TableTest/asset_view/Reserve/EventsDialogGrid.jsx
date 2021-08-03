import React from "react";
import {
  DialogStyles,
  GridContainerStyles,
  FormStyles,
  SubmitBtn,
} from "./ReserveDialogStyles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import { TreeViewDropDown } from "../../../../layout/components/custom/css/ListForm_Styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Alert, AlertTitle } from "@material-ui/lab";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import styled from "styled-components";

const SubmitStyles = styled(Grid)`
  width: 100%;
  margin-top: 20px;
`;

const useStyles = makeStyles((theme) => ({
  select: {
    maxHeight: "250px",
  },
}));

export default function EventsDialogGrid({ gridPropValues }) {
  const {
    formValues,
    setFormValues,
    errorMsg,
    dialogOpen,
    handleEditEvent,
    handleDeleteEvent,
    handleTitleChange,
    handleDateChangeFrom,
    handleDateChangeTo,
    handleTimeChangeFrom,
    handleTimeChangeTo,
    handleLocationChange,
    handleIssueToChange,
    setSelectedID,
    dropdownValues,
    issueToValues,
    handleTimeEditEvent,
  } = gridPropValues;
  const classes = useStyles();

  function generateTreeview() {
    return (
      <>
        <Grid style={{ margin: " 0 0 20px 0", position: "relative" }}>
          <FormControl error={errorMsg.location}>
            <TreeViewDropDown
              style={{ width: "100%", marginRight: 9 }}
              dropdownStyle={{
                maxHeight: 400,
                overflow: "auto",
                minWidth: 300,
                zIndex: 9999,
              }}
              treeData={dropdownValues.location}
              value={formValues.location ? formValues.location : null}
              placeholder="Please select"
              onChange={handleLocationChange}
            />
          </FormControl>
          {errorMsg.location && (
            <FormHelperText
              color="primary"
              style={{
                color: "#f44336",
                position: "absolute",
                top: "100%",
              }}
            >
              *Asset Location cannot be empty
            </FormHelperText>
          )}
        </Grid>
        <Grid>
          <FormControl className="extra-root">
            <InputLabel id="demo-simple-select-label">Issue To</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formValues.issueTo}
              MenuProps={{ classes: { paper: classes.select } }}
              onChange={handleIssueToChange}
            >
              {issueToValues.map((data) => (
                <MenuItem key={data.employee_ID} value={data.employee_ID}>
                  {data.employee_Name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </>
    );
  }

  function generateOverlapError() {
    return (
      <Grid>
        <Alert severity="error">
          <AlertTitle>Already Reserved</AlertTitle>
          Chosen date is already reserved —{" "}
          <strong>Please choose different dates.</strong>
        </Alert>
      </Grid>
    );
  }

  return (
    <GridContainerStyles container spacing={3}>
      {dialogOpen.title === "edit" ? (
        <>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="From Date"
                error={errorMsg.fromDate}
                helperText={
                  errorMsg.fromDate
                    ? "From Date can't be later than To Date"
                    : ""
                }
                format="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={moment().add(1, "y")}
                value={formValues.selectedFromDate}
                onChange={handleDateChangeFrom}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardDatePicker
                margin="normal"
                id="selectedToDate"
                label="To Date"
                format="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={moment().add(1, "y")}
                value={formValues.selectedToDate}
                onChange={handleDateChangeTo}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid>
            <TextField
              label="Enter New Event Title"
              id="filled-disabled-type"
              value={formValues.note}
              style={{ marginBottom: "25px" }}
              onChange={(e) => handleTitleChange(e)}
              error={errorMsg.title}
              helperText={errorMsg.title ? "Title can't be empty" : ""}
            ></TextField>
          </Grid>
          {generateTreeview()}
          {errorMsg.overlap && generateOverlapError()}

          <Grid item style={{ width: "100%" }}>
            <SubmitBtn
              variant="contained"
              color="secondary"
              onClick={handleEditEvent}
            >
              Save event
            </SubmitBtn>
          </Grid>

          <Grid item style={{ width: "100%" }}>
            <SubmitBtn
              variant="contained"
              onClick={handleDeleteEvent}
              style={{ background: "rgba(244,67,54,0.7)", color: "#fff" }}
            >
              Delete event
            </SubmitBtn>
          </Grid>
        </>
      ) : dialogOpen.title === "timeEdit" ? (
        <>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="From Date"
                error={errorMsg.fromDate}
                helperText={
                  errorMsg.fromDate
                    ? "From Date can't be later than To Date"
                    : ""
                }
                format="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={moment().add(1, "y")}
                value={formValues.selectedFromDate}
                onChange={handleDateChangeFrom}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                error={errorMsg.fromTime}
                helperText={
                  errorMsg.fromTime
                    ? "From Time can't be earlier than To Time"
                    : ""
                }
                label="From Time"
                value={formValues.selectedFromTime}
                onChange={handleTimeChangeFrom}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="To Time"
                value={formValues.selectedToTime}
                onChange={handleTimeChangeTo}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Grid>
            <TextField
              label="Enter New Event Title"
              id="filled-disabled-type"
              value={formValues.note}
              style={{ marginBottom: "25px" }}
              onChange={(e) => handleTitleChange(e)}
              error={errorMsg.title}
              helperText={errorMsg.title ? "Title can't be empty" : ""}
            ></TextField>
          </Grid>
          {generateTreeview()}
          {errorMsg.overlap && generateOverlapError()}

          <Grid item style={{ width: "100%" }}>
            <SubmitBtn
              variant="contained"
              color="secondary"
              onClick={handleTimeEditEvent}
            >
              Save event
            </SubmitBtn>
          </Grid>

          <Grid item style={{ width: "100%" }}>
            <SubmitBtn
              variant="contained"
              onClick={handleDeleteEvent}
              style={{ background: "rgba(244,67,54,0.7)", color: "#fff" }}
            >
              Delete event
            </SubmitBtn>
          </Grid>
        </>
      ) : dialogOpen.title === "entry" ? (
        <>
          {generateTreeview()}
          <Grid>
            <TextField
              label="Note"
              id="filled-disabled-type"
              value={formValues.note}
              onChange={(e) => handleTitleChange(e)}
              error={errorMsg.title}
              helperText={errorMsg.title ? "Title can't be empty" : ""}
            ></TextField>
          </Grid>
          {errorMsg.overlap && generateOverlapError()}
          <SubmitStyles>
            <SubmitBtn variant="contained" color="secondary" type="submit">
              Add event
            </SubmitBtn>
          </SubmitStyles>
        </>
      ) : dialogOpen.title === "custom month entry" ? (
        <>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="From Date"
                error={errorMsg.fromDate}
                helperText={
                  errorMsg.fromDate
                    ? "From Date can't be later than To Date"
                    : ""
                }
                format="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={moment().add(1, "y")}
                value={formValues.selectedFromDate}
                onChange={handleDateChangeFrom}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardDatePicker
                margin="normal"
                id="selectedToDate"
                label="To Date"
                format="dd/MM/yyyy"
                minDate={new Date()}
                maxDate={moment().add(1, "y")}
                value={formValues.selectedToDate}
                onChange={handleDateChangeTo}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {generateTreeview()}
          <Grid>
            <TextField
              label="Note"
              id="filled-disabled-type"
              value={formValues.note}
              onChange={(e) => handleTitleChange(e)}
              error={errorMsg.title}
              helperText={errorMsg.title ? "Title can't be empty" : ""}
            ></TextField>
          </Grid>
          {errorMsg.overlap && generateOverlapError()}

          <SubmitStyles>
            <SubmitBtn variant="contained" color="secondary" type="submit">
              Add event
            </SubmitBtn>
          </SubmitStyles>
        </>
      ) : (
        <>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Date"
                error={errorMsg.fromDate}
                helperText={errorMsg.fromDate ? "From Date can't be empty" : ""}
                format="dd/MM/yyyy"
                minDate={moment()
                  .subtract(1, "y")
                  .format("DD/MM/YYYY")}
                maxDate={moment().add(1, "y")}
                value={formValues.selectedFromDate}
                onChange={handleDateChangeFrom}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                error={errorMsg.fromTime}
                helperText={
                  errorMsg.fromTime
                    ? "From Time can't be earlier than To Time"
                    : ""
                }
                label="From Time"
                value={formValues.selectedFromTime}
                onChange={handleTimeChangeFrom}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="To Time"
                value={formValues.selectedToTime}
                onChange={handleTimeChangeTo}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {generateTreeview()}

          <Grid>
            <TextField
              label="Enter Event Title"
              id="filled-disabled-type"
              value={formValues.note}
              onChange={(e) => handleTitleChange(e)}
              error={errorMsg.title}
              helperText={errorMsg.title ? "Title can't be empty" : ""}
            ></TextField>
          </Grid>
          <SubmitStyles>
            <SubmitBtn variant="contained" color="secondary" type="submit">
              Add event
            </SubmitBtn>
          </SubmitStyles>
        </>
      )}
    </GridContainerStyles>
  );
}
