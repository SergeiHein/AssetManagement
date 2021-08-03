import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useSubheader } from "../../../layout";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Box from "@material-ui/core/Box";
import DetailTab from "./DetailTab";
import IssueReturn from "./IssueReturn";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { Tabs } from "antd";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import { useHistory } from "react-router-dom";
import moment from "moment";
import ReturnPopUpIndex from "./ReturnPopUpIndex";
import IssuePopUpIndex from "./IssuePopUpIndex";
import CollectionsIcon from "@material-ui/icons/Collections";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import BuildIcon from "@material-ui/icons/Build";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import CachedIcon from "@material-ui/icons/Cached";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import DeleteIcon from "@material-ui/icons/Delete";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import WarrantyIndex from "./Warranty/WarrantyIndex";
import PurchasedIndex from "./PurchasedIndex";
import HistoryIndex from "./History/HistoryIndex";
import { SnackBarSave, SnackBarSaveError } from "./AssetSnackBar";
import { KTCookie } from "../../../../_metronic/_assets/js/components/cookie";
import EditDetailForm from "./EditDetailForm";
import ReserveIndex from "./Reserve/ReserveIndex";

const DetailImg = styled.img`
  width: 100%;
  max-height: 100px;
  object-fit: contain;
  cursor: pointer;
`;

const FirstSection = styled.div`
  .MuiPaper-root {
    padding: 15px;
  }

  .MuiCardContent-root {
    padding: 0px !important;
    margin-bottom: 10px;
  }
`;

const TopSection = styled.div`
  box-shadow: 0 0px 4px 0px rgba(82, 63, 105, 0.15);
  background: white;
  padding: 25px;
  padding-top: 10px;
  margin-bottom: 30px;
  background: #f8f8f8;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 98%;
  margin-bottom: 25px;
`;
const LeftSection = styled.div`
  background: white;
  box-shadow: 0 0px 4px 0px rgba(82, 63, 105, 0.15);
  width: 90%;
  height: 100%;
  margin-left: 20px;
`;

const LeftText = styled.div`
  display: flex;
  margin-bottom: -13px;
`;

const RightSection = styled.div`
  width: 90%;
`;

const RightText = styled.div`
  display: flex;
  margin-bottom: -13px;
`;

const BottomSection = styled.div``;

