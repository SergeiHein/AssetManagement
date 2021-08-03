import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useSubheader } from "../../../../layout";
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select2 from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment";
// import { DatePicker, Select, Space } from "antd";
import {
  Picker,
  CheckBoxLabel,
} from "../../../../layout/components/custom/css/RequestedIndex_Styles";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import MakeTableData from "./MakeTableData";
import MakeTable from "./MakeTable";
import { KTCookie } from "../../../../../_metronic/_assets/js/components/cookie";
import { appsetting } from "../../../../../envirment/appsetting";
import { TokenContext } from "../../../../../app/BasePage";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import DetailDialog from "../../asset_allocation/DetailDialog";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import {
  TreeViewDropDown,
  IssueDropDown,
} from "../../../../layout/components/custom/css/ListForm_Styles";
// import { IssueDropDown } from "../../../../layout/components/custom/css/ListForm_Styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  formControl: {
    width: "85%",
    marginTop: 20,
  },
  text: {
    marginTop: 13,
    fontWeight: 700,
  },
  Note: {
    width: "61%",
    marginRight: 13,
  },
  savebtn: {
    height: "30px",
    width: "200px",
    color: "#fff",
  },

  cancelbtn: {
    marginLeft: "20px",
    height: "30px",
    width: "10%",
  },
  select: {
    maxHeight: 300,
  },
}));

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

const IssueForm = styled.div`
  position: relative;
  width: 80%;
  margin: 0 auto 50px auto;
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  background: #fff;
`;

const LeftGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  margin-bottom: 30px;
`;

const RightGrid = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-space-between;
  margin-top: 20px;
`;

const SubRightGrid = styled.div`
  display: flex;
  width: 90%;
  margin: auto;
  margin: 20px 0 30px 0;
  justify-content: flex-start;
`;
const SubRightText = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: auto;
  margin: 30px 0 30px 0;
`;

const Checkarea = styled.div`
  width: 90%;
  margin-top: 15px;
`;
const Buttonarea = styled.div`
  margin: 20px 0 40px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SignBox = styled.div`
  width: 81%;
  margin: 15px auto;
`;

