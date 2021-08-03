import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";
import App from "../../_metronic/_partials/Requested/RequestedIndex";
import { useSubheader } from "../../_metronic/layout";
import IssuedIndex from "../../_metronic/_partials/Requested/issuedPage/IssuedIndex";

export default function Requested() {
  const suhbeader = useSubheader();

  suhbeader.setTitle("Requested List");

  return (
    <Switch>
      <Redirect exact={true} from="requested-list/" to="requested-list" />

      <ContentRoute from="/requested-list" component={App} exact={true} />

      <ContentRoute from="/requested-list/issued" component={IssuedIndex} />
    </Switch>
  );
}
