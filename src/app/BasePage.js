import React, { Suspense, useEffect, useState, createContext } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { ListTable } from "./pages/ListTable";
import { DashboardPage } from "./pages/DashboardPage";
import Requestable from "./pages/Requestable";
import Requested from "./pages/Requested";
import AcceptancePage from "./pages/AcceptancePage";
import MultiAcceptancePage from "./pages/MultiAcceptancePage";
import { KTCookie } from "../_metronic/_assets/js/components/cookie";
import SettingPage from "./pages/SettingPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import DataImportPage from "./pages/DataImportPage";
import ReportPage from "./pages/ReportPage";
// import MissingListPage from "./pages/MissingListPage";
// import IssuedListPage from "./pages/IssuedListPage";
// import { HubConnectionBuilder } from "@microsoft/signalr";
import { appsetting } from "../envirment/appsetting";
import moment from "moment";
// import { useHistory } from "react-router-dom";

// import {Redirect} from "react-router-dom";

// import { createBrowserHistory } from 'history';

// import StatusTable from "./pages/StatusTable";

// const GoogleMaterialPage = lazy(() =>
//   import("./modules/GoogleMaterialExamples/GoogleMaterialPage")
// );
// const ReactBootstrapPage = lazy(() =>
//   import("./modules/ReactBootstrapExamples/ReactBootstrapPage")
// );
// const SettingPage = lazy(() => import("./pages/SettingPage"));

// const ConfigurationPage = lazy(() => import("./pages/ConfigurationPage"));

export const TokenContext = createContext();

