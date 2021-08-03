import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";
import TableIndex from "../../_metronic/_partials/Requestable/TableIndex";
import { useSubheader } from "../../_metronic/layout";

export default function Requestable() {
  const suhbeader = useSubheader();

  suhbeader.setTitle("Requestable Table 1");

  return (
    <Switch>
      <Redirect exact={true} from="requestable/" to="requestable" />

      <ContentRoute from="/requestable" component={TableIndex} exact={true} />
    </Switch>
  );
}
