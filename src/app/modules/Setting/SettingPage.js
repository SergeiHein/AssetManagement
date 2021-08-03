import React from "react";
import { Redirect, Switch } from "react-router-dom";
import StatusTable from "../../pages/StatusTable";
import { ContentRoute } from "../../../_metronic/layout";

export default function SettingPage() {
  return (
    <Switch>
      <Redirect exact={true} from="/Setting" to="/Setting/Status-table" />
      {/* Surfaces */}
      <ContentRoute from="/Setting/Status-table" component={StatusTable} />
    </Switch>
  );
}
