import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useSubheader } from "../../../layout";
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment";
// import { DatePicker, Select, Space } from "antd";
import {
  Picker,
  CheckBoxLabel,
} from "../../../layout/components/custom/css/RequestedIndex_Styles";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import MakeTableData from "./MakeTableData";
import MakeTable from "./MakeTable";
import { KTCookie } from "../../../../_metronic/_assets/js/components/cookie";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import DetailDialog from "../../TableTest/asset_allocation/DetailDialog";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import {
  TreeViewDropDown,
  IssueDropDown,
} from "../../../layout/components/custom/css/ListForm_Styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import ESign from "../ESign";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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
  // savebtn: {
  //   height: "30px",
  //   width: "200px",
  //   color: "#fff",
  // },

  // cancelbtn: {
  //   marginLeft: "20px",
  //   height: "30px",
  //   width: "10%",
  // },
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

const SignatureSection = styled.form`
  background: #fff;
  width: 70%;
  min-height: 450px;
  margin: 75px auto 0 auto;
  padding: 35px;
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  .svg-wrapper {
    width: 70px;
    height: 70px;
    /* background: #6993ff; */
    background: #fff;
    border: 1px solid #e6e6e6;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);

    svg {
      width: 28px;
      height: 28px;
      /* fill: #000; */
    }
  }

  @media (max-width: 600px) {
    width: 100%;

    .MuiTypography-h5 {
      font-size: 1.1rem !important;
    }

    .svg-wrapper {
      width: 60px;
      height: 60px;
    }
  }
`;
const RadioGrouopStyles = styled(RadioGroup)`
  @media (max-width: 400px) {
    .accept-label,
    .decline-label {
      margin-bottom: 0 !important;
    }
  }
`;

const SubmitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;

  .submit-btn {
    background: rgba(54, 153, 255, 0.75);
    padding: 8px 45px;
    color: #fff;
    min-height: 35px;
    box-shadow: none;
  }

  @media (max-width: 600px) {
    .submit-btn {
      min-height: 25px;
    }
  }

  @media (max-width: 400px) {
    /* text-align: center; */

    margin: 10px auto 0 auto;
    .submit-btn {
      min-height: 25px;
    }
  }
`;

export default function MultiAcceptanceIndex(props) {
  const classes = useStyles();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Multi Assets Acceptance");
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
  const [SignError, setSignError] = useState(false);
  const [clickedSubmit, setClickedSubmit] = useState(false);

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

  const [formData, setFormData] = useState({
    signature: "",
    issue_ID: 0,
    request_By_ID: parseInt(empID),
    accepted: true,
    asset_Location_ID: 0,
    self_Request: true,
    created_By: parseInt(empID),
    modified_By: parseInt(empID),
  });

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
  function handleChangeRadio() {
    setFormData((prevProps) => ({
      ...prevProps,
      accepted: !prevProps.accepted,
    }));
  }

  function handleOnSubmit(e) {
    // e.preventDefault();
    // setFormData({
    //   signature: "",
    //   issue_ID: parseInt(issueID),
    //   request_By_ID: parseInt(empID),
    //   accepted: true,
    //   asset_Location_ID: 0,
    //   self_Request: true,
    //   created_By: parseInt(empID),
    //   modified_By: parseInt(empID),
    // });
    setClickedSubmit(!clickedSubmit);
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
      {/* <Buttonarea>
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
      </Buttonarea> */}
      {dialogOpen.open && (
        <DetailDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        ></DetailDialog>
      )}
      <SignatureSection onSubmit={handleOnSubmit}>
        <span className="svg-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            enableBackground="new 0 0 512 512"
            viewBox="0 0 25.588 25.588"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="#6993ff"
              d="M18.724 9.903l3.855 1.416-3.206 8.729c-.3.821-1.927 3.39-3.06 3.914l-.275.75a.472.472 0 01-.603.28.47.47 0 01-.279-.604l.26-.709c-.575-1.117-.146-4.361.106-5.047l3.202-8.729zM24.303.667c-1.06-.388-2.301.414-2.656 1.383l-2.322 6.326 3.854 1.414 2.319-6.325c.292-.792-.133-2.409-1.195-2.798zm-6.975 8.909a.942.942 0 001.209-.555l2.45-6.608a.942.942 0 00-1.764-.653l-2.45 6.608a.94.94 0 00.555 1.208zm-3.944 12.391c-.253-.239-.568-.537-1.078-.764-.42-.187-.829-.196-1.128-.203l-.103-.002c-.187-.512-.566-.834-1.135-.96-.753-.159-1.354.196-1.771.47.037-.21.098-.46.143-.64.144-.58.292-1.18.182-1.742a1.003 1.003 0 00-.914-.806c-1.165-.065-2.117.562-2.956 1.129-.881.595-1.446.95-2.008.749-.686-.244-.755-2.101-.425-3.755.295-1.49.844-4.264 2.251-5.524.474-.424 1.16-.883 1.724-.66.663.26 1.211 1.352 1.333 2.653a.996.996 0 001.089.902.999.999 0 00.902-1.089c-.198-2.12-1.192-3.778-2.593-4.329-.839-.326-2.173-.414-3.79 1.033-1.759 1.575-2.409 4.246-2.88 6.625-.236 1.188-.811 5.13 1.717 6.029 1.54.549 2.791-.298 3.796-.976.184-.124.365-.246.541-.355-.167.725-.271 1.501.167 2.155.653.982 1.576 1.089 2.742.321.045-.029.097-.063.146-.097.108.226.299.475.646.645.42.206.84.216 1.146.224.131.003.31.007.364.031.188.083.299.185.515.389.162.153.333.312.55.476a1 1 0 001.198-1.601c-.145-.112-.26-.223-.371-.328z"
              data-original="#030104"
            ></path>
          </svg>
        </span>

        <FormControl component="fieldset">
          <RadioGrouopStyles
            aria-label="gender"
            name="gender1"
            value={formData.accepted}
            onChange={handleChangeRadio}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Accept"
              className="accept-label"
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="Decline"
              className="decline-label"
            />
          </RadioGrouopStyles>
        </FormControl>

        <ESign
          formData={formData}
          setFormData={setFormData}
          clickedSubmit={clickedSubmit}
          SignError={SignError}
          setSignError={setSignError}

          // sigRef={sigRef}
        ></ESign>
        {formData.signature !== "" && (
          <SubmitBtn>
            <Button
              // variant="contained"
              type="submit"
              className="submit-btn"
              // onClick={HandleSave}
            >
              Submit
            </Button>
          </SubmitBtn>
        )}
      </SignatureSection>
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
