import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";
import ActivityReport from "../../_metronic/_partials/Reports/Activity/ActivityReport";
import ExpiringIndex from "../../_metronic/_partials/Reports/ExpiringReport/ExpiringIndex";
import ReturnIndex from "../../_metronic/_partials/Reports/ReturnDueReport/ReturnIndex";
import BranchIndex from "../../_metronic/_partials/Reports/BranchReport/BranchIndex";

export default function ReportPage() {
  return (
    <Switch>
      <Redirect exact={true} from="/report" to="/report" />

      <ContentRoute from="/report/activity-report" component={ActivityReport} />
      <ContentRoute from="/report/expiring-report" component={ExpiringIndex} />
      <ContentRoute
        from="/report/overdueasset-report"
        component={ReturnIndex}
      />
      <ContentRoute
        from="/report/assetlistbybranchemployee-report"
        component={BranchIndex}
      />
    </Switch>
  );
}
