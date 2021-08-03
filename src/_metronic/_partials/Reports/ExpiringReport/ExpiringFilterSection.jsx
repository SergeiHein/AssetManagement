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
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;

const useStyles = makeStyles((theme) => ({
  select: {
    maxHeight: "250px",
  },
}));

export default function ExpiringFilterSection({
  dateType,
  setDateType,
  formData,
  setFormData,
  DropDownApiValues,
}) {
  // console.log(formData);

  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const classes = useStyles();

  function PickerWithType({ type, onChange }) {
    if (type === "7Days") {
      return (
        <RangePicker
          disabled
          defaultValue={[moment(), moment().add(7, "d")]}
          onChange={onChange}
          format="DD-MM-YYYY"
        />
      );
    } else if (type === "30Days") {
      return (
        <RangePicker
          disabled
          defaultValue={[moment(), moment().add(30, "d")]}
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
              MenuProps={{ classes: { paper: classes.select } }}
              value={formData.category}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  category: e.target.value,
                  ownerBook: "All Owner Books",
                });
              }}
            >
              <MenuItem value="All Categories">All Categories</MenuItem>
              {DropDownApiValues.category?.map((user) => {
                return (
                  <MenuItem value={user} key={user}>
                    {user}
                  </MenuItem>
                );
              })}
            </Select2>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <LabelStyles>
            <p
              style={{ marginBottom: "0px", fontWeight: 700, marginRight: 10 }}
            >
              Warranty Expiry Date :
            </p>
          </LabelStyles>
          <Space>
            <Select
              value={dateType}
              onChange={(e) => {
                if (e === "7Days") {
                  // console.log("7");
                  setFormData({
                    ...formData,
                    fromDate: moment(new Date()).format("DD/MM/YYYY"),
                    toDate: moment()
                      .add(7, "d")
                      .format("DD/MM/YYYY"),
                  });
                } else if (e === "30Days") {
                  setFormData({
                    ...formData,
                    fromDate: moment(new Date()).format("DD/MM/YYYY"),
                    toDate: moment()
                      .add(30, "d")
                      .format("DD/MM/YYYY"),
                  });
                }

                setDateType(e);
              }}
            >
              <Option value="7Days">Next 7 Days</Option>
              <Option value="30Days">Next 30 Days</Option>
              <Option value="month">Month</Option>
              <Option value="year">Year</Option>
              <Option value="date">Date Range</Option>
            </Select>
            <PickerWithType
              type={dateType}
              onChange={(value) => {
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
            <InputLabel id="demo-simple-select-label">Asset</InputLabel>
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
              {DropDownApiValues.assets.map((val) => {
                return (
                  <MenuItem value={val} key={val}>
                    {val}
                  </MenuItem>
                );
              })}
            </Select2>
          </FormControl>
        </Grid>
        {formData.category === "Vehicle" ? (
          <Grid item xs={6}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                Owner Book Status
              </InputLabel>
              <Select2
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                MenuProps={{ classes: { paper: classes.select } }}
                value={formData.ownerBook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ownerBook: e.target.value,
                  })
                }
              >
                <MenuItem value="All Owner Books">All OwnerBooks</MenuItem>
                {DropDownApiValues.ownerBook
                  .filter((one) => one.statusType_Name === "Owner Book Status")
                  .map((one) => (
                    <MenuItem
                      value={one.status_Name}
                      key={one.status_ID}
                      data-id={one.status_ID}
                    >
                      {one.status_Name}
                    </MenuItem>
                  ))}
              </Select2>
            </FormControl>
          </Grid>
        ) : null}
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
              {DropDownApiValues.location.map((asset) => {
                return (
                  <MenuItem
                    value={asset.AssetLocation_ID}
                    key={asset.AssetLocation_ID}
                  >
                    {asset.Asset_Location}
                  </MenuItem>
                );
              })}
            </Select2>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">
              Asset Condition
            </InputLabel>
            <Select2
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              MenuProps={{ classes: { paper: classes.select } }}
              value={formData.condition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition: e.target.value,
                })
              }
            >
              <MenuItem value="All Conditions">All Conditions</MenuItem>
              {DropDownApiValues.assetCondition
                .filter((one) => one.statusType_Name === "Asset Condition")
                .map((one) => (
                  <MenuItem value={one.status_Name} key={one.status_ID}>
                    {one.status_Name}
                  </MenuItem>
                ))}
            </Select2>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Asset Status</InputLabel>
            <Select2
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              MenuProps={{ classes: { paper: classes.select } }}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <MenuItem value="All Status">All Status</MenuItem>
              {DropDownApiValues.assetStatus
                .filter((one) => one.statusType_Name === "Asset Status")
                .map((one) => (
                  <MenuItem value={one.status_Name} key={one.status_ID}>
                    {one.status_Name}
                  </MenuItem>
                ))}
            </Select2>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}
