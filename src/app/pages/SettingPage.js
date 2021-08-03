import React from "react";
import { Redirect, Switch } from "react-router-dom";
import StatusTable from "../../_metronic/_partials/Settings/StatusTable";
import TypeTable from "../../_metronic/_partials/Settings/TypeTable";
import { ContentRoute } from "../../_metronic/layout";
import CategoryTable from "../../_metronic/_partials/Settings/CategoryTable";
import BrandTable from "../../_metronic/_partials/Settings/BrandTable";
import SupplierTable from "../../_metronic/_partials/Settings/SuppilerTable";
import LocationTable from "../../_metronic/_partials/Settings/Location/LocationTable";

export default function SettingPage() {
  return (
    <Switch>
      <Redirect exact={true} from="/Settings" to="/Settings" />
      <ContentRoute from="/Settings/Status" component={StatusTable} />
      <ContentRoute from="/Settings/Type" component={TypeTable} />
      <ContentRoute from="/Settings/Category" component={CategoryTable} />
      <ContentRoute from="/Settings/Brand" component={BrandTable} />
      <ContentRoute from="/Settings/Supplier" component={SupplierTable} />   
      <ContentRoute from="/Settings/location" component={LocationTable} />
  
    </Switch>
  );
}
