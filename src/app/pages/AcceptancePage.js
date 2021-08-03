import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";

import AcceptanceIndex from "../../_metronic/_partials/Acceptance/AcceptanceIndex";

export default function AcceptancePage() {
  return (
    <Switch>
      <Redirect exact={true} from="assets-acceptance/" to="assets-acceptance" />
      <ContentRoute
        from="/assets-acceptance"
        component={AcceptanceIndex}
        exact={true}
      />
    </Switch>
  );
}
