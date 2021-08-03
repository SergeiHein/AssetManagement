import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import DateFnsUtils from "@date-io/date-fns";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import moment from "moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DateStyles } from "../../layout/components/custom/css/ListForm_Styles";
// import moment from "moment";

const EmailBox = styled.fieldset`
  box-shadow: 0 0px 4px 0px rgba(82, 63, 105, 0.15);
  height: 180px;
  background: white;
  /* @media (max-width: 600px) {
    height: 0px;
  } */
`;

const AlertBox = styled.fieldset`
  box-shadow: 0 0px 4px 0px rgba(82, 63, 105, 0.15);
  min-height: 200px;
  background: white;
  margin-top: 30px;

  /* box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important; */
`;

const DateItem = styled.div`
  display: flex;
  margin: auto;
  text-align: center;
  justify-content: space-evenly;
  margin-top: 20px;
  margin-left: 15px;
`;
const TextItem = styled.div`
  display: flex;
  width: 94%;
  margin: auto;
  text-align: center;
  justify-content: space-evenly;
  margin-top: 20px;
`;

const SubTextItem = styled.div`
  display: flex;
  width: 100%;
  margin: auto;
  text-align: center;
  justify-content: space-evenly;
  margin-top: 20px;
  margin-bottom: 10px;
  @media (max-width: 400px) {
    width: 94%;
  }
`;

const WarrantyItem = styled.div`
  display: flex;
  width: 80%;
  margin: auto;
  text-align: center;
  justify-content: space-evenly;
  margin-top: 20px;
  margin-bottom: 10px;
  @media (max-width: 500px) {
    width: 82%;
  }
  @media (max-width: 450px) {
    width: 88%;
  }
  @media (max-width: 400px) {
    width: 96%;
  }
`;

const OwnerBook = styled.div`
  display: flex;
  width: 84%;
  margin: auto;
  text-align: center;
  justify-content: space-evenly;
  margin-top: 20px;
  margin-bottom: 30px;
  @media (max-width: 400px) {
    width: 97%;
  }
`;

const Buttonarea = styled.div`
  margin-bottom: 40px;
  margin-top: 20px;
  width: 100%;
  text-align: center;
`;

const BoxField = styled.div`
  display: flex;
  margin-left: 20px;
`;

const SubBoxField = styled.div`
  display: flex;
`;

const Topbox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: auto;
`;

const EmailText = styled.legend`
  width: 45%;
  margin-left: 30px;
  font-size: 20px;
  border-radius: 10px;
  background: white;
  @media (max-width: 600px) {
    font-size: 17px;
    width: 70%;
  }
`;

const WarrantyBox = styled(FormControl)`
  width: 45%;
  display: flex;
  align-items: center;
  margin-top: 5px;
  @media (max-width: 500px) {
    width: 51%;
  }
  @media (max-width: 440px) {
    width: 59%;
  }
`;

const OwnerBox = styled(FormControl)`
  width: 54%;
  display: flex;
  margin-top: 5px;
  align-items: flex-end;
  @media (max-width: 600px) {
    width: 57%;
  }
  @media (max-width: 520px) {
    width: 60%;
  }
  @media (max-width: 480px) {
    width: 63%;
  }
  @media (max-width: 450px) {
    width: 75%;
  }
  @media (max-width: 400px) {
    width: 80%;
  }
  @media (max-width: 350px) {
    width: 88%;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  Binput: {
    width: "100px",
    height: "30px",
    padding: "0 15px",
    border: "1px solid #acaeb0",
  },
  Bp: {
    color: "black",
    border: "1px solid #acaeb0",
    height: "30px",
    width: "60px",
    paddingTop: "5px",
  },
  Subinput: {
    width: "100px",
    height: "30px",
    padding: "0 15px",
    border: "1px solid #acaeb0",
  },
  Subp: {
    color: "black",
    border: "1px solid #acaeb0",
    height: "30px",
    width: "60px",
    paddingTop: "5px",
  },
  Alert: {
    width: "10%",
    marginLeft: "30px",
    fontSize: "20px",
    borderRadius: "10px",
    background: "white",
  },

  icon: {
    cursor: "pointer",
    marginLeft: "10px",
    marginBottom: "2px",
    fontSize: "18px",
    "&:hover": {
      color: "#3783e7",
    },
  },
  customWidth: {
    maxWidth: 200,
  },
  datepicker: {
    margin: "-10px 0 10px 0",
    width: "80%",
  },
}));

