/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {
  useMemo,
  useLayoutEffect,
  useEffect,
  // useContext,
  useState,
} from "react";
import objectPath from "object-path";
import { useLocation } from "react-router-dom";
import { BreadCrumbs } from "./components/BreadCrumbs";
import {
  getBreadcrumbsAndTitle,
  useSubheader,
} from "../../_core/MetronicSubheader";

import styled from "styled-components";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
// import { KTCookie } from "../../../_assets/js/components/cookie";
import { HubConnectionBuilder } from "@microsoft/signalr";
// import { TokenContext } from "../../../../app/BasePage";
import { KTCookie } from "../../../_assets/js/components/cookie";
import { appsetting } from "../../../../envirment/appsetting";
import { HeaderBar } from "../../../layout/components/custom/css/ListForm_Styles";

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
    marginLeft: "15px",
    marginRight: "15px",
    marginBottom: "15px",
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);

const ListItemStyles = styled(ListItem)`
  padding-top: 3px !important;
  padding-bottom: 3px !important;

  /* .MuiDivider-root {
    height: 5px !important;
    background: #fff !important;
  } */
`;

// const ListStyles = styled(List)`
//    height: 10px;
//     border-radius: 5px;
//     margin-left: 15px;
//     margin-right: 15px;
//     margin-bottom: 20px;
// `;

