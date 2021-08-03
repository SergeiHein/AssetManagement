import React from "react";
import { useSubheader } from "../../_metronic/layout";
import TableIndex from "../../_metronic/_partials/TableTest/asset_list/TableIndex";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../_metronic/layout";

import FormIndex from "../../_metronic/_partials/TableTest/asset_list/ListForm/FormIndex";
import TableEdit from "../../_metronic/_partials/TableTest/asset_list/Edit/TableEdit";
import AllocationIndex from "../../_metronic/_partials/TableTest/asset_allocation/AllocationIndex";
import AllocationEditIndex from "../../_metronic/_partials/TableTest/asset_allocation/AllocationEditIndex";
import AssetViewIndex from "../../_metronic/_partials/TableTest/asset_view/AssetViewIndex";
import AssetIssueIndex from "../../_metronic/_partials/TableTest/asset_issue/AssetIssueIndex";
import AssetReturnIndex from "../../_metronic/_partials/TableTest/asset_return/AssetReturnIndex";
import MultiIssue from "../../_metronic/_partials/TableTest/asset_issue/MultiIssue/MultiIssue";

export const ListTable = () => {
  const suhbeader = useSubheader();

  suhbeader.setTitle("List Table");

  return (
    <Switch>
      <Redirect exact={true} from="assets/" to="list-table" />

      <ContentRoute
        from="/assets/list-table"
        component={TableIndex}
        exact={true}
      />

      <ContentRoute
        from="/assets/list-table/list-table-edit"
        component={TableEdit}
        exact={true}
      />

      <ContentRoute
        from="/assets/list-table/list-new-form"
        component={FormIndex}
      />

      <ContentRoute
        from="/assets/asset-allocation"
        component={AllocationIndex}
        exact={true}
      />

      <ContentRoute
        from="/assets/asset-allocation/asset-allocation-edit"
        component={AllocationEditIndex}
        exact={true}
      />
      <ContentRoute
        from="/assets/asset-view"
        component={AssetViewIndex}
        exact={true}
      />
      <ContentRoute
        from="/assets/asset-issue"
        component={AssetIssueIndex}
        exact={true}
      />
      <ContentRoute
        from="/assets/asset-issue/multi-issue"
        component={MultiIssue}
        exact={true}
      />
      <ContentRoute
        from="/assets/asset-return"
        component={AssetReturnIndex}
        exact={true}
      />
    </Switch>
  );
};
