import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";

import NotificationPage from "../../_metronic/_partials/Configurations/NotificationPage";

export default function ConfigurationPage() {
  return (
    <Switch>
      <Redirect exact={true} from="/Configurations" to="/Configurations" />
      <ContentRoute
        from="/Configurations/Notifications"
        component={NotificationPage}
      />
    </Switch>
  );
}
