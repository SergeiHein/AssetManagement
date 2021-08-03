import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";

import MultiAcceptanceIndex from "../../_metronic/_partials/Acceptance/MultiAcceptance/MultiAcceptanceIndex";

export default function MultiAcceptancePage() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="multiassets-acceptance/"
        to="multiassets-acceptance"
      />

      <ContentRoute
        from="/multiassets-acceptance"
        component={MultiAcceptanceIndex}
        exact={true}
      />
    </Switch>
  );
}
