import React from "react";
import { Switch } from "react-router-dom";

import { useSubheader } from "../../_metronic/layout";

export default function MissingListPage() {
  const subheader = useSubheader();

  subheader.setTitle("Missing List");

  return <Switch></Switch>;
}
