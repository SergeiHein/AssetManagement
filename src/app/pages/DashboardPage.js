import React from "react";
import { Dashboard } from "../../_metronic/_partials";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";

export function DashboardPage() {
  return (
    <Switch>
      <Redirect exact={true} from="dashboard/" to="dashboard" />

      <ContentRoute from="/dashboard" component={Dashboard} exact={true} />
    </Switch>
  );
}
