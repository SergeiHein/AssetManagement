import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
// import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import { useSubheader } from "../../../layout";
import GroupIcon from "@material-ui/icons/Group";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
// import { Picker, Space } from "antd";
import GroupDialog from "../GroupDialog";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import {
  SnackBarSave,
  SnackBarSaveError,
  SnackBarCheckError,
} from "../../Settings/SnackBar";
import FormHelperText from "@material-ui/core/FormHelperText";
import { CheckBoxLabel, Picker } from "../RequestedIndex_Styles";
import { KTCookie } from "../../../../_metronic/_assets/js/components/cookie";
import { useHistory } from "react-router-dom";

const RequestForBtn = styled(IconButton)`
  cursor: ${(props) => (props.person ? "not-allowed" : "pointer")}!important;
  transition: all 300ms;
`;

const IssueArea = styled.div`
  display: flex;
`;
const Typearea = styled.div`
  display: flex;
`;

const Assetarea = styled.div`
  display: flex;
`;

const IssueBox = styled.div`
  width: 85%;
  min-width: 300px;
  margin: auto;
  margin-top: 30px;
  background-color: white;
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  margin-bottom: 50px;
`;

const LeftGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  margin-top: 20px;
  @media (max-width: 600px) {
    width: 100%;
    margin-left: 40px;
  }
  @media (max-width: 400px) {
    width: 110%;
    margin-left: 20px;
  }
`;

const RightGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
  margin-top: 20px;
  @media (max-width: 600px) {
    margin-top: 0;
  }
  @media (max-width: 400px) {
    width: 91%;
    margin-top: 0;
  }
`;

const SubLeftGrid = styled.div`
  display: flex;
  width: 80%;
  margin: auto;
  margin-top: 20px;
  @media (max-width: 600px) {
    justify-content: space-between;
  }
  @media (max-width: 400px) {
    margin-left: 15px;
  }
`;

const SubLeftText = styled.div`
  width: 80%;
  margin: auto;
  margin-top: 10px;
  @media (max-width: 600px) {
    margin-left: 45px;
    width: 95%;
  }
  @media (max-width: 400px) {
    width: 100%;
    margin-left: 15px;
  }
`;

const SubRightGrid = styled.div`
  display: flex;
  width: 80%;
  margin: auto;
  margin-top: 20px;
  @media (max-width: 600px) {
    margin-top: 0x;
    margin-left: 47px;
    width: 79%;
  }
  @media (max-width: 400px) {
    width: 90%;
    margin-top: 0px;
    margin-left: 16px;
  }
`;

const Checkarea = styled.div`
  width: 82%;
  margin: auto;
`;

const SubRightText = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: auto;
  @media (max-width: 400px) {
    margin-left: 45px;
  }
`;

const BoxField = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 80%;
  margin: auto;
  @media (max-width: 400px) {
    margin-left: 46px;
  }
`;
const Buttonarea = styled.div`
  margin-bottom: 40px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoBox = styled.div`
  background: white;
  width: 100%;
  min-height: 310px;
`;

const LeftText = styled.div`
  display: flex;
  margin-bottom: -13px;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  issueText: {
    margin: "-10px -3px 0 0",
    width: "62%",
  },
  Note: {
    margin: "10px -12px 10px 0",
    width: "66%",
  },
  text: {
    paddingBottom: 10,
    fontSize: "14px ",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
  },
  Checkhead: {
    width: "10%",
  },
  thead: {
    width: "15%",
    color: "rgba(0, 0, 0, 0.57)",
    padding: "20px",
    fontSize: "14px",
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
  popover: {
    pointerEvents: "none",
  },
  poptext: {
    width: "40%",
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "10px",
    fontSize: 12,
    background: "white",
    boxShadow: "0 0 1px 0 #a4a1a1",
  },
  subText: {
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "10px",
    width: "60%",
    fontSize: 12,
    background: "white",
    boxShadow: "0 0 1px 0 #a4a1a1",
  },
  Picker: {
    width: "92%",
  },
}));

