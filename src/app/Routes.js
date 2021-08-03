/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, { useEffect, useState } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
// import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
// import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
// import { Logout } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import { KTCookie } from "../_metronic/_assets/js/components/cookie";
// import AcceptancePage from "../app/pages/AcceptancePage";
// import { DashboardPage } from "./pages/DashboardPage";

export function Routes() {
  const [requestLoading, setRequestLoading] = useState(true); // production

  // const [requestLoading, setRequestLoading] = useState(false); // development

  const [isUserActive, setIsUserActive] = useState(false); // production

  // const [isUserActive, setIsUserActive] = useState(true); // development
  // KTCookie.setCookie("empID", 1, {
  //   "max-age": -1,
  // });

  // KTCookie.setCookie("issueID", 1, {
  //   "max-age": -1,
  // });
  // KTCookie.setCookie("issueID", 6);
  KTCookie.setCookie("empID", 1);

  const empID = KTCookie.getCookie("empID");
  const issueID = KTCookie.getCookie("issueID");

  // const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  // const [issueID, setIssueID] = useState(KTCookie.getCookie("issueID"));

  // console.log(userID);

  // production

  useEffect(() => {
    if (
      empID === undefined ||
      empID === 0 ||
      issueID === undefined ||
      issueID === 0
    ) {
      setIsUserActive(false);
      setRequestLoading(false);
    }
    if ((empID && empID !== 0) || (issueID && issueID !== 0)) {
      setIsUserActive(true);
      setRequestLoading(false);
    }
  }, [empID, issueID]);

  // useEffect(() => {
  //   if (empID === undefined || empID === 0) {
  //     console.log(empID);
  //     setIsUserActive(false);
  //     setRequestLoading(false);
  //   }
  //   if (empID && empID !== 0) {
  //     setIsUserActive(true);
  //     setRequestLoading(false);
  //   }
  // }, [empID]);

  // production end here

  console.log(isUserActive);

  return !requestLoading ? (
    <Switch>
      <Route path="/error" component={ErrorsPage} />
      {/* <Route path="/assets-acceptance" component={AcceptancePage} /> */}

      {!isUserActive ? (
        <Redirect to="error/error-v5" />
      ) : (
        <Layout>
          <BasePage empID={empID} />
        </Layout>
      )}
    </Switch>
  ) : (
    <div />
  );
}
