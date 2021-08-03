import React, { useState, useEffect, useContext } from "react";
// import { makeStyles, withStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import { DatePicker } from "antd";
import { TreeSelect } from "antd";
import { Select } from "antd";
import { Input } from "antd";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { KTCookie } from "../../../../_metronic/_assets/js/components/cookie";
import FormHelperText from "@material-ui/core/FormHelperText";
import { MmsSharp } from "@material-ui/icons";

// function onOk(value) {
// }

const FormContainer = styled.div``;

const IssueBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const ReturnBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const LocationBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-left: 5px;
  margin-bottom: 20px;
`;

const IssueToBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-left: 0px;
  margin-bottom: 20px;
`;

const NoteBox = styled.div`
  display: flex;
  justify-content: space-around;
`;

// const IssueQtyBox = styled.div`
//   display: flex;
//   justify-content: space-around;
//   margin-bottom: 20px;
// `;

const CheckArea = styled.div`
  width: 86%;
  margin: auto;
  margin-bottom: 15px;
`;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    minWidth: 600,
  },
}))(MuiDialogActions);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default function ReturnPopUpIndex({
  ReturnDialogOpen,
  setReturnDialogOpen,
  ReturnPopUpValues,
  setReturnPopUpValues,
  setAssetValues,
  assetValues,
  setposterror,
  Setpostsuccess,
  setShowErrTable,
  setIssueReturnApi,
}) {
  let ApiData;
  const { TextArea } = Input;
  const { Option } = Select;
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  let id = parseInt(empID);
  // const [value, setValue] = useState(undefined);

  const [PopUpApiValues, setPopUpApiValues] = useState({
    location: [],
    issue: [],
  });
  const [TreeViewValues, setTreeviewValues] = useState([]);
  const [IssueApiValues, setIssueApiValues] = useState([]);

  const ReturnHandleClose = () => {
    setReturnDialogOpen({ open: false, id: null });
  };
  const [selectedId, setSelectedId] = useState({
    location_ID: ReturnPopUpValues.location_ID,
    issue_ID: "",
  });

  // const [checked, setChecked] = React.useState(true);

  function handleChange() {
    setReturnSaveValues((prevProps) => ({
      ...prevProps,
      transfer: !prevProps.transfer,
    }));
  }

  const [ReturnError, setReturnError] = useState(false);
  const [LocationError, setLocationError] = useState(false);
  const [ReturnSaveValues, setReturnSaveValues] = useState({
    return_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
    transferQty: 0,
    transfer: false,
    from_Asset_Location_ID: 0,
    to_Location_ID: 0,
    issue_To: 0,
    note: "",
    employee_ID: 0,
    asset_Detail_ID: 0,
    issue_Item_ID: 0,
    cookieEmp_ID: parseInt(empID),
    issue_ID: 0,
    message: true,
  });

  useEffect(() => {
    fetch(`${server_path}api/AssetLocation/LocationTreeView`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTreeviewValues(data));
  }, [server_path, token]);

  useEffect(() => {
    const urls = [
      `${server_path}api/AssetLocation/LocationTreeView`,
      `${server_path}api/Employee?id=${id}`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    Promise.all(requests)
      .then((res) => {
        return Promise.all(res.map((data) => data.json()));
      })
      .then((arr) => {
        const ApiLocationData = [...arr[0]];
        const TreeViewData = ApiLocationData.sort(function(obj1, obj2) {
          return obj1.Parent_ID - obj2.Parent_ID;
        });
        const setting = [];

        const buildNestedTree = (items, data) => {
          if (items.children.length) {
            buildNestedTree(items.children[0], data);
          } else {
            items.children.push({
              title: data.Asset_Location,
              value: data.AssetLocation_ID,
              id: data.Parent_ID,
              children: [],
            });
          }
        };
        TreeViewData.map((tree) => {
          if (tree.Parent_ID === 0) {
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
            buildNestedTree(setting[index], tree);
          }
          return null;
        });

        setPopUpApiValues((prev) => {
          return {
            ...prev,
            location: setting,
            issue: arr[1],
          };
        });
      });
  }, [server_path, token]);

  const selectedValue = TreeViewValues.find(
    (row) => row.AssetLocation_ID === selectedId.location_ID
  );
  // console.log(TreeViewValues);
  // console.log(ReturnPopUpValues);

  // const selectedLocation = TreeViewValues.find(
  //   (val) => val.AssetLocation_ID === ReturnPopUpValues.location_ID
  // );

  // console.log(selectedLocation);

  useEffect(() => {
    if (selectedValue?.Location_Type === "Location") {
      setIssueApiValues(
        PopUpApiValues.issue.filter(
          (value) => value.location_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Branch") {
      setIssueApiValues(
        PopUpApiValues.issue.filter(
          (value) => value.branch_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Department") {
      setIssueApiValues(
        PopUpApiValues.issue.filter(
          (value) => value.department_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Section") {
      setIssueApiValues(
        PopUpApiValues.issue.filter(
          (value) => value.section_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Asset Location") {
      setIssueApiValues(
        PopUpApiValues.issue.filter(
          (value) => value.location_ID === selectedValue.HRLocation_ID
        )
      );
    }
  }, [selectedValue, PopUpApiValues.issue]);

  if (ReturnSaveValues.transfer === false) {
    ApiData = {
      return_Date: ReturnSaveValues.return_Date,
      transferQty: 1,
      transfer: ReturnSaveValues.transfer,
      from_Asset_Location_ID: ReturnPopUpValues.location_ID,
      to_Location_ID: 0,
      issue_To: 0,
      note: ReturnSaveValues.note,
      employee_ID: parseInt(empID),
      asset_Detail_ID: ReturnDialogOpen.id,
      issue_Item_ID: ReturnPopUpValues.issue_Item_ID,
      cookieEmp_ID: parseInt(empID),
      issue_ID: 0,
      message: true,
    };
  } else {
    ApiData = {
      return_Date: ReturnSaveValues.return_Date,
      transferQty: 1,
      transfer: ReturnSaveValues.transfer,
      from_Asset_Location_ID: ReturnPopUpValues.location_ID,
      to_Location_ID: ReturnSaveValues.to_Location_ID,
      issue_To: ReturnSaveValues.issue_To,
      note: ReturnSaveValues.note,
      employee_ID: parseInt(empID),
      asset_Detail_ID: ReturnDialogOpen.id,
      issue_Item_ID: ReturnPopUpValues.issue_Item_ID,
      cookieEmp_ID: parseInt(empID),
      issue_ID: 0,
      message: true,
    };
  }

  console.log(ApiData);

  function ReturnHandleClick(e) {
    let AuditData;
    e.preventDefault();
    if (ReturnSaveValues.return_Date === "") {
      setReturnError(true);
    } else {
      setReturnError(false);
      if (ReturnSaveValues.to_Location_ID === "0") {
        setLocationError(true);
      } else {
        setLocationError(false);
        fetch(`${server_path}api/AssetView/SaveReturn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ApiData),
        }).then((res) => {
          if (res.status === 200) {
            if (ReturnSaveValues.transfer === false) {
              AuditData = {
                activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
                action_By: parseInt(empID),
                event: "Return",
                asset_Detail_ID: ReturnDialogOpen.id,
                asset_ID: assetValues.ts.asset_ID,
                assetLocation_ID: ReturnSaveValues.location_ID,
                description: "",
                assetObject: [],
                categoryObjects: null,
                brandObject: null,
                supplierObject: null,
                typeObject: null,
                statusObject: null,
                locationObject: null,
                allocationObject: [],
                requestObject: {
                  assetName: assetValues.ts.asset_Name,
                },
              };
            } else {
              AuditData = {
                activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
                action_By: parseInt(empID),
                event: "Transfer",
                asset_Detail_ID: ReturnDialogOpen.id,
                asset_ID: assetValues.ts.asset_ID,
                assetLocation_ID: ReturnSaveValues.location_ID,
                description: "",
                assetObject: [],
                categoryObjects: null,
                brandObject: null,
                supplierObject: null,
                typeObject: null,
                statusObject: null,
                locationObject: null,
                allocationObject: [],
                requestObject: {
                  assetName: assetValues.ts.asset_Name,
                },
              };
            }

            fetch(`${server_path}api/AuditTrial`, {
              method: "POST",

              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(AuditData),
            });
            fetch(
              `${server_path}api/AssetView/GetAssetTopSection?detailID=${ReturnDialogOpen.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then((res) => res.json())
              .then((data) => {
                setAssetValues({
                  ...assetValues,
                  ts: data,
                });
              });
            fetch(
              `${server_path}api/AssetView/GetIssueReturnList?AssetDetail_ID=${ReturnDialogOpen.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then((res) => res.json())
              .then((data) => {
                setIssueReturnApi([...data]);
              });
            Setpostsuccess(true);
            setShowErrTable(false);
            setReturnDialogOpen({ open: false, id: ReturnDialogOpen.id });
            // setOpen(false);
          } else {
            setposterror(true);
          }
        });
      }
    }
  }

  return (
    <div>
      <Dialog
        onClose={ReturnHandleClose}
        aria-labelledby="customized-dialog-title"
        open={ReturnDialogOpen.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={ReturnHandleClose}>
          Return Asset
        </DialogTitle>
        <DialogContent dividers>
          <FormContainer>
            <IssueBox>
              <p
                style={{
                  marginTop: 5,
                }}
              >
                Issue Date<span style={{ color: "red" }}>*</span>
              </p>
              <DatePicker
                disabled
                format="DD/MM/YYYY hh:mm:ss"
                showTime
                style={{
                  height: "90%",
                }}
                placeholder={
                  ReturnPopUpValues?.issue_date !== ""
                    ? moment(ReturnPopUpValues.issue_date).format(
                        "DD/MM/YYYY hh:mm:ss"
                      )
                    : // .split("T")[0]
                      null
                }
                // onChange={(e, l) => {
                //   setReturnPopUpValues({ ...ReturnPopUpValues, issue_date: l });
                // }}
                // allowClear={false}
                // popupStyle={{ zIndex: 9999 }}
              />
            </IssueBox>
            <ReturnBox>
              <p
                style={{
                  marginTop: 5,
                }}
              >
                Return Date
              </p>
              <DatePicker
                format="DD/MM/YYYY hh:mm:ss"
                showTime
                style={{
                  height: "90%",
                }}
                value={
                  ReturnSaveValues?.return_Date !== ""
                    ? moment(
                        ReturnSaveValues.return_Date,
                        "DD/MM/YYYY hh:mm:ss"
                      )
                    : null
                }
                onChange={(e, l) => {
                  setReturnSaveValues({ ...ReturnSaveValues, return_Date: l });
                }}
                popupStyle={{ zIndex: 9999 }}
              />
            </ReturnBox>
            {ReturnError && (
              <FormHelperText
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "80%",
                  marginBottom: "5px",
                  marginTop: "-20px",
                  color: "#f44336",
                }}
              >
                *Return Date cannot be empty
              </FormHelperText>
            )}
            <CheckArea>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ReturnSaveValues.transfer}
                    onChange={handleChange}
                    style={{
                      float: "right",
                    }}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
                label="Transfer"
                labelPlacement="end"
              />
            </CheckArea>
            {ReturnSaveValues.transfer === true && (
              <div>
                <LocationBox>
                  <p
                    style={{
                      marginTop: 5,
                    }}
                  >
                    Asset Location<span style={{ color: "red" }}>*</span>
                  </p>
                  <TreeSelect
                    style={{ width: "38%", marginRight: 9 }}
                    // value={
                    //   ReturnPopUpValues?.location_ID === null
                    //     ? ""
                    //     : ReturnPopUpValues?.location_ID
                    // }
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: "auto",
                      minWidth: 300,
                      zIndex: 9999,
                    }}
                    treeData={PopUpApiValues.location}
                    placeholder="Please select"
                    onChange={(e, l) => {
                      if (!e) return;
                      setSelectedId({
                        ...selectedId,
                        location_ID: e,
                      });
                      // setReturnPopUpValues({
                      //   ...ReturnPopUpValues,
                      //   location_ID: e,
                      // });
                      setReturnSaveValues({
                        ...ReturnSaveValues,
                        to_Location_ID: e,
                        from_Asset_Location_ID: ReturnPopUpValues.location_ID,
                      });
                    }}
                  />
                </LocationBox>
                {LocationError && (
                  <FormHelperText
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "80%",
                      marginBottom: "5px",
                      marginTop: "-20px",
                      color: "#f44336",
                    }}
                  >
                    *Asset Location cannot be empty
                  </FormHelperText>
                )}
                <IssueToBox>
                  <p
                    style={{
                      marginTop: 5,
                    }}
                  >
                    Issue To
                  </p>
                  <Select
                    showSearch
                    style={{ width: "38%", marginLeft: 25 }}
                    placeholder="Select Issued To"
                    optionFilterProp="children"
                    dropdownStyle={{ zIndex: 9999 }}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(e, l) => {
                      setReturnSaveValues({
                        ...ReturnSaveValues,
                        issue_To: l.value,
                      });
                    }}
                  >
                    {IssueApiValues.map((data) => (
                      <Option key={data.employee_ID} value={data.employee_ID}>
                        {data.employee_Name}
                      </Option>
                    ))}
                  </Select>
                </IssueToBox>
              </div>
            )}
            {/* <IssueQtyBox>
        <p
          style={{
            marginTop: 5,
          }}
        >
          Issue Qty
        </p>
        <Input
          placeholder="Issue Qty"
          style={{
            width: "38%",
            marginLeft: 18,
            height: "90%",
          }}
        />
      </IssueQtyBox> */}
            <NoteBox>
              <p
                style={{
                  marginTop: 5,
                }}
              >
                Note
              </p>
              <TextArea
                rows={4}
                style={{
                  width: "38%",
                  marginLeft: 40,
                }}
                value={ReturnSaveValues.note}
                onChange={(e) => {
                  setReturnSaveValues({
                    ...ReturnSaveValues,
                    note: e.target.value,
                  });
                }}
              />
            </NoteBox>
          </FormContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={ReturnHandleClose} color="default">
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={ReturnHandleClick}
            style={{
              background: "rgba(54, 153, 255, 0.75)",
              color: "#fff",
            }}
            variant="contained"
          >
            Return Asset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