const useStyles = makeStyles((theme) => ({
  text: {
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
  Btext: {
    width: "40%",
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "10px",
    fontSize: 12,
    background: "white",
    boxShadow: "0 0 1px 0 #a4a1a1",
  },
  Bsubtext: {
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "10px",
    width: "60%",
    fontSize: 12,
    background: "white",
    boxShadow: "0 0 1px 0 #a4a1a1",
  },
  button: {
    textTransform: "lowercase",
    borderRadius: "20px",
    marginRight: " 20px",
  },
  media: {
    height: "100%",
  },
  TabBar: {
    background: "white",
    padding: "10px",
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.secondary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
    "&  .MuiListItemIcon-root": {
      minWidth: 30,
    },
  },
}))(MenuItem);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function AssetViewIndex(props) {
  const history = useHistory();
  const suhbeader = useSubheader();
  suhbeader.setTitle("View Asset");
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [empID] = useState(KTCookie.getCookie("empID"));
  const [newChanges, setNewChanges] = useState({});
  const [formValuesErr, setFormValuesErr] = useState({
    status: false,
  });

  const [Added, setAdded] = useState(false);
  const [ReturnPopUpValues, setReturnPopUpValues] = useState();
  const [Postsuccess, Setpostsuccess] = useState(false);
  const [PostError, setposterror] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [IssueDialogOpen, setIssueDialogOpen] = useState({
    open: false,
    id: null,
  });
  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    title: "",
    message: "",
  });

  const { openSnackOpen, vertical, horizontal, title, message } = openSnack;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [assetValues, setAssetValues] = useState({
    ts: {},
    details: {},
  });
  const [isRDO, setIsRDO] = useState();
  const [edited, setEdited] = useState();

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
        description: "Asset View page",
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
  });

  useEffect(() => {
    if (!props.location.state) {
      return history.replace("/assets/list-table");
    }
  });

  useEffect(() => {
    if (props.location.state) {
      const urls = [
        `${server_path}api/AssetView/GetAssetTopSection?detailID=${props.location.state.id}`,
        `${server_path}api/AssetView/GetAssetDetail?detailID=${props.location.state.id}`,
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
          setAssetValues({
            ts: arr[0],
            details: arr[1],
          });
        });
    }
  }, [server_path, token, props.location.state, edited]);

  useEffect(() => {
    if (assetValues.ts.return_Due_On && assetValues.ts.return_Due_On !== "") {
      const dueOn = assetValues.ts.return_Due_On
        .split(" ")[0]
        .replace(/-/gi, "/");
      fetch(
        `${server_path}api/AssetView/GetReturnDataDue?returnData=${dueOn}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setIsRDO(data.return_Alert);
        });
    }
  }, [assetValues.ts, server_path, token]);

  useEffect(() => {
    if (props.location.state) {
      fetch(
        `${server_path}api/AssetView/GetReturnPopup?detailID=${props.location.state.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setReturnPopUpValues(data));
    }
  }, [server_path, token, props.location.state]);

  const [showErrTable, setShowErrTable] = useState(false);

  const [IssueReturnApi, setIssueReturnApi] = useState([]);

  useEffect(() => {
    if (props.location.state) {
      fetch(
        `${server_path}api/AssetView/GetIssueReturnList?AssetDetail_ID=${props.location.state.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data || data.length === 0) {
            setShowErrTable(true);
            setIssueReturnApi(data);
            return;
          }
          setIssueReturnApi(data);
          setShowErrTable(false);
        })
        .catch((err) => {
          setShowErrTable(true);
        });
    }
  }, [server_path, token, props.location.state]);

  const { TabPane } = Tabs;
  const [ReturnDialogOpen, setReturnDialogOpen] = useState({
    open: false,
    id: null,
  });

  function callback(key) {
    setAdded(true);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <TopSection>
          <ButtonArea>
            {assetValues.ts.asset_Status?.toLowerCase() === "issued" ? (
              <Button
                variant="contained"
                style={{
                  background: "rgba(54, 153, 255, 0.75)",
                  color: "#fff",
                }}
                className={classes.button}
                onClick={() => {
                  setReturnDialogOpen({
                    open: true,
                    id: props.location.state.id,
                  });
                }}
              >
                Return
              </Button>
            ) : (
              <Button
                disabled={assetValues.details.available === 0 ? true : false}
                variant="contained"
                style={{
                  background:
                    assetValues.details.available === 0
                      ? "rgba(0,0,0,.12)"
                      : "rgba(54, 153, 255, 0.75)",
                  color: "#fff",
                }}
                onClick={() =>
                  setIssueDialogOpen({
                    open: true,
                    id: props.location.state.id,
                  })
                }
                className={classes.button}
              >
                Issue
              </Button>
            )}
            <Button
              variant="contained"
              style={{
                background: "rgba(54, 153, 255, 0.75)",
                color: "#fff",
              }}
              className={classes.button}
              onClick={() => setDialogOpen(true)}
            >
              Edit
            </Button>
            <Button
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              style={{
                background: "rgba(54, 153, 255, 0.75)",
                color: "#fff",
              }}
              className={classes.button}
              endIcon={<ArrowDropDownIcon />}
              onClick={handleClick}
            >
              More Action
            </Button>

            <StyledMenu
              style={{
                maxHeight: 300,
              }}
              id="customized-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <StyledMenuItem>
                <ListItemIcon>
                  <CollectionsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Lost/Missing" />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <BuildIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Repair" />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <RemoveCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Broken" />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <CachedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Dispose" />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <EmojiPeopleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Donate" />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <AttachMoneyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sell" />
              </StyledMenuItem>
              <StyledMenuItem>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </StyledMenuItem>
            </StyledMenu>
          </ButtonArea>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <FirstSection>
                <Card className={classes.root} variant="outlined">
                  <CardContent></CardContent>
                  <DetailImg
                    src={`${server_path}Uploads/asset-photos/${assetValues.ts.asset_ID}.jpg`}
                    alt="asset"
                    title={`asset ${assetValues.ts.asset_ID} image`}
                    onError={(e) => {
                      if (e.target.src.includes(".jpg")) {
                        e.target.src = `${server_path}Uploads/asset-photos/${assetValues.ts.asset_ID}.png`;
                        return;
                      }
                      if (e.target.src.includes(".png")) {
                        e.target.src = `${server_path}Uploads/asset-photos/${assetValues.ts.asset_ID}.jpeg`;
                        return;
                      }
                      if (e.target.src.includes(".jpeg")) {
                        e.target.src = `${server_path}Uploads/asset-photos/${assetValues.ts.asset_ID}.gif`;
                        return;
                      } else {
                        if (
                          e.target.src ===
                          `${server_path}Uploads/asset-photos/${assetValues.ts.asset_ID}.gif`
                        ) {
                          e.target.src = "https://i.imgur.com/s6qHduv.jpeg";
                          e.target.classList.add("error-img");
                        }
                      }
                    }}
                  />
                </Card>
              </FirstSection>
            </Grid>
            <Grid item xs={6} sm={5}>
              <LeftSection>
                <LeftText>
                  <p className={classes.text}>Asset Tag</p>
                  <p className={classes.subText}>{assetValues.ts.asset_Tag}</p>
                </LeftText>{" "}
                <LeftText>
                  <p className={classes.text}>Asset Name</p>
                  <p className={classes.subText}>{assetValues.ts.asset_Name}</p>
                </LeftText>{" "}
                <LeftText>
                  <p className={classes.text}>Purchase Date</p>
                  <p className={classes.subText}>
                    {
                      moment(assetValues.ts.purchase_Date)
                        .format("DD-MM-YYYY")
                        .split("T")[0]
                    }
                  </p>
                </LeftText>{" "}
                <LeftText>
                  <p className={classes.text}>Cost</p>
                  <p className={classes.subText}>{assetValues.ts.cost}</p>
                </LeftText>{" "}
                <LeftText>
                  <p className={classes.text}>Brand</p>
                  <p className={classes.subText}>{assetValues.ts.brand}</p>
                </LeftText>{" "}
                <LeftText>
                  <p className={classes.text}>Model No</p>
                  <p className={classes.subText}>{assetValues.ts.model_No}</p>
                </LeftText>{" "}
                <LeftText>
                  <p className={classes.text}>Serial No</p>
                  <p className={classes.subText}>{assetValues.ts.searial_No}</p>
                </LeftText>{" "}
                {assetValues.details.category?.toLowerCase() === "license" && (
                  <LeftText>
                    <p className={classes.text}>Product Key</p>
                    <p className={classes.subText}>
                      {assetValues.ts.product_Key}
                    </p>
                  </LeftText>
                )}
              </LeftSection>
            </Grid>
            <Grid item xs={6} sm={5}>
              <RightSection>
                <RightText>
                  <p className={classes.Btext}>Asset Location</p>
                  <p className={classes.Bsubtext}>
                    {assetValues.ts.location_Name}
                  </p>
                </RightText>
                <RightText>
                  <p className={classes.Btext}>Assigned To</p>
                  <p className={classes.Bsubtext}>
                    {assetValues.ts.assigned_To}
                  </p>
                </RightText>{" "}
                <RightText>
                  <p className={classes.Btext}>Issue Date</p>
                  <p className={classes.Bsubtext}>
                    {assetValues.ts.issue_Date?.replace(/\//gi, "-")}
                    {/* {assetValues.ts.issue_Date} */}
                  </p>
                </RightText>{" "}
                <RightText>
                  <p className={classes.Btext}>Return Due On</p>
                  <p
                    className={classes.Bsubtext}
                    style={{ color: isRDO ? "rgba(244, 67, 54, 1)" : "" }}
                  >
                    {assetValues.ts.return_Due_On?.replace(/\//gi, "-")}
                    {/* {assetValues.ts.return_Due_On} */}
                  </p>
                </RightText>{" "}
                <RightText>
                  <p className={classes.Btext}>Asset Status</p>
                  <p className={classes.Bsubtext}>
                    {assetValues.ts.asset_Status}
                  </p>
                </RightText>{" "}
                <RightText>
                  <p className={classes.Btext}>Asset Condition</p>
                  <p className={classes.Bsubtext}>
                    {assetValues.ts.asset_Condition}
                  </p>
                </RightText>{" "}
                {assetValues.details.category?.toLowerCase() === "vehicle" && (
                  <RightText>
                    <p className={classes.Btext}>Owner Book Status</p>
                    <p className={classes.Bsubtext}>
                      {assetValues.ts.owner_Book_Status}
                    </p>
                  </RightText>
                )}
              </RightSection>
            </Grid>
          </Grid>
        </TopSection>
        <BottomSection>
          <Tabs
            defaultActiveKey="1"
            onChange={callback}
            className={classes.TabBar}
          >
            <TabPane tab="Details" key="1">
              <DetailTab details={assetValues.details}></DetailTab>
            </TabPane>
            <TabPane tab="Issue/Return" key="2">
              <IssueReturn
                id={props.location.state ? props.location.state.id : null}
                showErrTable={showErrTable}
                IssueReturnApi={IssueReturnApi}
              ></IssueReturn>
            </TabPane>
            <TabPane tab="Docs" key="3">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="Purchased" key="4">
              <PurchasedIndex
                id={props.location.state ? props.location.state.id : null}
              ></PurchasedIndex>
            </TabPane>{" "}
            <TabPane tab="Warranty" key="5">
              <WarrantyIndex
                id={props.location.state ? props.location.state.id : null}
              ></WarrantyIndex>
            </TabPane>
            <TabPane tab="Depreciation" key="6">
              Content of Tab Pane 6
            </TabPane>
            <TabPane tab="Maintenance" key="7">
              Content of Tab Pane 7
            </TabPane>
            <TabPane tab="Reserve" key="8">
              <ReserveIndex
                id={props.location.state ? props.location.state.id : null}
              ></ReserveIndex>
            </TabPane>
            <TabPane tab="Audit" key="9">
              Content of Tab Pane 9
            </TabPane>
            <TabPane tab="History" key="10">
              <HistoryIndex
                id={props.location.state ? props.location.state.id : null}
              ></HistoryIndex>
            </TabPane>
          </Tabs>
        </BottomSection>
        {/* <Calendar></Calendar> */}
        {IssueDialogOpen.open && (
          <IssuePopUpIndex
            setIssueDialogOpen={setIssueDialogOpen}
            IssueDialogOpen={IssueDialogOpen}
            assetValues={assetValues}
            setAssetValues={setAssetValues}
            setposterror={setposterror}
            Setpostsuccess={Setpostsuccess}
            IssueReturnApi={IssueReturnApi}
            setIssueReturnApi={setIssueReturnApi}
            setShowErrTable={setShowErrTable}
            Added={Added}
          ></IssuePopUpIndex>
        )}
        {ReturnDialogOpen.open && (
          <ReturnPopUpIndex
            ReturnDialogOpen={ReturnDialogOpen}
            setReturnDialogOpen={setReturnDialogOpen}
            ReturnPopUpValues={ReturnPopUpValues}
            setReturnPopUpValues={setReturnPopUpValues}
            assetValues={assetValues}
            setAssetValues={setAssetValues}
            setposterror={setposterror}
            Setpostsuccess={Setpostsuccess}
            setIssueReturnApi={setIssueReturnApi}
            setShowErrTable={setShowErrTable}
          ></ReturnPopUpIndex>
        )}

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
        {dialogOpen && (
          <EditDetailForm
            selectedRow={assetValues.ts}
            detailRow={assetValues.details}
            setDialogOpen={setDialogOpen}
            dialogOpen={dialogOpen}
            server_path={server_path}
            token={token}
            empID={empID}
            setOpenSnack={setOpenSnack}
            openSnack={openSnack}
            newChanges={newChanges}
            setNewChanges={setNewChanges}
            formValuesErr={formValuesErr}
            setFormValuesErr={setFormValuesErr}
            edited={edited}
            setEdited={setEdited}
          ></EditDetailForm>
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
            message={<span id="message-id2">{message}</span>}
          />
        </Snackbar>
      </Container>
    </React.Fragment>
  );
}