export default function MultiIssue(props) {
  const classes = useStyles();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Multi Issue");
  const history = useHistory();
  const { Option } = IssueDropDown;
  // console.log(typeof props.location.state);

  // console.log(history);

  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));
  const [dueChecked, setDueChecked] = useState(true);

  const [selectedData, setSelectedData] = useState(
    props.location.state ? props.location.state() : []
  );
  const [oriData, setOriData] = useState([]);
  const [IssueApiValues, setIssueApiValues] = useState([]);
  const [issueValuesErr, setIssueValuesErr] = useState({
    locationErr: false,
    issueDateError: false,
  });

  const [selectedId, setSelectedId] = useState({
    location_ID: "",
    issue_ID: "",
  });

  const [issueFormData, setIssueFormData] = useState({
    assetDetailID_List: "",
    asset_Location_ID: 0,
    issue_To: "",
    issue_Date: "",
    return_Date: "",
    // issue_Qty: 0,
    sign_Required: true,
    employee_ID: 0,
    issue_ID: 0,
    is_Send_Email: true,
  });

  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    Id: null,
  });

  const [treeViewApiValues, setTreeViewApiValues] = useState([]);

  // let id = parseInt(empID);

  const [locationData, setLocationData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);

  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });

  const [loading, setLoading] = useState({
    finish: true,
    success: false,
  });

  useEffect(() => {
    if (!props.location.state) {
      return history.replace("/assets/asset-issue");
    }
  }, [history, props.location.state]);

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }
  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

  const columnsNames = React.useMemo(() => [
    {
      Header: "Details",
      // sticky: "left",
      id: "details",
      width: 105,
      maxWidth: 105,
      Cell: (tableProps) => {
        return (
          <>
            <span
              style={{
                cursor: "pointer",
                color: "#353535",
                textDecoration: "underline",
                marginRight: "10px",
              }}
              onClick={() => {
                setDialogOpen({
                  ...dialogOpen,
                  open: true,
                  Id: tableProps.row.original.id,
                });
              }}
            >
              <Tooltip title="View Details">
                <DetailStyles aria-label="delete">
                  <InfoIcon fontSize="small" />
                </DetailStyles>
              </Tooltip>
            </span>
          </>
        );
      },
    },
    {
      Header: "Asset Name",
      accessor: "asset_Name",
    },
    {
      Header: "Asset Tag",
      accessor: "asset_Tag",
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Location",
      accessor: "location",
    },
  ]);

  useEffect(() => {
    const urls = [
      `${server_path}api/AssetLocation/LocationTreeView`,
      `${server_path}api/Employee?id=${parseInt(empID)}`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(requests)
      .then((res) => Promise.all(res.map((req) => req.json())))
      .then((arr) => {
        const ApiLocationData = [...arr[0]];
        const TreeViewData = ApiLocationData.sort(function(obj1, obj2) {
          return obj1.Parent_ID - obj2.Parent_ID;
        });
        const setting = [];

        const buildNestedTree = (items, data) => {
          // console.log(items);
          if (items.children.length) {
            buildNestedTree(items.children[0], data);
          } else {
            const filtered = TreeViewData.filter(
              (one) => one.Parent_ID === items.value
            );

            // console.log(filtered);

            filtered.forEach((one) => {
              one.title = one.Asset_Location;
              one.value = one.AssetLocation_ID;
              one.id = one.Parent_ID;
              one.children = [];
              items.children.push(one);
            });

            // console.log(filtered);
          }
        };
        TreeViewData.map((tree) => {
          if (tree.Parent_ID === 0) {
            // console.log(tree);
            setting.push({
              title: tree.Asset_Location,
              value: tree.AssetLocation_ID,
              id: tree.Parent_ID,
              group_List: tree.Group_List,
              children: [],
            });
          } else {
            let index = setting.findIndex(
              (list) => list.group_List === tree.Group_List
            );
            // console.log(setting);
            // console.log(index, setting[index]);
            buildNestedTree(setting[index], tree);
          }
        });

        setLocationData(setting);
        setTreeViewApiValues(arr[0]);
        setEmployeeData(arr[1]);
      })
      .catch((err) => {
        // setLoading(false);
        // setLoading({ finish: true, success: false });
      });
  }, [server_path, token]);

  useEffect(() => {
    setOriData(MakeTableData(selectedData));
  }, [selectedData]);

  // console.log(selectedData);

  const SelectedAsset = selectedData.map((val) => {
    return val.id;
  });

  // console.log(SelectedAsset);

  const handleDue = (event) => {
    setDueChecked(event.target.checked);
  };

  const handleSign = (event) => {
    setIssueFormData((prevProps) => ({
      ...prevProps,
      sign_Required: !prevProps.sign_Required,
    }));
  };

  // console.log(dueChecked);

  const selectedValue = treeViewApiValues.find(
    (row) => row.AssetLocation_ID === selectedId.location_ID
  );

  useEffect(() => {
    if (selectedValue?.Location_Type === "Location") {
      setIssueApiValues(
        employeeData.filter(
          (value) => value.location_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Branch") {
      setIssueApiValues(
        employeeData.filter(
          (value) => value.branch_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Department") {
      setIssueApiValues(
        employeeData.filter(
          (value) => value.department_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Section") {
      setIssueApiValues(
        employeeData.filter(
          (value) => value.section_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Asset Location") {
      setIssueApiValues(
        employeeData.filter(
          (value) => value.location_ID === selectedValue.HRLocation_ID
        )
      );
    }
  }, [selectedValue, employeeData]);

  // console.log(issueFormData);

  function handleOnIssue(e) {
    e.preventDefault();
    let ApiData;
    if (dueChecked === true) {
      ApiData = {
        assetDetailID_List: SelectedAsset.join(","),
        asset_Location_ID: issueFormData.asset_Location_ID,
        issue_To: issueFormData.issue_To,
        issue_Date: issueFormData.issue_Date,
        return_Date: moment("12/1/2030").format("DD/MM/YYYY hh:mm:ss"),
        // issue_Qty: selectedData.length,
        sign_Required: issueFormData.sign_Required,
        employee_ID: parseInt(empID),
        issue_ID: 0,
        is_Send_Email: true,
      };
    } else {
      ApiData = {
        assetDetailID_List: SelectedAsset.join(","),
        asset_Location_ID: issueFormData.asset_Location_ID,
        issue_To: issueFormData.issue_To,
        issue_Date: issueFormData.issue_Date,
        return_Date: issueFormData.return_Date,
        // issue_Qty: selectedData.length,
        sign_Required: issueFormData.sign_Required,
        employee_ID: parseInt(empID),
        issue_ID: 0,
        is_Send_Email: true,
      };
    }
    console.log(ApiData);

    if (issueFormData.asset_Location_ID === 0) {
      console.log("here");
      setIssueValuesErr({
        ...issueValuesErr,
        locationErr: true,
      });
      return;
    } else if (issueFormData.issue_Date === "") {
      setIssueValuesErr({
        ...issueValuesErr,
        issueDateError: true,
      });
      return;
    } else {
      fetch(`${server_path}api/AssetDetail/AssetIssueSave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ApiData),
      })
        .then((res) => {
          if (res.status === 200) {
            setIssueFormData({
              asset_Location_ID: "",
              issue_To: "",
              issue_Date: "",
              return_Date: "",
              sign_Required: true,
              employee_ID: 0,
              issue_ID: 0,
              is_Send_Email: true,
            });
            setOpenSnack({
              ...openSnack,
              openSnackOpen: true,
              message: "Asset has successfully saved",
              title: "saved",
            });
            setTimeout(() => {
              return history.replace("/assets/asset-issue");
            }, 3000);
          }
        })
        .catch((err) => {
          console.log(err);
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            message: "An error has occured, please try again later",
            title: "error",
          });
        });
    }
  }

  function handleonClear() {
    return history.replace("/assets/asset-issue");
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <IssueForm>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <LeftGrid>
                <FormControl className={classes.formControl}>
                  <TreeViewDropDown
                    style={{ width: "100%" }}
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: "auto",
                      minWidth: 300,
                    }}
                    treeData={locationData}
                    placeholder="Asset Location*"
                    onChange={(e, l) => {
                      setIssueValuesErr({
                        ...issueValuesErr,
                        locationErr: false,
                      });

                      if (!e) return;
                      setSelectedId({
                        ...selectedId,
                        location_ID: e,
                      });
                      setIssueFormData({
                        ...issueFormData,
                        asset_Location_ID: e,
                      });
                    }}
                  />
                </FormControl>
                {issueValuesErr.locationErr && (
                  <FormHelperText
                    color="primary"
                    style={{
                      color: "#f44336",
                      position: "absolute",
                      top: "20%",
                    }}
                  >
                    *Asset Location cannot be empty
                  </FormHelperText>
                )}
                <FormControl className={classes.formControl}>
                  {/* <InputLabel id="demo-simple-select-label">
                    Issue To
                  </InputLabel> */}
                  <IssueDropDown
                    showSearch
                    style={{}}
                    placeholder="Issued To"
                    optionFilterProp="children"
                    dropdownStyle={{ zIndex: 9999 }}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(e, l) => {
                      setIssueFormData({
                        ...issueFormData,
                        issue_To: l.value,
                      });
                    }}
                  >
                    {IssueApiValues.map((data) => (
                      <Option key={data.employee_ID} value={data.employee_ID}>
                        {data.employee_Name}
                      </Option>
                    ))}
                  </IssueDropDown>
                  {/* <Select2
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    MenuProps={{ classes: { paper: classes.select } }}
                    value={issueFormData.issue_To}
                    onChange={(e) => {
                      setIssueFormData({
                        ...issueFormData,
                        issue_To: e.target.value,
                      });
                    }}
                  >
                    {IssueApiValues.map((asset) => {
                      return (
                        <MenuItem
                          key={asset.employee_ID}
                          value={asset.employee_ID}
                        >
                          {asset.employee_Name}
                        </MenuItem>
                      );
                    })}
                  </Select2> */}
                </FormControl>
              </LeftGrid>
              <SignBox>
                <CheckBoxLabel
                  control={
                    <Checkbox
                      checked={issueFormData.sign_Required}
                      onChange={handleSign}
                      style={{
                        fontWeight: "bold",
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="Signature Required"
                  labelPlacement="end"
                />
              </SignBox>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Checkarea>
                <CheckBoxLabel
                  control={
                    <Checkbox
                      checked={dueChecked}
                      onChange={handleDue}
                      style={{
                        fontWeight: "bold",
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="No Due Date"
                  labelPlacement="end"
                />
              </Checkarea>
              {!dueChecked ? (
                <RightGrid>
                  <p className={classes.text}> Return Due On*:</p>
                  <Picker
                    format="DD/MM/YYYY hh:mm:ss"
                    showTime
                    style={{
                      height: "90%",
                      marginLeft: 5,
                    }}
                    value={
                      issueFormData?.return_Date !== ""
                        ? moment(
                            issueFormData.return_Date,
                            "DD/MM/YYYY hh:mm:ss"
                          )
                        : null
                    }
                    onChange={(e, l) => {
                      setIssueFormData({
                        ...issueFormData,
                        return_Date: l,
                      });
                      // setReturnDateError(false);
                    }}
                    popupStyle={{ zIndex: 9999 }}
                  />
                </RightGrid>
              ) : null}
              <SubRightGrid>
                <p className={classes.text}>Issue Date*:</p>
                <Picker
                  format="DD/MM/YYYY hh:mm:ss"
                  value={
                    issueFormData?.issue_Date !== ""
                      ? moment(issueFormData.issue_Date, "DD/MM/YYYY hh:mm:ss")
                      : null
                  }
                  showTime
                  style={{
                    height: "90%",
                    marginLeft: 30,
                  }}
                  onChange={(e, l) => {
                    setIssueFormData({
                      ...issueFormData,
                      issue_Date: l,
                    });
                    setIssueValuesErr({
                      ...issueValuesErr,
                      issueDateError: false,
                    });
                  }}
                  popupStyle={{ zIndex: 9999 }}
                />
              </SubRightGrid>
              {issueValuesErr.issueDateError && (
                <FormHelperText
                  color="primary"
                  style={{
                    marginTop: "-40px",
                    marginLeft: "120px",
                    color: "#f44336",
                  }}
                >
                  *Issue Date cannot be empty
                </FormHelperText>
              )}
              <SubRightText>
                <p className={classes.text}>Note :</p>
                <TextField
                  className={classes.Note}
                  id="outlined-multiline-static"
                  label="Note"
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </SubRightText>
            </Grid>
          </Grid>
        </IssueForm>
      </Container>
      <MakeTable
        columns={columnsNames}
        data={oriData}
        loading={loading}
        subject="sub"
      ></MakeTable>
      <Buttonarea>
        <Button
          variant="contained"
          color="primary"
          className={classes.savebtn}
          onClick={handleOnIssue}
        >
          Issue
        </Button>

        <Button
          color="secondary"
          className={classes.cancelbtn}
          onClick={handleonClear}
        >
          Cancel
        </Button>
      </Buttonarea>
      {dialogOpen.open && (
        <DetailDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        ></DetailDialog>
      )}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackOpen}
        onClose={handleCloseSnack}
        key={vertical + horizontal}
      >
        <SnackbarContent
          aria-describedby="message-id2"
          style={{
            background: `${
              title === "saved"
                ? "#4caf50"
                : title === "fill all detail"
                ? "#ff9100"
                : "#f44306"
            }`,
          }}
          message={
            <span id="message-id2">
              <div>{message}</div>
            </span>
          }
        />
      </Snackbar>
    </React.Fragment>
  );
}
