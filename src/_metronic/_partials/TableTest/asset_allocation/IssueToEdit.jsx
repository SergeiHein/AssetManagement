import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import { TreeViewDropDown } from "../../../layout/components/custom/css/ListForm_Styles";
import moment from "moment";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { DatePicker, Form } from "antd";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const TreeviewForm = styled(Form.Item)`
  margin-bottom: 0px !important;
  .ant-form-item-explain-error {
    font-size: 10px !important;
  }
`;

const DetailStyles = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgba(54, 153, 255, 0.5) !important;
  transition: all 300ms;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: rgba(54, 153, 255, 0.8) !important;
  }
`;

const useStyles = makeStyles({
  Donebtn: {
    minWidth: 20,
    marginRight: 10,
  },
  Clearbtn: {
    minWidth: 20,
    marginLeft: 10,
  },
});

const TableBodyRow = styled(TableRow)`
  .actions {
    min-width: 120px;
  }

  .location {
    min-width: 120px;
    max-width: 150px;
  }

  .issue-to {
    min-width: 120px;
    max-width: 150px;
  }

  .tag-prefix {
    min-width: 90px;
  }

  .tag-no {
    min-width: 90px;
  }

  .issue-qty {
    min-width: 90px;
  }

  .issue-date {
    min-width: 190px;
    max-width: 200px;
  }

  .return-date {
    min-width: 190px;
    max-width: 200px;
  }

  @media (max-width: 600px) {
    .issue-to {
      min-width: 100px;
      max-width: 125px;
    }

    .issue-qty {
      min-width: 50px;
      max-width: 70px;
    }
  }
