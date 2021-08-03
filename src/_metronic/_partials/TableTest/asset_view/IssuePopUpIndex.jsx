import React, { useState, useEffect, useContext } from "react";
// import { makeStyles, withStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import { DatePicker } from "antd";
import { TreeSelect } from "antd";
import { Select } from "antd";
import { Input } from "antd";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import moment from "moment";
import FormHelperText from "@material-ui/core/FormHelperText";
import { KTCookie } from "../../../../_metronic/_assets/js/components/cookie";

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

const IssueQtyBox = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
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

export default function IssuePopUpIndex({
  setIssueDialogOpen,
  IssueDialogOpen,
  setAssetValues,
  assetValues,
  setposterror,
  Setpostsuccess,
  IssueReturnApi,
  setShowErrTable,
  setIssueReturnApi,
}) {
  const { TextArea } = Input;
  const { Option } = Select;
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));
  let id = parseInt(empID);

  const [PopUpApiValues, setPopUpApiValues] = useState({
    location: [],
    issue: [],
  });
  const [TreeViewValues, setTreeviewValues] = useState([]);
  const [IssueApiValues, setIssueApiValues] = useState([]);

  const IssueHandleClose = () => {
    setIssueDialogOpen({ open: false, id: null });
  };
  const [IssueSaveValues, setIssueSaveValues] = useState({
    emp_ID: parseInt(empID),
    issue_Date: "",
    return_Date: "",
    asset_Location_ID: 0,
    issue_To: 0,
    note: "",
    requestBy_ID: parseInt(empID),
    assetDetail_ID: 0,
    issueNotifi_ON: true,
    issue_ID: 0,
  });

  const [IssueError, setIssueError] = useState(false);
  const [LocationError, setLocationError] = useState(false);

  const [selectedId, setSelectedId] = useState({
    location_ID: "",
    issue_ID: "",
  });

  const [selectedName, setSelectedName] = useState({
    location: "",
    issue: "",
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

  useEffect(() => {
    if (selectedValue?.Location_Type === "Location") {
      setIssueApiValues(
        PopUpApiValues.issue.filter(
          (value) => value.location_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Branch") {
      console.log("branch");
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
      console.log("ASlocation");
      setIssueApiValues(
        PopUpApiValues.issue.filter(
          (value) => value.location_ID === selectedValue.HRLocation_ID
        )
      );
    }
  }, [selectedValue, PopUpApiValues.issue]);

  // console.log(IssueApiValues);

  function HandleOnIssue(e) {
    let AuditData;
    e.preventDefault();
    if (IssueSaveValues.issue_Date === "") {
      setIssueError(true);
    } else {
      setIssueError(false);
      if (IssueSaveValues.asset_Location_ID === 0) {
        setLocationError(true);
      } else {
        setLocationError(false);
        fetch(`${server_path}api/AssetView`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            emp_ID: parseInt(empID),
            issue_Date: IssueSaveValues.issue_Date,
            return_Date: IssueSaveValues.return_Date,
            asset_Location_ID: IssueSaveValues.asset_Location_ID,
            issue_To: IssueSaveValues.issue_To,
            note: IssueSaveValues.note,
            requestBy_ID: parseInt(empID),
            assetDetail_ID: IssueDialogOpen.id,
            issue_Qty: IssueSaveValues.issue_Qty,
          }),
        }).then((res) => {
          if (res.status === 200) {
            AuditData = {
              activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
              action_By: parseInt(empID),
              event: "Issue",
              asset_Detail_ID: IssueDialogOpen.id,
              asset_ID: assetValues.ts.asset_ID,
              assetLocation_ID: IssueSaveValues.asset_Location_ID,
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

            fetch(`${server_path}api/AuditTrial`, {
              method: "POST",

              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(AuditData),
            });

            fetch(
              `${server_path}api/AssetView/GetAssetTopSection?detailID=${IssueDialogOpen.id}`,
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
              `${server_path}api/AssetView/GetIssueReturnList?AssetDetail_ID=${IssueDialogOpen.id}`,
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
            setIssueDialogOpen({ open: false, id: IssueDialogOpen.id });
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
        onClose={IssueHandleClose}
        aria-labelledby="customized-dialog-title"
        open={IssueDialogOpen.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={IssueHandleClose}>
          Issue Asset
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
                format="DD/MM/YYYY hh:mm:ss"
                showTime
                style={{
                  height: "90%",
                }}
                value={
                  IssueSaveValues?.issue_Date !== ""
                    ? moment(IssueSaveValues.issue_Date, "DD/MM/YYYY hh:mm:ss")
                    : null
                }
                onChange={(e, l) => {
                  setIssueSaveValues({ ...IssueSaveValues, issue_Date: l });
                  setIssueError(false);
                }}
                popupStyle={{ zIndex: 9999 }}
              />
            </IssueBox>
            {IssueError && (
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
                *Issue Date cannot be empty
              </FormHelperText>
            )}
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
                  IssueSaveValues?.return_Date !== ""
                    ? moment(IssueSaveValues.return_Date, "DD/MM/YYYY hh:mm:ss")
                    : null
                }
                onChange={(e, l) => {
                  setIssueSaveValues({ ...IssueSaveValues, return_Date: l });
                }}
                popupStyle={{ zIndex: 9999 }}
              />
            </ReturnBox>
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
                  setSelectedName({
                    ...selectedName,
                    location: l[0],
                  });
                  setIssueSaveValues({
                    ...IssueSaveValues,
                    asset_Location_ID: e,
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
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={(e, l) => {
                  setIssueSaveValues({
                    ...IssueSaveValues,
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
            <IssueQtyBox>
              <p
                style={{
                  marginTop: 5,
                }}
              >
                Issue Qty
              </p>
              <Input
                type="number"
                min="0"
                placeholder="Issue Qty"
                onChange={(e) => {
                  setIssueSaveValues({
                    ...IssueSaveValues,
                    issue_Qty: e.target.value,
                  });
                }}
                style={{
                  width: "38%",
                  marginLeft: 18,
                  height: "90%",
                }}
              />
            </IssueQtyBox>
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
                value={IssueSaveValues.note}
                onChange={(e) => {
                  setIssueSaveValues({
                    ...IssueSaveValues,
                    note: e.target.value,
                  });
                }}
              />
            </NoteBox>
          </FormContainer>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={IssueHandleClose} color="default">
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={HandleOnIssue}
            style={{
              background: "rgba(54, 153, 255, 0.75)",
              color: "#fff",
            }}
            variant="contained"
          >
            Issue Asset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
