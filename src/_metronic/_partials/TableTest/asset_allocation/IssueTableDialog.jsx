import React, { useEffect, useContext, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import styled from "styled-components";
import { FormTitle } from "../../../layout/components/custom/FormTitle";
import Grid from "@material-ui/core/Grid";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import { TreeViewDropDown } from "../../../layout/components/custom/css/ListForm_Styles";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { DatePicker, Space } from "antd";
import {
  EditableFormStyles,
  EditableInputStyles,
  EditableFormButtonStyles,
  SelectStyles,
} from "../../../layout/components/custom/css/FormTableGrid_Styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";

const DialogStyles = styled(Dialog)`
  .MuiPaper-root {
    min-width: 60%;
    box-shadow: 0 0 7px 0 rgba(82, 63, 105, 0.15) !important;
  }

  .MuiGrid-item {
    display: flex;
    align-items: flex-end;
  }

  .MuiDialogContent-root {
    padding: 50px 75px;
  }
`;

const FormControlStyles = styled(FormControl)`
  width: 100%;
`;

export default function IssueTableDialog({
  dialogOpen,
  setDialogOpen,
  selectedRow,
  handleEditChange,
}) {
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);

  const [locationTreeview, setLocationTreeview] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState({});

  const [newValues, setNewValues] = useState({ ...selectedRow });

  function handleChange(changes) {
    handleEditChange(newValues.id, {
      ...newValues,
      ...changes,
    });
  }

  // get location treeview api values

  useEffect(() => {
    fetch(`${server_path}api/AssetLocation/LocationTreeView`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const TreeViewData = [...data];
        const setting = [];
        TreeViewData.map((_treeViewData) => {
          if (
            setting.filter((item) => item.id === _treeViewData.Parent_ID)
              .length === 0
          ) {
            setting.push({
              title: _treeViewData.Asset_Location,
              value: _treeViewData.AssetLocation_ID,
              id: _treeViewData.Parent_ID,
              children: [],
            });
          } else {
            setting.map((item, index) => {
              if (item.id === _treeViewData.Parent_ID) {
                setting[index].children.push({
                  title: _treeViewData.Asset_Location,
                  value: _treeViewData.AssetLocation_ID,
                });
              }
            });
          }
        });

        setLocationTreeview(setting);
      });
  }, [server_path, token]);
  return (
    <>
      <DialogStyles
        aria-labelledby="simple-dialog-title"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <FormTitle>Edit Issue</FormTitle>
        <DialogContent>
          <EditableFormStyles
            onSubmit={(e) => {
              e.preventDefault();
              setDialogOpen(false);
              handleChange(newValues);
            }}
          >
            <Grid
              container
              spacing={3}
              style={{ margin: "0 0 25px 0", width: "100%" }}
            >
              <Grid item xs={12} sm={6}>
                <FormControlStyles>
                  <TreeViewDropDown
                    style={{ width: "100%" }}
                    value={newValues.asset_Location}
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: "auto",
                      minWidth: 300,
                      zIndex: 99999,
                    }}
                    treeData={locationTreeview}
                    placeholder="Asset Location*"
                    treeDefaultExpandAll
                    onChange={(e, l) => {
                      if (!e) return;
                      setSelectedTypeId({
                        ...selectedTypeId,
                        location_ID: e,
                      });
                      setNewValues({ ...newValues, asset_Location: l[0] });
                    }}
                  />
                </FormControlStyles>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlStyles>
                  <InputLabel id="demo-simple-select-label">
                    Issue To
                  </InputLabel>
                  <SelectStyles
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newValues.issue_To}
                    onChange={(e) =>
                      setNewValues({ ...newValues, issue_To: e.target.value })
                    }
                  >
                    <MenuItem value="Self">Self</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </SelectStyles>
                </FormControlStyles>
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableInputStyles
                  id="standard-basic"
                  label="Tag Prefix"
                  value={newValues.tag_Prefix}
                  onChange={(e) =>
                    setNewValues({ ...newValues, tag_Prefix: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableInputStyles
                  id="Tag No"
                  label="Tag No"
                  value={newValues.tag_No}
                  onChange={(e) =>
                    setNewValues({ ...newValues, tag_No: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EditableInputStyles
                  id="standard-basic"
                  type="number"
                  label="Issue Quantity"
                  value={newValues.issue_Qty}
                  onChange={(e) =>
                    setNewValues({ ...newValues, issue_Qty: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  showTime
                  onChange={(e, l) => {
                    console.log(l);
                    setNewValues({ ...newValues, issue_Date: l });
                  }}
                  format="DD-MM-YYYY hh:mm:ss"
                  allowClear={false}
                  value={
                    newValues.issue_Date !== ""
                      ? moment(newValues.issue_Date, "DD-MM-YYYY hh:mm:ss")
                      : null
                  }
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "2px solid #c4c4c4",
                  }}
                  popupStyle={{
                    zIndex: 99999,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  allowClear={false}
                  showTime
                  onChange={(e, l) =>
                    setNewValues({ ...newValues, return_Date: l })
                  }
                  format="DD-MM-YYYY hh:mm:ss"
                  value={
                    newValues.return_Date === ""
                      ? ""
                      : moment(newValues.return_Date, "DD-MM-YYYY hh:mm:ss")
                  }
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "2px solid #c4c4c4",
                  }}
                  popupStyle={{
                    zIndex: 99999,
                  }}
                />
              </Grid>
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
        </DialogContent>
      </DialogStyles>
    </>
  );
}