`;

const TreeviewDropdownStyles = styled(TreeViewDropDown)`
  width: 100%;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export default function IssueToEdit({
  EditRow,
  setEditId,
  EditId,
  handleEditChange,
  request_ID,
  openSnack,
  setOpenSnack,
  issues,
  otherIssues,
  selectedIndex,
  dialogOpen,
  setDialogOpen,
  newChanges,
  setNewChanges,
  editClicked,
  setEditClicked,
}) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [newValues, setNewValues] = useState({ ...EditRow });
  const selectedRowID = EditId;
  const [issueToApiValues, setIssueToApiValues] = useState([]);
  const [issueToValues, setIssueToValues] = useState([]);
  const [testState, setTestState] = useState({
    assetLocation_ID: "",

    employee_ID: "",
    tag_Prefix: "",
    tag_No: "",
    issue_Qty: "",
    issue_Date: "",
    return_Date: "",
  });

  const [LocationTreeViewData, setLocationTreeViewData] = useState({
    location: [],
    oriLocation: [],
  });

  const [formValuesErr, setFormValuesErr] = useState({
    locationErr: false,
    empErr: false,
    tag_PrefixErr: false,
    tag_NoErr: false,
  });

  const locationDetail = LocationTreeViewData.oriLocation.find(
    (l) => l.asset_Location === newValues.asset_Location
  );

  function handleChange(changes) {
    handleEditChange(selectedRowID, {
      ...newValues,
      ...changes,
    });
  }

  useEffect(() => {
    if (newValues.isCategoryGenerate_Code === 1 && newValues.issue_Qty === 0) {
      newValues.issue_Qty = 1;
    }
  }, [newValues.isCategoryGenerate_Code, newValues.issue_Qty]);

  useEffect(() => {
    if (locationDetail) {
      newValues.tag_Prefix = locationDetail.tag_Prefix;
    }
  }, [locationDetail, newValues.tag_Prefix]);

  useEffect(() => {
    if (locationDetail?.location_TypeName.toLowerCase() === "section") {
      setIssueToValues(
        issueToApiValues?.filter(
          (val) => val.section_Name === locationDetail.asset_Location
        )
      );
    } else if (
      locationDetail?.location_TypeName.toLowerCase() === "department"
    ) {
      setIssueToValues(
        issueToApiValues?.filter(
          (val) => val.department_Name === locationDetail.asset_Location
        )
      );
    } else if (locationDetail?.location_TypeName.toLowerCase() === "branch") {
      setIssueToValues(
        issueToApiValues?.filter(
          (val) => val.branch_Name === locationDetail.asset_Location
        )
      );
    } else if (locationDetail?.location_TypeName.toLowerCase() === "location") {
      setIssueToValues(
        issueToApiValues?.filter(
          (val) => val.location_Name === locationDetail.asset_Location
        )
      );
    }
  }, [locationDetail, issueToApiValues]);

  useEffect(() => {
    fetch(
      `${server_path}api/AssetLocation/GetAssetLocationByRequestID?RequestID=${request_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((arr) => {
        const TreeViewData = [...arr];
        const TreeView = [];
        TreeViewData.map((_treeViewData) => {
          if (
            TreeView.filter((item) => item.id === _treeViewData.parent_ID)
              .length === 0
          ) {
            TreeView.push({
              title: _treeViewData.asset_Location,
              value: _treeViewData.assetLocation_ID,
              id: _treeViewData.parent_ID,
              children: [],
            });
          } else {
            TreeView.map((item, index) => {
              if (item.id === _treeViewData.parent_ID) {
                TreeView[index].children.push({
                  title: _treeViewData.asset_Location,
                  value: _treeViewData.assetLocation_ID,
                });
              }

              return false;
            });
          }

          return false;
        });

        setLocationTreeViewData((prev) => {
          return {
            ...prev,
            location: TreeView,
            oriLocation: arr,
          };
        });
      });
  }, [server_path, token, request_ID]);

  useEffect(() => {
    if (request_ID) {
      fetch(
        `${server_path}api/Allocation/GetAllocationEmployeeList?Request_ID=${request_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setIssueToApiValues(data);
        });
    }
  }, [token, server_path, request_ID]);

  return (
    <TableBodyRow>
      <TableCell align="center" className="actions">
        <Button
          className={classes.Donebtn}
          color="primary"
          type="submit"
          size="small"
          onClick={() => {
            if (newValues.asset_Location === "" || !newValues.asset_Location) {
              setOpenSnack({
                ...openSnack,
                openSnackOpen: true,
                message: "Location can't be empty",
                title: "error",
              });

              return;
            }

            if (newValues.issue_To === "" || !newValues.issue_To) {
              setOpenSnack({
                ...openSnack,
                openSnackOpen: true,
                message: "Employee can't be empty",
                title: "error",
              });

              return;
            }
            if (newValues.tag_Prefix === "" || !newValues.tag_Prefix) {
              setOpenSnack({
                ...openSnack,
                openSnackOpen: true,
                message: "Tag Prefix can't be empty",
                title: "error",
              });

              return;
            }

            if (newValues.issue_Qty <= 0) {
              setOpenSnack({
                ...openSnack,
                openSnackOpen: true,
                message: "Issue Quantity can't be empty",
                title: "error",
              });
              return;
            }

            const copyOtherIssues = [...otherIssues];

            copyOtherIssues.splice(selectedIndex, 1);

            const sum = copyOtherIssues.reduce((all, one) => {
              return all + one;
            }, 0);

            if (parseInt(newValues.issue_Qty) + sum > issues) {
              setOpenSnack({
                ...openSnack,
                openSnackOpen: true,
                message: "Issue qty is exceeding maximum requests",
                title: "error",
              });

              return;
            }

            setEditClicked(false);

            setNewChanges((prev) => {
              return [
                ...prev,

                {
                  ...testState,
                  issue_ID: newValues.issue_ID,
                  time: new Date(),
                },
              ];
            });

            handleChange(newValues);
            setEditId(null);
          }}
        >
          <DoneIcon />
        </Button>
        <Button
          className={classes.Clearbtn}
          color="secondary"
          size="small"
          onClick={() => {
            setEditId(null);
            setEditClicked(false);
          }}
        >
          <ClearIcon />
        </Button>
      </TableCell>
      <TableCell
        align="center"
        style={{
          minWidth: "80px",
        }}
      >
        <span
          style={{
            cursor: "pointer",
            color: "grey",
            textDecoration: "underline",
          }}
          onClick={() => {
            setDialogOpen({
              ...dialogOpen,
              open: true,
              Id: newValues.asset_Detail_ID,
            });
          }}
        >
          <Tooltip title="View Detail">
            <DetailStyles>
              <InfoIcon fontSize="small" />
            </DetailStyles>
          </Tooltip>
        </span>
      </TableCell>
      <TableCell className="location">
        <TreeviewForm>
          <TreeviewDropdownStyles
            value={newValues.asset_Location}
            dropdownStyle={{
              maxHeight: 400,
              overflow: "auto",
              minWidth: 300,
              zIndex: 9999,
              fontSize: "12px",
            }}
            treeData={LocationTreeViewData.location}
            placeholder="Asset Location*"
            treeDefaultExpandAll
            onChange={(e, l) => {
              setTestState({ ...testState, assetLocation_ID: l[0] });
              setNewValues({
                ...newValues,
                asset_Location: l[0],
                location_ID: e,
              });
            }}
          />
        </TreeviewForm>
      </TableCell>
      <TableCell align="center" className="issue-to">
        <FormControl style={{ width: "100%" }}>
          <Select
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newValues.issue_To ? newValues.issue_To : ""}
            onChange={(e) => {
              setTestState({
                ...testState,
                employee_ID: parseInt(e.currentTarget.dataset.id),
              });
              setNewValues({
                ...newValues,
                issue_To: e.target.value,
                employee_ID: parseInt(e.currentTarget.dataset.id),
              });
            }}
          >
            {issueToValues.map((val) => {
              return (
                <MenuItem
                  value={val.employee_Name}
                  key={val.employee_ID}
                  data-id={val.employee_ID}
                >
                  {val.employee_Name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>{" "}
      </TableCell>
      <TableCell align="center" className="tag-prefix">
        <TextField
          error={formValuesErr.tag_PrefixErr}
          id="Tag Prefix"
          disabled={newValues.isCategoryGenerate_Code === 1 ? true : false}
          helperText={`${
            formValuesErr.tag_PrefixErr ? "Tag Prefix can't be empty" : ""
          }`}
          value={newValues.tag_Prefix ? newValues.tag_Prefix : ""}
          onChange={(e) => {
            setFormValuesErr({
              ...formValuesErr,
              tag_PrefixErr: false,
            });
            setTestState({ ...testState, tag_Prefix: e.target.value });
            setNewValues({ ...newValues, tag_Prefix: e.target.value });
          }}
        />
      </TableCell>
      <TableCell align="center" className="tag-no">
        <TextField
          id="Tag No"
          disabled
          value={newValues.tag_No}
          onChange={(e) => {
            setTestState({ ...testState, tag_No: e.target.value });
            setNewValues({ ...newValues, tag_No: e.target.value });
          }}
        />
      </TableCell>
      <TableCell align="center" className="issue-qty">
        <TextField
          error={formValuesErr.issue_QtyErr}
          helperText={`${
            formValuesErr.issue_QtyErr ? "Issue Quantity can't be empty" : ""
          }`}
          id="Issue Qty"
          disabled={newValues.isCategoryGenerate_Code === 1 ? true : false}
          value={newValues.issue_Qty}
          type="number"
          onChange={(e) => {
            setFormValuesErr({
              ...formValuesErr,
              issue_QtyErr: false,
            });
            setTestState({ ...testState, issue_Qty: parseInt(e.target.value) });
            setNewValues({ ...newValues, issue_Qty: parseInt(e.target.value) });
          }}
        />
      </TableCell>
      <TableCell align="center" className="issue-date">
        <DatePicker
          showTime
          onChange={(e, l) => {
            setTestState({ ...testState, issue_Date: l });
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
      </TableCell>
      <TableCell align="center" className="return-date">
        <DatePicker
          allowClear={false}
          showTime
          onChange={(e, l) => {
            setTestState({ ...testState, return_Date: l });
            setNewValues({ ...newValues, return_Date: l });
          }}
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
      </TableCell>
    </TableBodyRow>
  );
}
