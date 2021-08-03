import React, { useState, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { EditableFormStyles } from "../../../layout/components/custom/css/FormTableGrid_Styles";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
// import { KTCookie } from "../../../../_metronic/";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LeftGrid = styled.div`
  margin-top: 25px;
  width: 30%;
  display: flex;
  justify-content: flex-end;
`;

const RightGrid = styled.div`
  width: 40%;
`;

const FirstGrid = styled.div`
  width: 500px;
  display: flex;
  justify-content: space-around;
`;

const Buttonarea = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  /* align-items: center; */
  justify-content: space-evenly;
`;

const CheckArea = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 93%;
  margin-top: 20px;
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

const useStyles = makeStyles({
  table: {
    width: 600,
  },
  container: {
    maxHeight: 440,
    boxShadow: 0,
  },
  formControl: {
    width: "100%",
  },
  savebtn: {
    height: "30px",
    width: "20%",

    color: "#fff",
    // background:"#3783e7",
  },
  cancelbtn: {
    marginLeft: "10px",
    height: "30px",
    width: "20%",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography
        variant="h6"
        style={{
          textAlign: "center",
        }}
      >
        {children}
      </Typography>
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

export default function AddNewPopUp({
  PopUp,
  setPopUp,
  newData,
  setNewData,
  GetApi,
  setGetApi,
  Setpostsuccess,
  setposterror,
  Apidata,
  PopUpId,
  Added,
  setAdded,
  SelectedData,
  treeViewData,
}) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);

  let grouped = treeViewData.reduce((rv, x) => {
    (rv[x["Group_List"]] = rv[x["Group_List"]] || []).push(x);
    return rv;
  }, []);

  // console.log(grouped);

  let filtered = grouped.filter((one) => {
    return one.find((two) => {
      console.log(two.AssetLocation_ID);
      return two.AssetLocation_ID === SelectedData.asset_Location_ID;
    });
  });

  console.log(...filtered);
  // console.log(SelectedData);

  const handleClose = () => {
    setPopUp(false);
    setNewData({
      asset_Location_ID: 0,
      asset_Location_Name: "",
      asset_Location_Description: "",
      parent_ID: 0,
      location_Type: "",
      hrLocation_ID: 0,
      tag_Prefix: "",
      created_By: 0,
      modified_By: 0,
      active: true,
    });
  };

  const [TypeError, setTypeError] = useState(false);
  const [LocationError, setLocationError] = useState(false);
  const [DeptError, setDeptError] = useState(false);
  const [SectionError, setSectionError] = useState(false);
  const [BranchError, setBranchError] = useState(false);
  const [AssetError, setAssetError] = useState(false);
  const [helperAssetText, SethelperAssetText] = useState();
  const [AuditLocation, setAuditLocation] = useState();
  const [locationType, setLocationType] = useState();
  const [filterError, setFilterError] = useState(false);
  // const [helperFilterText, SethelperFilterText] = useState();

  function handleChange() {
    setNewData((prevProps) => ({ ...prevProps, active: !prevProps.active }));
  }

  const [SelectData, setSelectData] = useState("");

  const handleSelect = (e) => {
    setSelectData(e.target.value);
    setTypeError(false);
    setFilterError(false);
    setLocationType(e.currentTarget.dataset.name);
  };

  const [LocationData, setLocationData] = useState("");

  const handleLocation = (e) => {
    setLocationData(e.target.value);
    setLocationError(false);
    setNewData({
      ...newData,
      hrLocation_ID: e.target.value,
      // asset_Location_Name: e.currentTarget.dataset.name,
    });
    setAuditLocation(e.currentTarget.dataset.name);
  };

  const [DeptData, setDeptData] = useState("");

  const handleDept = (e) => {
    setDeptData(e.target.value);
    setDeptError(false);
    setNewData({
      ...newData,
      hrLocation_ID: e.target.value,
      // asset_Location_Name: e.currentTarget.dataset.name,
    });
    setAuditLocation(e.currentTarget.dataset.name);
  };
  const [SectionData, setSectionData] = useState("");

  const handleSetion = (e) => {
    setSectionData(e.target.value);
    setSectionError(false);
    setNewData({
      ...newData,
      hrLocation_ID: e.target.value,
      // asset_Location_Name: e.currentTarget.dataset.name,
    });
    setAuditLocation(e.currentTarget.dataset.name);
  };

  const [BranchData, setBranchData] = useState("");

  const handleBranch = (e) => {
    setBranchData(e.target.value);
    setBranchError(false);
    setNewData({
      ...newData,
      hrLocation_ID: e.target.value,
      // asset_Location_Name: e.currentTarget.dataset.name,
    });
    setAuditLocation(e.currentTarget.dataset.name);
  };

  // const [AssetData, setAssetData] = useState("");

  // const HandleAsset = (e) => {
  //   setAssetData(e.target.value);
  //   setAssetError(false);
  // };

  const [LocationApi, setLocationApi] = useState([
    {
      location_ID: "",
      location_Name: "",
    },
  ]);

  const [BranchApi, setBranchApi] = useState([
    {
      branch_ID: "",
      branch_Name: "",
      description: null,
    },
  ]);

  const [DepartmentApi, setDepartmentApi] = useState([
    {
      department_ID: "",
      department_Name: "",
      description: null,
      remark: null,
    },
  ]);

  const [SectiontApi, setSectionApi] = useState([
    {
      section_ID: "",
      section_Name: "",
      description: null,
      remark: null,
    },
  ]);

  useEffect(() => {
    fetch(`${server_path}api/location/Get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocationApi(data);
      });
  }, [server_path, token]);

  useEffect(() => {
    fetch(`${server_path}api/branch?EmployeeID=${empID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data === "object") {
          setBranchApi(data);
        } else {
          setBranchApi(data);
        }
      });
  }, [server_path, token, empID]);

  useEffect(() => {
    fetch(`${server_path}api/Department`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDepartmentApi(data));
  }, [server_path, token]);

  useEffect(() => {
    fetch(`${server_path}api/Section`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSectionApi(data));
  }, [server_path, token]);

  const [tempData, setTempData] = useState(...filtered);
  // console.log(tempData);

  function handleonSubmit(e) {
    e.preventDefault();
    let AuditData;

    const filterData = tempData.some((data) => {
      return (
        data.Location_Type === locationType && locationType !== "Asset Location"
      );
    });
    if (SelectData === "") {
      setTypeError(true);
    } else {
      setTypeError(false);
      if (SelectData === 1 && LocationData === "") {
        setLocationError(true);
      } else {
        setLocationError(false);
        if (SelectData === 3 && DeptData === "") {
          setDeptError(true);
        } else {
          setDeptError(false);
          if (SelectData === 2 && BranchData === "") {
            setBranchError(true);
          } else {
            setBranchError(false);
            if (SelectData === 4 && SectionData === "") {
              setSectionError(true);
            } else {
              setSectionError(false);
              if (SelectData === 5 && newData.asset_Location_Name === "") {
                setAssetError(true);
                SethelperAssetText("*Asset Branch cannot be empty");
              } else {
                setAssetError(false);
                SethelperAssetText("");

                if (filterData === true) {
                  setFilterError(true);
                } else {
                  setFilterError(false);
                  fetch(`${server_path}api/AssetLocation`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(Apidata),
                  }).then((res) => {
                    if (res.status === 200) {
                      if (newData.location_Type === 5) {
                        AuditData = {
                          activity_Date: moment(new Date()).format(
                            "DD/MM/YYYY hh:mm:ss"
                          ),
                          action_By: parseInt(empID),
                          event: "Entry",
                          asset_Detail_ID: "0",
                          asset_ID: 0,
                          assetLocation_ID: 0,
                          description: "",
                          assetObject: [],
                          categoryObjects: null,
                          brandObject: null,
                          supplierObject: null,
                          typeObject: null,
                          statusObject: null,
                          locationObject: {
                            locationName: newData.asset_Location_Name,
                            tagPrefix: newData.tag_Prefix,
                            description: newData.asset_Location_Description,
                            active: `${newData.active}`,
                          },
                          allocationObject: [],
                          requestObject: null,
                        };
                      } else {
                        AuditData = {
                          activity_Date: moment(new Date()).format(
                            "DD/MM/YYYY hh:mm:ss"
                          ),
                          action_By: parseInt(empID),
                          event: "Entry",
                          asset_Detail_ID: "0",
                          asset_ID: 0,
                          assetLocation_ID: 0,
                          description: "",
                          assetObject: [],
                          categoryObjects: null,
                          brandObject: null,
                          supplierObject: null,
                          typeObject: null,
                          statusObject: null,
                          locationObject: {
                            locationName: AuditLocation,
                            tagPrefix: newData.tag_Prefix,
                            description: newData.asset_Location_Description,
                            active: `${newData.active}`,
                          },
                          allocationObject: [],
                          requestObject: null,
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

                      setGetApi([...GetApi, newData]);

                      setNewData({
                        asset_Location_ID: 0,
                        asset_Location_Name: "",
                        asset_Location_Description: "",
                        parent_ID: 0,
                        location_Type: "",
                        hrLocation_ID: 0,
                        tag_Prefix: "",
                        created_By: 0,
                        modified_By: 0,
                        active: true,
                      });
                      setPopUp(false);
                      setAdded(!Added);
                      Setpostsuccess(true);
                    } else {
                      setposterror(true);
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="customized-dialog-title"
      open={PopUp}
      maxWidth="md"
      style={{
        marginTop: "50px",
        overflow: "none",
        minHeight: "600px",
      }}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        style={{
          background: "rgba(153,203,254,1)",
          color: "#fff",
        }}
      >
        Add New Location
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FirstGrid>
              <LeftGrid>
                <p>Location Type :</p>
              </LeftGrid>
              <RightGrid>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Location Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    onChange={handleSelect}
                    value={newData.location_Type}
                    onClick={(e) => {
                      setNewData({
                        ...newData,
                        location_Type: e.target.value,
                      });
                      setNewData((prevProps) => ({
                        ...prevProps,
                        hrLocation_ID: "",
                      }));
                      setNewData((prevProps) => ({
                        ...prevProps,
                        parent_ID: PopUpId,
                      }));
                    }}
                  >
                    <MenuItem value={1} data-name="Location">
                      Location
                    </MenuItem>
                    <MenuItem value={2} data-name="Branch">
                      Branch
                    </MenuItem>
                    <MenuItem value={3} data-name="Department">
                      Department
                    </MenuItem>
                    <MenuItem value={4} data-name="Section">
                      Section
                    </MenuItem>
                    <MenuItem value={5} data-name="Asset Location">
                      Asset Location
                    </MenuItem>
                  </Select>
                  {TypeError ? (
                    <FormHelperText
                      style={{
                        color: "#f44336",
                      }}
                    >
                      *Location Type cannot be empty
                    </FormHelperText>
                  ) : null}
                  {filterError ? (
                    <FormHelperText
                      style={{
                        color: "#f44336",
                      }}
                    >
                      Location Type cannot be the same as parents!
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </RightGrid>
            </FirstGrid>
          </Grid>
        </Grid>
        {newData.location_Type === 1 ? (
          <Grid item xs={12}>
            <FirstGrid>
              <LeftGrid>
                <p>Location :</p>
              </LeftGrid>
              <RightGrid>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Location
                  </InputLabel>

                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    onChange={handleLocation}
                    value={newData.hrLocation_ID}
                  >
                    {LocationApi.map((subrow) => (
                      <MenuItem
                        key={subrow.location_ID}
                        value={subrow.location_ID}
                        data-name={subrow.location_Name}
                      >
                        {subrow.location_Name}
                      </MenuItem>
                    ))}
                  </Select>
                  {LocationError ? (
                    <FormHelperText
                      style={{
                        color: "#f44336",
                      }}
                    >
                      *Location cannot be empty
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </RightGrid>
            </FirstGrid>
          </Grid>
        ) : null}

        {newData.location_Type === 2 ? (
          <Grid item xs={12}>
            <FirstGrid>
              <LeftGrid>
                <p>Branch :</p>
              </LeftGrid>
              <RightGrid>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Branch
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    onChange={handleBranch}
                    value={newData.hrLocation_ID}
                  >
                    {BranchApi.map((data) => (
                      <MenuItem
                        key={data.branch_ID}
                        data-name={data.branch_Name}
                        value={data.branch_ID}
                      >
                        {data.branch_Name}
                      </MenuItem>
                    ))}
                  </Select>
                  {BranchError ? (
                    <FormHelperText
                      style={{
                        color: "#f44336",
                      }}
                    >
                      *Branch cannot be empty
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </RightGrid>
            </FirstGrid>
          </Grid>
        ) : null}
        {newData.location_Type === 3 ? (
          <Grid item xs={12}>
            <FirstGrid>
              <LeftGrid>
                <p>Department :</p>
              </LeftGrid>
              <RightGrid>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    onChange={handleDept}
                    value={newData.hrLocation_ID}
                  >
                    {DepartmentApi.map((data) => (
                      <MenuItem
                        key={data.department_ID}
                        value={data.department_ID}
                        data-name={data.department_Name}
                      >
                        {data.department_Name}
                      </MenuItem>
                    ))}
                  </Select>
                  {DeptError ? (
                    <FormHelperText
                      style={{
                        color: "#f44336",
                      }}
                    >
                      *Department cannot be empty
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </RightGrid>
            </FirstGrid>
          </Grid>
        ) : null}
        {newData.location_Type === 4 ? (
          <Grid item xs={12}>
            <FirstGrid>
              <LeftGrid>
                <p>Section :</p>
              </LeftGrid>
              <RightGrid>
                <FormControl required className={classes.formControl}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Section
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    onChange={handleSetion}
                    value={newData.hrLocation_ID}
                  >
                    {SectiontApi.map((data) => (
                      <MenuItem
                        key={data.section_ID}
                        data-name={data.section_Name}
                        value={data.section_ID}
                      >
                        {data.section_Name}
                      </MenuItem>
                    ))}
                  </Select>
                  {SectionError ? (
                    <FormHelperText
                      style={{
                        color: "#f44336",
                      }}
                    >
                      *Section cannot be empty{" "}
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </RightGrid>
            </FirstGrid>
          </Grid>
        ) : null}
        {newData.location_Type === 5 ? (
          <div>
            <Grid item xs={12}>
              <FirstGrid>
                <LeftGrid>
                  <p>Asset Location :</p>
                </LeftGrid>
                <RightGrid>
                  <EditableFormStyles>
                    <div>
                      <TextField
                        required
                        style={{
                          width: "100%",
                        }}
                        id="Ast Location"
                        label="Asset Location"
                        helperText={helperAssetText}
                        error={AssetError}
                        value={newData.asset_Location_Name}
                        onChange={(e) => {
                          setNewData({
                            ...newData,
                            asset_Location_Name: e.target.value,
                          });
                          setAssetError(false);
                          setNewData((prevProps) => ({
                            ...prevProps,
                            hrLocation_ID: 0,
                          }));
                        }}
                      />
                    </div>
                  </EditableFormStyles>
                </RightGrid>
              </FirstGrid>
            </Grid>
          </div>
        ) : null}
        <Grid item xs={12}>
          <FirstGrid>
            <LeftGrid>
              <p>Tag Prefix:</p>
            </LeftGrid>
            <RightGrid>
              <form className={classes.root} noValidate autoComplete="off">
                <div>
                  <TextField
                    style={{
                      width: "100%",
                    }}
                    id="Tag Prefix"
                    label="Tag Prefix"
                    value={newData.tag_Prefix}
                    onChange={(e) =>
                      setNewData({
                        ...newData,
                        tag_Prefix: e.target.value,
                      })
                    }
                    // type="password"
                  />
                </div>
              </form>
            </RightGrid>
          </FirstGrid>
        </Grid>
        <Grid item xs={12}>
          <FirstGrid>
            <LeftGrid>
              <p>Description :</p>
            </LeftGrid>
            <RightGrid>
              <form className={classes.root} noValidate autoComplete="off">
                <div>
                  <TextField
                    style={{
                      width: "100%",
                    }}
                    id="Description"
                    label="Description"
                    multiline
                    rowsMax={4}
                    value={newData.asset_Location_Description}
                    onChange={(e) =>
                      setNewData({
                        ...newData,
                        asset_Location_Description: e.target.value,
                      })
                    }
                  />
                </div>
              </form>
            </RightGrid>
          </FirstGrid>
        </Grid>
        <CheckArea>
          <FormControlLabel
            control={
              <Checkbox
                checked={newData.active}
                onChange={handleChange}
                style={{
                  float: "left",
                }}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="Active"
            labelPlacement="start"
          />
        </CheckArea>
        <Buttonarea>
          <Button
            variant="contained"
            color="primary"
            className={classes.savebtn}
            onClick={handleonSubmit}
          >
            Save
          </Button>
          <Button
            color="secondary"
            className={classes.cancelbtn}
            onClick={() => {
              setPopUp(false);
              setNewData({
                asset_Location_ID: 0,
                asset_Location_Name: "",
                asset_Location_Description: "",
                parent_ID: 0,
                location_Type: "",
                hrLocation_ID: 0,
                tag_Prefix: "",
                created_By: 0,
                modified_By: 0,
                active: true,
              });
            }}
          >
            Cancel
          </Button>
        </Buttonarea>
      </DialogContent>
    </Dialog>
  );
}