const DividerStyles = styled(Divider)`
  height: 3px !important;
  background: #fff !important;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: "20px",
  },
  typography: {
    padding: theme.spacing(2),
  },
  title: {
    minWidth: 300,
    boxShadow: "0px 0px 10px 0px rgba(82, 63, 105, 0.15) !important",
    borderRadius: " 5px",
    minHeight: 40,
    background: "#87a9ff",
    // marginBottom: "20px",
  },
  request: {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    color: "#fff",
  },
  asset: {
    boxShadow: "0px 0px 5px 0px rgba(82, 63, 105, 0.15) !important",
    borderRadius: " 5px",
    height: "250px",
    overflowY: "auto",
  },
  Qtitle: {
    // marginTop: "20px",
    marginBottom: "20px",
  },
  list: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  Alist: {
    marginTop: 20,
    marginLeft: 50,
  },
  subheaderSolid: {},

  icon: {
    position: "absolute",
    right: "20%",
    bottom: "25%",
    cursor: "pointer",
    fontSize: "25px",
    [theme.breakpoints.down(1300)]: {
      right: "23%",
    },
    [theme.breakpoints.down(1200)]: {
      right: "25%",
    },
    [theme.breakpoints.down(1100)]: {
      right: "28%",
    },
    [theme.breakpoints.down(990)]: {
      right: "6%",
      bottom: "84%",
    },
    [theme.breakpoints.down(700)]: {
      right: "8%",
    },
    [theme.breakpoints.down(500)]: {
      right: "10%",
    },
  },
}));

// const signalR = require("@aspnet/signalr");

export function SubHeader() {
  const classes = useStyles();
  const { server_path } = appsetting;
  // const token = useContext(TokenContext);

  const uiService = useHtmlClassService();
  const location = useLocation();
  const subheader = useSubheader();

  const [connection, setConnection] = useState();
  const [pendingRequest, setPendingRequest] = useState("");
  const [remainingQtySection, setRemainingQtySection] = useState();
  const [token, setToken] = useState();
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));
  const [showNoti, setShowNoti] = useState(false);

  // production

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${server_path}notificationhub`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [server_path]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");

          setShowNoti(true);

          connection.on("notification", (val) => {
            setPendingRequest(val);
          });

          connection.on("notiremaining", (val) => {
            setRemainingQtySection(JSON.parse(val));
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection, server_path]);

  // production end here

  const layoutProps = useMemo(() => {
    return {
      config: uiService.config,
      subheaderMobileToggle: objectPath.get(
        uiService.config,
        "subheader.mobile-toggle"
      ),
      subheaderCssClasses: uiService.getClasses("subheader", true),
      subheaderContainerCssClasses: uiService.getClasses(
        "subheader_container",
        true
      ),
    };
  }, [uiService]);

  useLayoutEffect(() => {
    const aside = getBreadcrumbsAndTitle("kt_aside_menu", location.pathname);
    const header = getBreadcrumbsAndTitle("kt_header_menu", location.pathname);
    const breadcrumbs =
      aside && aside.breadcrumbs.length > 0
        ? aside.breadcrumbs
        : header.breadcrumbs;
    subheader.setBreadcrumbs(breadcrumbs);
    subheader.setTitle(
      aside && aside.title && aside.title.length > 0
        ? aside.title
        : header.title
    );
    // eslint-disable-next-line
  }, [location.pathname]);

  // Do not remove this useEffect, need from update title/breadcrumbs outside (from the page)
  useEffect(() => {}, [subheader]);

  useEffect(() => {
    fetch(`${server_path}api/Token?id=${empID}`)
      .then((res) => {
        return res.text();
      })
      .then((data) => setToken(data));
  }, [empID, server_path]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  // console.log(pendingRequest);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);

    const urls = [
      `${server_path}api/realtime?empID=${empID}`,
      `${server_path}api/realtime/remainingnoti`,
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
        // console.log(res);
        // console.log(res);
        if (res[0].ok) {
          console.log("pending request api success !");
        }
        if (res[1].ok) {
          console.log("remaining qty api success");
        }

        // if (!res.ok) {
        //   throw Error(res.statusText);
        // }
      })
      .catch(function(error) {
        console.log("Looks like there was a problem: \n", error);
      });

    // fetch("http://82.145.57.162:8087/api/realtime")
    //   .then((res) => {
    //     // console.log(res);
    //     if (res.ok) {
    //       console.log("realtime api success !");
    //     }
    //     if (!res.ok) {
    //       throw Error(res.statusText);
    //     }
    //     // return res.json();
    //   })
    //   // .then((data) => {
    //   //   console.log(data);
    //   // })
    //   .catch(function(error) {
    //     console.log("Looks like there was a problem: \n", error);
    //   });

    // const createHubConnection = async () => {
    //   const hubConnect = new signalR.HubConnectionBuilder()
    //     .withUrl("http://82.145.57.162:8087/notificationhub")

    //     .build();
    //   // Build new Hub Connection, url is currently hard coded.

    //   try {
    //     await hubConnect.start();

    //     console.log('connected')
    //   } catch (err) {
    //     alert(err);
    //   }
    //   setHubConnection(hubConnect);
    // };

    // createHubConnection();
  };

  // console.log(Math.round((100 / 7) * 5));
  // console.log((5 * 100) / 7);

  // console.log(hubConnection);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // console.log(subheader);
  // console.log(layoutProps.subheaderCssClasses);
  return (
    <HeaderBar
      id="kt_subheader"
      className={`subheader py-2 py-lg-4   ${layoutProps.subheaderCssClasses}`}
      style={{ top: "0", width: "100%", zIndex: "101" }}
    >
      <div
        className={`${layoutProps.subheaderContainerCssClasses} d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap`}
      >
        {/* Info */}
        <div className="d-flex align-items-center flex-wrap mr-1">
          {layoutProps.subheaderMobileToggle && (
            <button
              className="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none"
              id="kt_subheader_mobile_toggle"
            >
              <span />
            </button>
          )}
          <div className="d-flex align-items-baseline mr-5">
            <h5 className="text-dark font-weight-bold my-2 mr-5">
              <>{subheader.title}</>
            </h5>
          </div>
          <BreadCrumbs items={subheader.breadcrumbs} />
          <div>
            <NotificationsIcon
              color="secondary"
              className={classes.icon}
              onClick={handleClick}
            />
          </div>
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div
            style={{
              padding: "20px 15px",
              maxHeight: 500,
            }}
          >
            <h5 className={classes.Qtitle}>Pending Request</h5>
            <div className={classes.title}>
              <div className={classes.request}>
                <p
                  style={{
                    padding: "10px 0 0 0",
                    fontSize: "13px",
                    //  {chat.user} change here
                  }}
                >
                  Total Request :{" "}
                  <span>{pendingRequest ? pendingRequest : "0"}</span>{" "}
                </p>
                {/* <p
                  style={{
                    padding: "10px 0 0 0",
                  }}
                >
                  Time
                </p> */}
              </div>
            </div>
            {remainingQtySection && (
              <>
                <h5 className={classes.Qtitle} style={{ marginTop: "20px" }}>
                  Minimum Qty Level
                </h5>
                <div className={classes.asset}>
                  <List
                    component="nav"
                    className={classes.root}
                    aria-label="mailbox folders"
                  >
                    {remainingQtySection.map((section) => {
                      return (
                        <>
                          <ListItemStyles>
                            <ListItemText primary={section.Asset_Name} />
                            <p
                              style={{
                                marginBottom: 0,
                              }}
                            >
                              {section.Remaining_Qty} remaining
                            </p>
                          </ListItemStyles>
                          <BorderLinearProgress
                            variant="determinate"
                            value={
                              section.Remaining_Qty === 0 &&
                              section.Minimum_Qty === 0
                                ? 0
                                : (section.Remaining_Qty * 100) /
                                  section.Minimum_Qty
                            }
                          />
                          <DividerStyles />
                        </>
                      );
                    })}
                  </List>
                </div>
              </>
            )}
          </div>
        </Popover>
      </div>
    </HeaderBar>
  );
}