function Alert(props) {
  return <MuiAlert elevation={2} variant="filled" {...props} />;
}

export default function NotificationPage(props) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);

  const [NotiApi, setNotiApi] = useState({
    notifi_ID: 0,
    notifi_Request: true,
    notifi_CancelRequest: true,
    notifi_Issue: true,
    notifi_CancelIssue: true,
    notifi_Return: true,
    notifi_CancelReturn: true,
    inventory_Alert: true,
    audit_Alert: true,
    audit_Start_Date: "",
    audit_Interval_Day: 0,
    audit_Warning_Day: 0,
    warranty_Alert: true,
    warranty_AlertThreadhold: 0,
    vehicle_ExpiryAlert: true,
    vehicle_AlertThreadhold: 0,
    modified_By: 0,
    message: "",
  });

  useEffect(() => {
    fetch(`${server_path}api/NotifiAlert`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data[0].audit_Start_Date = moment(data[0].audit_Start_Date)
          .format("DD-MM-YYYY")
          .split("T")[0]
          .replace(/-/gi, "/");
        setNotiApi(data[0]);
      });
  }, [server_path, token]);

  const [AuditError, setAuditError] = useState(false);
  const [AuditWarningError, setAuditWarningError] = useState(false);
  const [AlertError, setAlertError] = useState(false);
  const [OwnerError, setOwnerError] = useState(false);
  const [LessError, setLessError] = useState(false);
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [UpdateError, setUpdateError] = useState(false);

  useEffect(() => {
    if (props.location.state) {
      let auditObj = {
        action_By: parseInt(empID),
        event: "View",
        asset_Detail_ID: "0",
        asset_Location_ID: 0,
        asset_ID: 0,
        activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
        assetObject: [],
        categoryObjects: null,
        brandObject: null,
        supplierObject: null,
        typeObject: null,
        statusObject: null,
        locationObject: null,
        allocationObject: [],
        description: "Notification page",
        requestObject: null,
      };

      fetch(`${server_path}api/AuditTrial`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auditObj),
      });
    }
  }, [empID, server_path, token, props.location.state]);

  const handleUpdateBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateSuccess(false);
  };

  const handleUpdateError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateError(false);
  };
  const Apidata = {
    notifi_ID: NotiApi.notifi_ID,
    notifi_Request: NotiApi.notifi_Request,
    notifi_CancelRequest: NotiApi.notifi_CancelRequest,
    notifi_Issue: NotiApi.notifi_Issue,
    notifi_CancelIssue: NotiApi.notifi_CancelIssue,
    notifi_Return: NotiApi.notifi_Return,
    notifi_CancelReturn: NotiApi.notifi_Return,
    inventory_Alert: NotiApi.inventory_Alert,
    audit_Alert: NotiApi.audit_Alert,
    audit_Start_Date: NotiApi.audit_Start_Date,
    audit_Interval_Day: NotiApi.audit_Interval_Day,
    audit_Warning_Day: NotiApi.audit_Warning_Day,
    warranty_Alert: NotiApi.warranty_Alert,
    warranty_AlertThreadhold: NotiApi.warranty_AlertThreadhold,
    vehicle_AlertThreadhold: NotiApi.vehicle_AlertThreadhold,
    vehicle_ExpiryAlert: NotiApi.vehicle_ExpiryAlert,
  };

  function handleonSubmit(e) {
    e.preventDefault();

    if (NotiApi.audit_Interval_Day === 0 || isNaN(NotiApi.audit_Interval_Day)) {
      setAuditError(true);
    } else {
      setAuditError(false);

      if (NotiApi.audit_Warning_Day === 0 || isNaN(NotiApi.audit_Warning_Day)) {
        setAuditWarningError(true);
      } else {
        setAuditWarningError(false);

        if (
          NotiApi.warranty_AlertThreadhold === 0 ||
          isNaN(NotiApi.warranty_AlertThreadhold)
        ) {
          setAlertError(true);
        } else {
          setAlertError(false);

          if (
            NotiApi.vehicle_AlertThreadhold === 0 ||
            isNaN(NotiApi.vehicle_AlertThreadhold)
          ) {
            setOwnerError(true);
          } else {
            setOwnerError(false);

            if (NotiApi.audit_Warning_Day > NotiApi.audit_Interval_Day) {
              setLessError(true);
            } else {
              setLessError(false);
              fetch(`${server_path}api/NotifiAlert`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(Apidata),
              }).then((res) => {
                if (res.status === 200) {
                  // fetch(`${server_path}api/NotifiAlert`, {
                  //   headers: {
                  //     Authorization: `Bearer ${token}`,
                  //   },
                  // })
                  //   .then((res) => res.json())
                  //   .then((data) => setNotiApi(data));
                  setUpdateSuccess(true);
                } else {
                  setUpdateError(true);
                }
              });
            }
          }
        }
      }
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <EmailBox>
          <EmailText>Send notification Emails</EmailText>
          <Grid
            container
            spacing={3}
            style={{
              flexWrap: "nowrap",
            }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                textAlign: "center",
              }}
            >
              <FormControl component="div">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={NotiApi.notifi_Request}
                      onChange={() => {
                        setNotiApi({
                          ...NotiApi,
                          notifi_Request: !NotiApi.notifi_Request,
                        });
                      }}
                      style={{
                        float: "right",
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="Request"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={NotiApi.notifi_Issue}
                      onChange={() => {
                        setNotiApi({
                          ...NotiApi,
                          notifi_Issue: !NotiApi.notifi_Issue,
                        });
                      }}
                      style={{
                        float: "right",
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="Issue"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={NotiApi.notifi_Return}
                      onChange={() => {
                        setNotiApi({
                          ...NotiApi,
                          notifi_Return: !NotiApi.notifi_Return,
                        });
                      }}
                      style={{
                        float: "right",
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="Return"
                  labelPlacement="end"
                />
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                textAlign: "center",
              }}
            >
              <FormControl component="div">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={NotiApi.notifi_CancelRequest}
                      onChange={() => {
                        setNotiApi({
                          ...NotiApi,
                          notifi_CancelRequest: !NotiApi.notifi_CancelRequest,
                        });
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="Cancel Request"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={NotiApi.notifi_CancelIssue}
                      onChange={() => {
                        setNotiApi({
                          ...NotiApi,
                          notifi_CancelIssue: !NotiApi.notifi_CancelIssue,
                        });
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="Cancel Issue"
                  labelPlacement="end"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={NotiApi.notifi_CancelReturn}
                      onChange={() => {
                        setNotiApi({
                          ...NotiApi,
                          notifi_CancelReturn: !NotiApi.notifi_CancelReturn,
                        });
                      }}
                      style={{
                        float: "right",
                      }}
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  }
                  label="Cancel Return"
                  labelPlacement="end"
                />
              </FormControl>
            </Grid>
          </Grid>
        </EmailBox>
        <AlertBox>
          <legend className={classes.Alert}>Alerts</legend>
          <Topbox>
            <FormControl component="div" className={classes.StartBox}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={NotiApi.inventory_Alert}
                    onChange={() => {
                      setNotiApi({
                        ...NotiApi,
                        inventory_Alert: !NotiApi.inventory_Alert,
                      });
                    }}
                    style={{
                      float: "right",
                    }}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
                label="Inventory Alert Threshold"
                labelPlacement="end"
              />
            </FormControl>
            <FormControl component="div" className={classes.AuditBox}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={NotiApi.audit_Alert}
                    onChange={() => {
                      setNotiApi({
                        ...NotiApi,
                        audit_Alert: !NotiApi.audit_Alert,
                      });
                    }}
                    style={{
                      float: "right",
                    }}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
                label="Audit Alert"
                labelPlacement="end"
              />
            </FormControl>
          </Topbox>
          {NotiApi.audit_Alert ? (
            <div>
              <DateItem>
                <div>
                  <p>Audit Start Date</p>
                </div>
                <div
                  style={{
                    height: "30px",
                    marginLeft: "40px",
                  }}
                >
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateStyles
                      className={classes.datepicker}
                      margin="normal"
                      id="date-picker-dialog"
                      format="dd/MM/yyyy"
                      inputValue={NotiApi.audit_Start_Date}
                      maxDate={new Date()}
                      onChange={(e) => {
                        setNotiApi({
                          ...NotiApi,
                          audit_Start_Date: moment(e)
                            .format("DD-MM-YYYY")
                            .split("T")[0]
                            .replace(/-/gi, "/"),
                        });
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </DateItem>
              <TextItem>
                <div>
                  <p>
                    Audit Interval Day
                    <Tooltip
                      title="Number of interval in months to regularly physically audit the assets"
                      placement="top"
                      arrow
                      classes={{ tooltip: classes.customWidth }}
                    >
                      <InfoOutlinedIcon className={classes.icon} />
                    </Tooltip>
                  </p>
                </div>
                <div
                  style={{
                    height: "30px",
                  }}
                >
                  <BoxField>
                    <input
                      className={classes.Binput}
                      type="number"
                      min="0"
                      value={NotiApi.audit_Interval_Day}
                      onChange={(e) => {
                        setNotiApi({
                          ...NotiApi,
                          audit_Interval_Day: parseInt(e.target.value),
                        });
                        setAuditError(false);
                      }}
                    ></input>

                    <div>
                      <p className={classes.Bp}>days</p>
                    </div>
                  </BoxField>
                </div>
              </TextItem>
              {AuditError && (
                <p
                  style={{
                    color: "#f44336",
                    width: "50%",
                    float: "right",
                    marginBottom: "20px",
                  }}
                >
                  *Audit interval cannot be Empty
                </p>
              )}
              <SubTextItem>
                <div>
                  <p>
                    Audit Warning Day
                    <Tooltip
                      title="Number of days in advance for warning assets are due for auditing"
                      placement="top"
                      arrow
                      classes={{ tooltip: classes.customWidth }}
                    >
                      <InfoOutlinedIcon className={classes.icon} />
                    </Tooltip>
                  </p>
                </div>
                <div
                  style={{
                    height: "30px",
                  }}
                >
                  <SubBoxField>
                    <input
                      className={classes.Subinput}
                      type="number"
                      min="0"
                      value={NotiApi.audit_Warning_Day}
                      onChange={(e) => {
                        setNotiApi({
                          ...NotiApi,
                          audit_Warning_Day: parseInt(e.target.value),
                        });
                        setAuditWarningError(false);
                      }}
                    ></input>
                    <div>
                      <p className={classes.Subp}>days</p>
                    </div>
                  </SubBoxField>
                </div>
              </SubTextItem>
              {AuditWarningError && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <p
                    style={{
                      color: "#f44336",
                      width: "60%",
                    }}
                  >
                    *Audit warning Threshold cannot be empty
                  </p>
                </div>
              )}
              {LessError && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <p
                    style={{
                      color: "#f44336",
                      width: "60%",
                    }}
                  >
                    *Audit warning cannot be greater than audit interval
                  </p>
                </div>
              )}
              <hr></hr>
            </div>
          ) : null}

          <WarrantyBox>
            <FormControl component="div" className={classes.StartBox}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={NotiApi.warranty_Alert}
                    onChange={() => {
                      setNotiApi({
                        ...NotiApi,
                        warranty_Alert: !NotiApi.warranty_Alert,
                      });
                    }}
                    style={{
                      float: "right",
                    }}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
                label="Warranty Alert"
                labelPlacement="end"
              />
            </FormControl>
          </WarrantyBox>
          {NotiApi.warranty_Alert ? (
            <div
              style={{
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <WarrantyItem>
                <div>
                  <p>
                    Warranty Alert Threshold
                    <Tooltip
                      title="Number of days in advance for warranty assets are due for warranty alert"
                      placement="top"
                      arrow
                      classes={{ tooltip: classes.customWidth }}
                    >
                      <InfoOutlinedIcon className={classes.icon} />
                    </Tooltip>
                  </p>
                </div>
                <div
                  style={{
                    height: "30px",
                  }}
                >
                  <BoxField>
                    <input
                      className={classes.Binput}
                      type="number"
                      min="0"
                      value={NotiApi.warranty_AlertThreadhold}
                      onChange={(e) => {
                        setNotiApi({
                          ...NotiApi,
                          warranty_AlertThreadhold: parseInt(e.target.value),
                        });
                        setAlertError(false);
                      }}
                    ></input>
                    <div>
                      <p className={classes.Bp}>days</p>
                    </div>
                  </BoxField>
                </div>
              </WarrantyItem>
              {AlertError && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <p
                    style={{
                      color: "#f44336",
                      width: "60%",
                    }}
                  >
                    *Warranty alert threadhold cannot be empty
                  </p>
                </div>
              )}
            </div>
          ) : null}

          <OwnerBox>
            <FormControlLabel
              control={
                <Checkbox
                  checked={NotiApi.vehicle_ExpiryAlert}
                  onChange={() => {
                    setNotiApi({
                      ...NotiApi,
                      vehicle_ExpiryAlert: !NotiApi.vehicle_ExpiryAlert,
                    });
                  }}
                  style={{
                    float: "right",
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label="Vehicle Owner Book Expiry Alert"
              labelPlacement="end"
            />
          </OwnerBox>
          {NotiApi.vehicle_ExpiryAlert ? (
            <div>
              <OwnerBook>
                <div>
                  <p>
                    Vehicle Alert Threshold
                    <Tooltip
                      title="Number of days in advance for expire assets are due for expiry alert"
                      placement="top"
                      arrow
                      classes={{ tooltip: classes.customWidth }}
                    >
                      <InfoOutlinedIcon className={classes.icon} />
                    </Tooltip>
                  </p>
                </div>
                <div
                  style={{
                    height: "30px",
                  }}
                >
                  <BoxField>
                    <input
                      className={classes.Binput}
                      type="number"
                      min="0"
                      value={NotiApi.vehicle_AlertThreadhold}
                      onChange={(e) => {
                        setNotiApi({
                          ...NotiApi,
                          vehicle_AlertThreadhold: parseInt(e.target.value),
                        });
                        setOwnerError(false);
                      }}
                    ></input>
                    <div>
                      <p className={classes.Bp}>days</p>
                    </div>
                  </BoxField>
                </div>
              </OwnerBook>
              {OwnerError && (
                <p
                  style={{
                    color: "#f44336",
                    width: "56%",
                    float: "right",
                    marginBottom: "20px",
                    marginTop: "-20px",
                  }}
                >
                  *Expiry alert threadhold cannot be empty
                </p>
              )}
            </div>
          ) : null}
        </AlertBox>

        <Buttonarea>
          <Button
            variant="contained"
            color="primary"
            style={{
              width: "20%",
              color: "white",
            }}
            onClick={handleonSubmit}
          >
            save
          </Button>
        </Buttonarea>
        {UpdateSuccess ? (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={UpdateSuccess}
            autoHideDuration={3000}
            onClose={handleUpdateBar}
          >
            <Alert onClose={handleUpdateBar} severity="info">
              This setting has saved successfully!
            </Alert>
          </Snackbar>
        ) : (
          ""
        )}
        {UpdateError ? (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={UpdateError}
            autoHideDuration={2000}
            onClose={handleUpdateError}
          >
            <Alert onClose={handleUpdateError} severity="error">
              There is a problem saving this setting. Please try again.
            </Alert>
          </Snackbar>
        ) : (
          ""
        )}
      </Container>
    </React.Fragment>
  );
}