export default function IssuedIndex(props) {
  console.log(props);
  const suhbeader = useSubheader();
  const history = useHistory();
  suhbeader.setTitle("issue Asset");
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const classes = useStyles();
  const [Added, setAdded] = useState(false);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));
  const [QtyError, setQtyError] = useState(false);
  const [QtyLessError, setQtyLessError] = useState(false);
  const [QtyMoreError, setQtyMoreError] = useState(false);
  const [IssueDateError, setIssueDateError] = useState(false);
  const [ReturnDateError, setReturnDateError] = useState(false);

  const [IssueApiValues, setIssueApiValues] = useState({
    asset_ID: 0,
    requestBy_Employee_No: "",
    asset_Name: "",
    category_Name: "",
    type_Name: "",
    request_Date: "2020-10-29T00:00:00",
    request_Qty: 0,
    request_By: "",
    request_By_ID: 0,
    employee_ID: 0,
    position_Name: "",
    section_Name: "",
    department_Name: "",
    branch_Name: "",
    location_Name: "",
    issue_To: "",
    available_Qty: 0,
    remaining_Qty_To_Issue: 0,
    issue_Qty: 1,
    issueAssetDetail: [
      {
        asset_ID: 0,
        assetDetail_ID: 0,
        brand: "",
        model_No: "",
        searial_No: "",
        product_Key: "",
        asset_Status: "",
        asset_Condition_Status: null,
        owner_Book_Status: null,
        expiry: "",
        warranty: 0,
        asset_Tag: "",
      },
    ],
  });
  const [IssueDetail, setIssueDetail] = useState([
    {
      asset_Detail_ID: 0,
      issue_Date: "",
      expectedReturn_Date: "",
      issue_Item_Qty: 0,
      employee_ID: 0,
      location_ID: 0,
      asset_Tag: "",
      request_Qty: 0,
    },
  ]);

  const [SaveIssueValues, setSaveIssueValues] = useState({
    emp_ID: parseInt(empID),
    issue_ID: 0,
    requestID: props.location.state,
    issue_Qty: 0,
    remaining_Qty: 0,
    issue_By_ID: parseInt(empID),
    note: "",
    created_By: parseInt(empID),
    modified_By: parseInt(empID),
    expectedReturn_Date: moment("12/1/2030").format("DD/MM/YYYY hh:mm:ss"),
    issueDetails: IssueDetail,
  });

  useEffect(() => {
    if (!props.location.state) {
      return history.replace("/requested-list");
    }
  }, [history, props.location.state]);

  useEffect(() => {
    if (props.location.state) {
      fetch(
        `${server_path}api/Issue/Get?RequestID_List=${props.location.state}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setIssueApiValues(data);
          setAdded(true);
        });
    }
  }, [server_path, props.location.state, token]);

  const [groupDialogOpen, setGroupDialogOpen] = useState({
    Id: 0,
    open: false,
  });

  const [checked, setChecked] = React.useState([]);

  const handleChange = (id, status, data) => {
    if (status === "all") {
      const ary = [];
      if (checked.length === data.length) {
        setChecked([]);
        setIssueDetail([]);
      } else {
        if (IssueApiValues.issue_To === "Self") {
          data.map((item, index) => {
            ary.push(item.assetDetail_ID);

            data[index] = {
              ...item,
              expectedReturn_Date: SaveIssueValues.expectedReturn_Date,
              issue_Date: SaveIssueValues.issue_Date,
              issue_Item_Qty: checked.length,
              employee_ID: IssueApiValues.request_By_ID,
              location_ID: IssueApiValues.location_ID,
              asset_Tag: item.asset_Tag,
              request_Qty: IssueApiValues.request_Qty,
            };
            return null;
          });
        } else {
          data.map((item, index) => {
            ary.push(item.assetDetail_ID);
            data[index] = {
              ...item,
              expectedReturn_Date: SaveIssueValues.expectedReturn_Date,
              issue_Date: SaveIssueValues.issue_Date,
              issue_Item_Qty: checked.length,
              employee_ID: 0,
              location_ID: IssueApiValues.location_ID,
              asset_Tag: item.asset_Tag,
              request_Qty: IssueApiValues.request_Qty,
            };
            return null;
          });
        }
        setChecked(ary);

        setIssueDetail(data);
      }
    } else {
      const newAry = checked.includes(id)
        ? checked.filter((_id) => !(id === _id))
        : [...checked, id];

      setChecked(newAry);

      // setIssueDetail(selectedRow);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const [Postsuccess, Setpostsuccess] = useState(false);
  const [PostError, setposterror] = useState(false);

  const [dueChecked, setDueChecked] = useState(false);
  // const [CheckData, setCheckData] = useState(false);
  const [checkError, setCheckError] = useState(false);

  const handleDue = (event) => {
    setDueChecked(event.target.checked);
    // setCheckData(!CheckData);
    setReturnDateError(false);
  };

  function handleonIssue(data) {
    // console.log(data);
    let AuditData;
    // e.preventDefault();
    const selectedRow = data.filter((item) => {
      // console.log(item);
      if (checked.includes(item.assetDetail_ID)) {
        if (dueChecked === true) {
          console.log("here");
          item.expectedReturn_Date = moment("12/1/2030").format(
            "DD/MM/YYYY hh:mm:ss"
          );
          item.issue_Date = SaveIssueValues.issue_Date;
          item.employee_ID = IssueApiValues.request_By_ID;
          item.location_ID = IssueApiValues.location_ID;
          item.asset_Tag = item.asset_Tag;
          item.request_Qty = IssueApiValues.request_Qty;
          return item;
        }
        if (IssueApiValues.issue_To === "Self") {
          item.expectedReturn_Date = SaveIssueValues.expectedReturn_Date;
          item.issue_Date = SaveIssueValues.issue_Date;
          item.employee_ID = IssueApiValues.request_By_ID;
          item.location_ID = IssueApiValues.location_ID;
          item.asset_Tag = item.asset_Tag;
          item.request_Qty = IssueApiValues.request_Qty;
          return item;
        } else {
          item.expectedReturn_Date = SaveIssueValues.expectedReturn_Date;
          item.issue_Date = SaveIssueValues.issue_Date;
          item.employee_ID = 0;
          item.location_ID = IssueApiValues.location_ID;
          item.asset_Tag = item.asset_Tag;
          item.request_Qty = IssueApiValues.request_Qty;
          return item;
        }
      }
      return null;
    });
    if (SaveIssueValues.issue_Date === undefined) {
      setIssueDateError(true);
    } else {
      setIssueDateError(false);
      if (SaveIssueValues.issue_Qty === 0) {
        setQtyError(true);
      } else {
        setQtyError(false);
        if (SaveIssueValues.issue_Qty > IssueApiValues.request_Qty) {
          setQtyLessError(true);
        } else {
          setQtyLessError(false);
          if (SaveIssueValues.issue_Qty > IssueApiValues.available_Qty) {
            setQtyMoreError(true);
          } else {
            setQtyMoreError(false);
            if (checked.length > SaveIssueValues.issue_Qty) {
              setCheckError(true);
            } else {
              setCheckError(false);

              delete SaveIssueValues.IssueDetails;
              delete SaveIssueValues.expectedReturn_Date;
              delete SaveIssueValues.issue_Date;

              selectedRow.forEach((one) => {
                delete one.asset_Condition_Status;
                delete one.asset_Status;
                delete one.brand;
                delete one.expiry;
                delete one.model_No;
                delete one.owner_Book_Status;
                delete one.product_Key;
                delete one.searial_No;
                delete one.warranty;
                delete one.asset_ID;
                // one["asset_Detail_ID"] = one["assetDetail_ID"];
                one.asset_Detail_ID = one.assetDetail_ID;
                one.issue_Item_Qty = checked.length;
                delete one.assetDetail_ID;
                delete one.is_Issued;
              });

              const postData = {
                ...SaveIssueValues,
                issueDetails: selectedRow,
                requestID: props.location.state,
                remaining_Qty:
                  IssueApiValues.request_Qty - SaveIssueValues.issue_Qty,
              };
              console.log(postData);

              fetch(`${server_path}api/Issue`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
              }).then((res) => {
                // res.json();
                if (res.status === 200) {
                  AuditData = {
                    activity_Date: moment(new Date()).format(
                      "DD/MM/YYYY hh:mm:ss"
                    ),
                    action_By: parseInt(empID),
                    event: "Issue",
                    asset_Detail_ID: `${checked.join(",")}`,
                    asset_ID: IssueApiValues.asset_ID,
                    assetLocation_ID: 0,
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
                      assetName: IssueApiValues.asset_Name,
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

                  setSaveIssueValues((prevProps) => ({
                    ...prevProps,
                    issueDetails: IssueDetail,
                    note: SaveIssueValues.note,
                  }));
                  Setpostsuccess(true);
                } else {
                  setposterror(true);
                }
              });

              setIssueDetail({
                asset_Detail_ID: 0,
                issue_Date: "",
                expectedReturn_Date: "",
                issue_Item_Qty: 1,
                employee_ID: 0,
                location_ID: 0,
                asset_Tag: "",
                request_Qty: 0,
              });
              setSaveIssueValues({
                emp_ID: parseInt(empID),
                issue_ID: 0,
                requestID: props.location.state,
                issue_Qty: 0,
                remaining_Qty: 0,
                issue_By_ID: parseInt(empID),
                note: "",
                created_By: parseInt(empID),
                modified_By: parseInt(empID),
                issueDetails: IssueDetail,
              });
              setTimeout(() => {
                return history.replace("/requested-list");
              }, 3000);
            }
          }
        }
        //
      }
    }
  }

  function handleonClear() {
    setSaveIssueValues({
      emp_ID: parseInt(empID),
      issue_ID: 0,
      requestID: props.location.state,
      issue_Qty: 0,
      remaining_Qty: IssueApiValues.request_Qty - SaveIssueValues.issue_Qty,
      issue_By_ID: parseInt(empID),
      note: "",
      created_By: parseInt(empID),
      modified_By: parseInt(empID),
      issueDetails: IssueDetail,
    });
    setIssueDetail({
      asset_Detail_ID: 0,
      issue_Date: "",
      expectedReturn_Date: "",
      issue_Item_Qty: 1,
      employee_ID: 0,
      location_ID: 0,
      asset_Tag: "",
      request_Qty: 0,
    });
    setTimeout(() => {
      return history.replace("/requested-list");
    }, 100);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <IssueBox>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <LeftGrid>
                <Typearea>
                  <p
                    className={classes.text}
                    style={{
                      width: "80%",
                    }}
                  >
                    Type :
                    <span
                      style={{
                        marginLeft: 20,
                        fontWeight: "normal",
                      }}
                    >
                      {IssueApiValues.type_Name}
                    </span>
                  </p>
                </Typearea>
                <Assetarea>
                  <p
                    className={classes.text}
                    style={{
                      width: "80%",
                    }}
                  >
                    Asset Name :
                    <Tooltip title={IssueApiValues.asset_Name}>
                      <span
                        style={{
                          marginLeft: 20,
                          fontWeight: "normal",
                          cursor: "pointer",
                        }}
                      >
                        {IssueApiValues.asset_Name?.substr(0, 15) + "..."}
                      </span>
                    </Tooltip>
                  </p>
                </Assetarea>
                <IssueArea>
                  {IssueApiValues.issue_To === "Self" ? (
                    <p
                      className={classes.text}
                      style={{
                        width: "80%",
                      }}
                    >
                      Issue To :
                      <span
                        aria-owns={open ? "mouse-over-popover" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                        style={{
                          marginLeft: 20,
                          fontWeight: "normal",
                          cursor: "pointer",
                          color: "#347eed",
                        }}
                      >
                        {IssueApiValues.request_By}
                      </span>
                    </p>
                  ) : (
                    <p
                      className={classes.text}
                      style={{
                        width: "80%",
                      }}
                    >
                      Issue To :
                      <Tooltip title={"View others"}>
                        <RequestForBtn
                          onClick={() =>
                            setGroupDialogOpen({
                              open: true,
                              Id: props.location.state,
                            })
                          }
                          style={{
                            marginLeft: " 10px",
                            width: "16%",
                            height: "80%",
                            marginTop: "-6px",
                          }}
                        >
                          <GroupIcon
                            fontSize="large"
                            style={{
                              transition: "250ms transform",
                              color: "rgba(54, 153, 255, 1)",
                              fontSize: "24px",
                            }}
                          ></GroupIcon>
                        </RequestForBtn>
                      </Tooltip>
                    </p>
                  )}
                </IssueArea>
              </LeftGrid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RightGrid>
                <p className={classes.text}>
                  Category :
                  <span
                    style={{
                      marginLeft: 20,
                      fontWeight: "normal",
                    }}
                  >
                    {IssueApiValues.category_Name}
                  </span>
                </p>
                <p className={classes.text}>
                  Request Date :
                  <span
                    style={{
                      marginLeft: 20,
                      fontWeight: "normal",
                    }}
                  >
                    {moment(IssueApiValues.request_Date).format(
                      "DD-MM-YYYY hh:mm:ss"
                    )}
                  </span>
                </p>

                <p className={classes.text}>
                  Request By :
                  <span
                    aria-owns={open ? "mouse-over-popover" : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                    style={{
                      marginLeft: 20,
                      fontWeight: "normal",
                      color: "#347eed",
                      cursor: "pointer",
                    }}
                  >
                    {IssueApiValues.request_By}
                  </span>
                </p>
              </RightGrid>
            </Grid>
          </Grid>
          <hr></hr>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <SubLeftGrid>
                <p className={classes.text}>Issue Date*:</p>
                <Picker
                  format="DD/MM/YYYY hh:mm:ss"
                  showTime
                  style={{
                    height: "90%",
                    marginLeft: 30,
                  }}
                  onChange={(e, l) => {
                    setSaveIssueValues({
                      ...SaveIssueValues,
                      issue_Date: l,
                    });
                    setIssueDateError(false);
                  }}
                  popupStyle={{ zIndex: 9999 }}
                />
              </SubLeftGrid>
              {IssueDateError && (
                <FormHelperText
                  color="primary"
                  style={{
                    marginTop: "-20px",
                    marginLeft: "150px",
                    color: "#f44336",
                  }}
                >
                  *Issue date cannot be empty
                </FormHelperText>
              )}
              <SubLeftText>
                <p
                  className={classes.text}
                  style={{
                    width: "80%",
                  }}
                >
                  Request Qty :
                  <span
                    style={{
                      marginLeft: 20,
                      fontWeight: "normal",
                    }}
                  >
                    {IssueApiValues.request_Qty}
                  </span>
                </p>
                <p
                  className={classes.text}
                  style={{
                    width: "80%",
                  }}
                >
                  Available Qty :
                  <span
                    style={{
                      marginLeft: 20,
                      fontWeight: "normal",
                    }}
                  >
                    {IssueApiValues.available_Qty}
                  </span>
                </p>
                <p
                  className={classes.text}
                  style={{
                    width: "80%",
                  }}
                >
                  Remaining Qty To Issue :
                  <span
                    style={{
                      marginLeft: 20,
                      fontWeight: "normal",
                    }}
                  >
                    {IssueApiValues.request_Qty - SaveIssueValues.issue_Qty}
                  </span>
                </p>
              </SubLeftText>
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
                <SubRightGrid>
                  <p className={classes.text}> Return Due On*:</p>
                  <Picker
                    format="DD/MM/YYYY hh:mm:ss"
                    showTime
                    style={{
                      height: "90%",
                      marginLeft: 15,
                    }}
                    onChange={(e, l) => {
                      setSaveIssueValues({
                        ...SaveIssueValues,
                        expectedReturn_Date: l,
                      });
                      setReturnDateError(false);
                    }}
                    popupStyle={{ zIndex: 9999 }}
                  />
                </SubRightGrid>
              ) : null}
              {ReturnDateError && (
                <FormHelperText
                  color="primary"
                  style={{
                    marginTop: "-20px",
                    marginLeft: "150px",
                    color: "#f44336",
                  }}
                >
                  *Return Due on cannot be empty
                </FormHelperText>
              )}
              <BoxField>
                <p className={classes.text}>Issue Qty* :</p>
                <TextField
                  className={classes.issueText}
                  id="standard-basic"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0, max: IssueApiValues.request_Qty },
                  }}
                  value={SaveIssueValues.issue_Qty}
                  onChange={(e) => {
                    setSaveIssueValues({
                      ...SaveIssueValues,
                      issue_Qty: parseInt(e.target.value),
                    });

                    setQtyError(false);
                    setQtyLessError(false);
                    setQtyMoreError(false);
                  }}
                />
              </BoxField>
              {QtyError && (
                <FormHelperText
                  color="primary"
                  style={{
                    marginTop: "-13px",
                    marginLeft: "150px",
                    color: "#f44336",
                  }}
                >
                  *Issuee cannot be zero
                </FormHelperText>
              )}
              {QtyLessError && (
                <FormHelperText
                  color="primary"
                  style={{
                    marginTop: "-13px",
                    marginLeft: "150px",
                    color: "#f44336",
                  }}
                >
                  *Issue qty cannot be greater than request qty
                </FormHelperText>
              )}
              {QtyMoreError && (
                <FormHelperText
                  color="primary"
                  style={{
                    marginTop: "-13px",
                    marginLeft: "150px",
                    color: "#f44336",
                  }}
                >
                  *Issue qty cannot be greater than available qty
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
                  value={SaveIssueValues.note}
                  onChange={(e) =>
                    setSaveIssueValues({
                      ...SaveIssueValues,
                      note: e.target.value,
                    })
                  }
                />
              </SubRightText>
            </Grid>
          </Grid>
        </IssueBox>
      </Container>
      <Container maxWidth="lg">
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.Checkhead} align="center">
                  <Checkbox
                    checked={
                      checked.length === IssueApiValues.issueAssetDetail.length
                    }
                    onChange={() =>
                      handleChange(0, "all", IssueApiValues.issueAssetDetail)
                    }
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                </TableCell>
                <TableCell className={classes.thead} align="center">
                  Brand
                </TableCell>
                <TableCell className={classes.thead} align="center">
                  Model No.
                </TableCell>
                <TableCell className={classes.thead} align="center">
                  Serial No.
                </TableCell>
                {IssueApiValues.category_Name === "License" ? (
                  <TableCell className={classes.thead} align="center">
                    Product Key
                  </TableCell>
                ) : null}
                <TableCell className={classes.thead} align="center">
                  Asset Status
                </TableCell>
                <TableCell className={classes.thead} align="center">
                  Asset Condition
                </TableCell>
                {IssueApiValues.category_Name === "Vehicle" ? (
                  <TableCell className={classes.thead} align="center">
                    Owner Book Status
                  </TableCell>
                ) : null}
                <TableCell className={classes.thead} align="center">
                  Expiry Date
                </TableCell>
                <TableCell className={classes.thead} align="center">
                  Warranty
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {IssueApiValues.issueAssetDetail.map((row, index, data) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <Checkbox
                      checked={checked.includes(row.assetDetail_ID)}
                      onChange={() => {
                        handleChange(row.assetDetail_ID, "single", data);
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </TableCell>
                  <TableCell align="center">{row.brand}</TableCell>
                  <TableCell align="center">{row.model_No}</TableCell>
                  <TableCell align="center">{row.searial_No}</TableCell>
                  {IssueApiValues.category_Name === "License" ? (
                    <TableCell align="center">{row.product_Key}</TableCell>
                  ) : null}
                  <TableCell align="center">{row.asset_Status}</TableCell>
                  <TableCell align="center">
                    {row.asset_Condition_Status}
                  </TableCell>
                  {IssueApiValues.category_Name === "Vehicle" ? (
                    <TableCell align="center">
                      {row.owner_Book_Status}
                    </TableCell>
                  ) : null}
                  <TableCell align="center">
                    {
                      moment(row.expiry)
                        .format("DD-MM-YYYY")
                        .split("T")[0]
                    }
                  </TableCell>
                  <TableCell align="center">{row.warranty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Buttonarea>
        <Button
          variant="contained"
          color="primary"
          className={classes.savebtn}
          onClick={() => handleonIssue(IssueApiValues.issueAssetDetail)}
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
      {Postsuccess ? (
        <SnackBarSave
          Postsuccess={Postsuccess}
          Setpostsuccess={Setpostsuccess}
        ></SnackBarSave>
      ) : (
        ""
      )}
      {PostError ? (
        <SnackBarSaveError
          PostError={PostError}
          setposterror={setposterror}
        ></SnackBarSaveError>
      ) : (
        ""
      )}
      {checkError ? (
        <SnackBarCheckError
          checkError={checkError}
          setCheckError={setCheckError}
        ></SnackBarCheckError>
      ) : (
        ""
      )}
      {groupDialogOpen.open && (
        <GroupDialog
          setGroupDialogOpen={setGroupDialogOpen}
          groupDialogOpen={groupDialogOpen}
          setAdded={setAdded}
          Added={Added}
        ></GroupDialog>
      )}
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <h4
          style={{
            padding: 20,
          }}
        >
          Employee Information
        </h4>
        <React.Fragment>
          <CssBaseline />
          <Container fixed>
            <InfoBox>
              <LeftText>
                <p className={classes.poptext}>Employee No</p>
                <p className={classes.subText}>
                  {" "}
                  {IssueApiValues.requestBy_Employee_No}
                </p>
              </LeftText>{" "}
              <LeftText>
                <p className={classes.poptext}>Position</p>
                <p className={classes.subText}>
                  {" "}
                  {IssueApiValues.position_Name}
                </p>
              </LeftText>{" "}
              <LeftText>
                <p className={classes.poptext}>Section</p>
                <p className={classes.subText}>
                  {" "}
                  {IssueApiValues.section_Name}
                </p>
              </LeftText>{" "}
              <LeftText>
                <p className={classes.poptext}>Department</p>
                <p className={classes.subText}>
                  {" "}
                  {IssueApiValues.department_Name}
                </p>
              </LeftText>{" "}
              <LeftText>
                <p className={classes.poptext}>Branch</p>
                <p className={classes.subText}> {IssueApiValues.branch_Name}</p>
              </LeftText>{" "}
              <LeftText>
                <p className={classes.poptext}>Location</p>
                <p className={classes.subText}>
                  {" "}
                  {IssueApiValues.location_Name}
                </p>
              </LeftText>{" "}
            </InfoBox>
          </Container>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}
