import React from "react";
import moment from "moment";
import { DatePicker, Select, Space } from "antd";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select2 from "@material-ui/core/Select";
import styled from "styled-components";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";

const LabelStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const useStyles = makeStyles((theme) => ({
  select: {
    maxHeight: "250px",
  },
}));

export default function BranchFilteredSection({
  dateType,
  setDateType,
  formData,
  setFormData,
  formApiValues,
}) {
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const classes = useStyles();

  // console.log(formData);

  function PickerWithType({ type, onChange }) {
    if (type === "7Days") {
      // console.log("7");
      return (
        <RangePicker
          disabled
          defaultValue={[moment().subtract(7, "d"), moment()]}
          onChange={onChange}
          format="DD-MM-YYYY"
        />
      );
    } else if (type === "30Days") {
      return (
        <RangePicker
          disabled
          defaultValue={[moment().subtract(30, "d"), moment()]}
          onChange={onChange}
          format="DD-MM-YYYY"
        />
      );
    } else if (type === "date") {
      return (
        <RangePicker
          picker={type}
          onChange={onChange}
          format="DD-MM-YYYY"
          value={[
            moment(formData.fromDate, "DD/MM/YYYY"),
            moment(formData.toDate, "DD/MM/YYYY"),
          ]}
        />
      );
    }

    return (
      <RangePicker
        picker={type}
        onChange={onChange}
        value={[
          moment(formData.fromDate, "DD/MM/YYYY"),
          moment(formData.toDate, "DD/MM/YYYY"),
        ]}
      />
    );
  }
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select2
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <MenuItem value="All Categories">All Categories</MenuItem>
              {formApiValues.categories.map((category) => {
                return (
                  <MenuItem
                    value={category.category_ID}
                    key={category.category_Name}
                  >
                    {category.category_Name}
                  </MenuItem>
                );
              })}
              {/* <MenuItem value="All Events">All Events</MenuItem>
              <MenuItem value="Log in">Log in</MenuItem>
              <MenuItem value="Log out">Log out</MenuItem>
              <MenuItem value="View">View</MenuItem>
              <MenuItem value="Entry">Entry</MenuItem>
              <MenuItem value="Edit">Edit</MenuItem>
              <MenuItem value="Delete">Delete</MenuItem>
              <MenuItem value="Request">Request</MenuItem>
              <MenuItem value="Issue">Issue</MenuItem>
              <MenuItem value="Cancel">Cancel</MenuItem>
              <MenuItem value="Return">Return</MenuItem>
              <MenuItem value="Transfer">Transfer</MenuItem> */}
            </Select2>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <LabelStyles>
            <p style={{ marginBottom: "0px", fontWeight: 700 }}>Issue Date :</p>
          </LabelStyles>
          <Space>
            <Select
              value={dateType}
              onChange={(e) => {
                if (e === "7Days") {
                  console.log("7");
                  setFormData({
                    ...formData,
                    fromDate: moment()
                      .subtract(7, "d")
                      .format("DD/MM/YYYY"),
                    toDate: moment(new Date()).format("DD/MM/YYYY"),
                  });
                } else if (e === "30Days") {
                  setFormData({
                    ...formData,
                    fromDate: moment()
                      .subtract(30, "d")
                      .format("DD/MM/YYYY"),
                    toDate: moment(new Date()).format("DD/MM/YYYY"),
                  });
                }

                setDateType(e);
              }}
            >
              <Option value="7Days">Last 7 Days</Option>
              <Option value="30Days">Last 30 Days</Option>
              <Option value="month">Month</Option>
              <Option value="year">Year</Option>
              <Option value="date">Date</Option>
            </Select>
            <PickerWithType
              type={dateType}
              onChange={(value) => {
                console.log(value);
                setFormData({
                  ...formData,
                  fromDate: moment(value?.[0]).format("DD/MM/YYYY"),
                  toDate: moment(value?.[1]).format("DD/MM/YYYY"),
                });
              }}
            />
          </Space>
        </Grid>

        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Assets</InputLabel>
            <Select2
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              MenuProps={{ classes: { paper: classes.select } }}
              value={formData.asset}
              onChange={(e) =>
                setFormData({ ...formData, asset: e.target.value })
              }
            >
              <MenuItem value="All Assets">All Assets</MenuItem>
              {formApiValues.assets.map((asset) => {
                return (
                  <MenuItem value={asset} key={asset}>
                    {asset}
                  </MenuItem>
                );
              })}
            </Select2>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">User</InputLabel>
            <Select2
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              MenuProps={{ classes: { paper: classes.select } }}
              value={formData.user}
              onChange={(e) =>
                setFormData({ ...formData, user: e.target.value.toString() })
              }
            >
              <MenuItem value="All Users">All Users</MenuItem>
              {formApiValues.users?.map((user) => {
                return (
                  <MenuItem value={user.employee_ID} key={user.employee_ID}>
                    {user.employee_Name}
                  </MenuItem>
                );
              })}
            </Select2>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Location</InputLabel>
            <Select2
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              MenuProps={{ classes: { paper: classes.select } }}
              value={formData.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: e.target.value.toString(),
                })
              }
            >
              <MenuItem value="All Locations">All Locations</MenuItem>
              {formApiValues.location.map((asset) => {
                return (
                  <MenuItem
                    value={asset.asset_Location_ID}
                    key={asset.asset_Location_ID}
                  >
                    {asset.asset_Location_Name}
                  </MenuItem>
                );
              })}
            </Select2>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}
