import React from "react";
import { Redirect, Switch } from "react-router-dom";

import { useSubheader } from "../../_metronic/layout";

export default function IssuedListPage() {
  const subheader = useSubheader();

  subheader.setTitle("Issued List");

  return <Switch></Switch>;
}