export default function BasePage({ empID }) {
  // console.log(empID);
  // KTCookie.setCookie("userID", 1);
  const { server_path } = appsetting;
  // const history = useHistory();

  const [token, setToken] = useState();
  // const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  const issueID = KTCookie.getCookie("issueID");

  // console.log("hi");
  // const [issueID, setIssueID] = useState(KTCookie.getCookie("issueID"));
  // const [connection, setConnection] = useState("paused");
  const [redirect, setRedirect] = useState(false);
  // const [menuValues, setMenuValues] = useState([]);
  // const [components, setComponents] = useState({
  //   Dashboard: DashboardPage,
  //   Requestable_Assets: Requestable,
  //   Requested_List: Requested,
  //   Issued_List: IssuedListPage,
  //   Missing_List: MissingListPage,
  //   Data_Import: DataImportPage,
  //   Assets: ListTable,
  //   Settings: SettingPage,
  //   Configurations: ConfigurationPage,
  //   Reports: ReportPage,
  // });

  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    let auditObj = {
      action_By: parseInt(empID),
      event: "Log In",
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
      description: "",
      requestObject: null,
    };

    if (!window.sessionStorage.getItem("first-time")) {
      if (token) {
        window.sessionStorage.setItem("first-time", "true");
        console.log("log in audit !");

        fetch(`${server_path}api/AuditTrial`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(auditObj),
        }).then((res) => console.log(res));
      }
    }
  }, [server_path, token, empID]);

  useEffect(() => {
    if (issueID && issueID !== 0) {
      setRedirect(true);
    }
  });

  function toA() {
    if (redirect) {
      return <Redirect exact from="/" to="/assets-acceptance" />;
    }
  }

  // for block routes

  // useEffect(() => {
  //   fetch(`${server_path}api/MenuApi?empID=${empID}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       data
  //         .sort((a, b) =>
  //           a.m_Order > b.m_Order_Top
  //             ? 1
  //             : b.m_Order_Top > a.m_Order_Top
  //             ? -1
  //             : 0
  //         )
  //         .filter((one) => one.sub_Parent_Module === "1" || !one.parent_Module);
  //       setMenuValues(data);
  //       // setLoading(false);
  //     });
  // }, [server_path, token, empID]);

  // for block routes

  // console.log(menuValues);

  useEffect(() => {
    fetch(`${server_path}api/Token?id=${empID}`)
      .then((res) => {
        return res.text();
      })
      .then((data) => setToken(data));
  }, [empID, server_path]);

  const contextValues = {
    token: token,
    // connection: connection,
    issueID: issueID,
    empID: empID,
  };

  // let test = [
  //   {
  //     module_ID: 426,
  //     navigateUrl: "/dashboard",
  //     module_Name: "Dashboard",
  //     sub_Parent_Module: "",
  //     parent_Module: "",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 1,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Dashboard.svg",
  //     m_Order_Top: 1,
  //   },
  //   {
  //     module_ID: 400,
  //     navigateUrl: "/requestable",
  //     module_Name: "Requestable Assets",
  //     sub_Parent_Module: null,
  //     parent_Module: null,
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 1,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Requestable.svg",
  //     m_Order_Top: 2,
  //   },
  //   {
  //     module_ID: 401,
  //     navigateUrl: "/requested-list",
  //     module_Name: "Requested List",
  //     sub_Parent_Module: null,
  //     parent_Module: null,
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 1,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Requested-List.svg",
  //     m_Order_Top: 3,
  //   },
  //   {
  //     module_ID: 429,
  //     navigateUrl: "/Configurations",
  //     module_Name: "Configurations",
  //     sub_Parent_Module: "1",
  //     parent_Module: "Configurations",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 4,
  //     module_Order: 4,
  //     menu_Icons: "/media/svg/icons/General/Configurations.svg",
  //     m_Order_Top: 9,
  //   },
  //   {
  //     module_ID: 411,
  //     navigateUrl: "/Configurations/Bar_QR",
  //     module_Name: "Bar Code & QR Code",
  //     sub_Parent_Module: null,
  //     parent_Module: "Configurations",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Barcode-product.svg",
  //     m_Order_Top: 9,
  //   },
  //   {
  //     module_ID: 412,
  //     navigateUrl: "/Configurations/Labels",
  //     module_Name: "Labels",
  //     sub_Parent_Module: null,
  //     parent_Module: "Configurations",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 2,
  //     menu_Icons: "/media/svg/icons/General/Labels.svg",
  //     m_Order_Top: 9,
  //   },
  //   {
  //     module_ID: 413,
  //     navigateUrl: "/Configurations/Notifications",
  //     module_Name: "Notifications and Alerts",
  //     sub_Parent_Module: null,
  //     parent_Module: "Configurations",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 3,
  //     menu_Icons: "/media/svg/icons/General/Notification.svg",
  //     m_Order_Top: 9,
  //   },

  //   {
  //     module_ID: 422,
  //     navigateUrl: "/Settings",
  //     module_Name: "Settings",
  //     sub_Parent_Module: "1",
  //     parent_Module: "Settings",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 1,
  //     module_Order: 1,
  //     menu_Icons: "/media/svg/icons/General/Settings.svg",
  //     m_Order_Top: 8,
  //   },
  //   {
  //     module_ID: 405,
  //     navigateUrl: "/Settings/Type",
  //     module_Name: "Type",
  //     sub_Parent_Module: null,
  //     parent_Module: "Settings",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 2,
  //     menu_Icons: "/media/svg/icons/General/Type.svg",
  //     m_Order_Top: 8,
  //   },
  //   {
  //     module_ID: 406,
  //     navigateUrl: "/Settings/Category",
  //     module_Name: "Category",
  //     sub_Parent_Module: null,
  //     parent_Module: "Settings",
  //     root_Module: "Assets",
  //     isLastNode: 1,
  //     m_Order: 0,
  //     module_Order: 3,
  //     menu_Icons: "/media/svg/icons/General/Category.svg",
  //     m_Order_Top: 8,
  //   },
  // ];

  return !token ? (
    <div></div>
  ) : (
    <Suspense fallback={<LayoutSplashScreen />}>
      <TokenContext.Provider value={contextValues}>
        <Switch>
          {toA()}

          <Redirect exact from="/" to="/dashboard" />

          {/* block routes from different users starts here */}

          {/* {loading ? <></> : <Redirect exact from="/" to="/dashboard" />} */}
          {/* <Route path="/assets-acceptance" component={AcceptancePage} /> */}
          {/* {loading ? (
            <></>
          ) : (
            menuValues
              .filter((one) => {
                return (
                  ((one.sub_Parent_Module === "" ||
                    one.sub_Parent_Module === null) &&
                    (one.parent_Module === null || one.parent_Module === "")) ||
                  one.sub_Parent_Module === "1"
                );
              })
            // test
            //   .sort((a, b) =>
            //     a.m_Order > b.m_Order_Top
            //       ? 1
            //       : b.m_Order_Top > a.m_Order_Top
            //       ? -1
            //       : 0
            //   )
              .map((one, i) => {
                if (one.module_Name.toLowerCase() === "dashboard") {
                  
                  return (
                    <ContentRoute path="/dashboard" component={DashboardPage} />
                  );
                } else {
                  console.log(
                    one.navigateUrl,
                    components[one.module_Name.replace(" ", "_")]
                  );
                  return (
                  
                    <Route
                      path={one.navigateUrl}
                      component={components[one.module_Name.replace(" ", "_")]}
                    />
                  );
                }
                
              })
          )} */}

          {/* block routes from different users ends here */}

          <ContentRoute path="/dashboard" component={DashboardPage} />

          <Route path="/assets" render={() => <ListTable />} />
          <Route path="/requestable" component={Requestable} />
          <Route path="/requested-list" component={Requested} />
          <Route path="/Settings" component={SettingPage} />

          <Route path="/Configurations" component={ConfigurationPage} />
          <Route path="/assets-acceptance" component={AcceptancePage} />
          <Route
            path="/multiassets-acceptance"
            component={MultiAcceptancePage}
          />

          <Route path="/Data-Import" component={DataImportPage} />
          <Route path="/Asset-history" component={DataImportPage} />
          <Route path="/report" component={ReportPage} />

          {/* <Route path="/google-material" component={GoogleMaterialPage} /> */}
          {/* <Route path="/react-bootstrap" component={ReactBootstrapPage} /> */}
          {/* <Route path="/e-commerce" component={ECommercePage} /> */}
          <Redirect to="error/error-v1" />
        </Switch>
      </TokenContext.Provider>
    </Suspense>
  );
}
