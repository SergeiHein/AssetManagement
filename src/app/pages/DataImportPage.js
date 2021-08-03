import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";

import LabelPage from "../../_metronic/_partials/DataImport/LabelPage";

export default function ConfigurationPage() {
  return (
    <Switch>
      <Redirect exact={true} from="/" to="/" />
      <ContentRoute from="/Data-Import" component={LabelPage} />
    </Switch>
  );
}
