import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";
import moment from "moment";

const useStyles = makeStyles({
  Donebtn: {
    minWidth: 20,
    marginRight: 10,
  },
  Clearbtn: {
    minWidth: 20,
    marginLeft: 10,
  },
});

export default function EditTable({
  EditRow,
  GetApi,
  SetstatusApi,
  StatusApi,
  StatusTypeApi,
  SetSelectedId,
  setUpdateSuccess,
  setUpdateError,
}) {
  const classes = useStyles();
  const [GetData, SetGetData] = useState({ ...EditRow });
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  function EditHandler() {
    fetch(`${server_path}api/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(GetData),
    }).then(
      (res) => {
        if (res.status === 200) {
          fetch(`${server_path}api/status`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((data) => SetstatusApi(data));

          const AuditData = {
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            action_By: parseInt(empID),
            event: "Edit",
            asset_Detail_ID: "0",
            asset_ID: 0,
            assetLocation_ID: 0,
            description: "",
            assetObject: [],
            categoryObjects: null,
            brandObject: null,
            supplierObject: null,
            typeObject: null,
            statusObject: {
              statusName: EditRow.status_Name,
              chartColor: `${EditRow.chartColour_Code} to ${GetData.chartColour_Code}`,
              note: `${EditRow.note} to ${GetData.note}`,
            },
            locationObject: null,
            allocationObject: [],
            requestObject: null,
          };
          fetch(`${server_path}api/AuditTrial`, {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(AuditData),
          });

          SetSelectedId(null);
          setUpdateSuccess(true);
        } else {
          setUpdateError(true);
        }
      },
      [server_path, token]
    );
  }

  return (
    <TableRow>
      <TableCell align="center">{GetData.status_Name}</TableCell>
      {StatusTypeApi.map((subrow) =>
        subrow.statusType_ID === GetData.statusType_ID ? (
          <TableCell align="center" key={subrow.statusType_ID}>
            {subrow.statusType_Name}
          </TableCell>
        ) : null
      )}

      <TableCell align="center">
        <input
          id="note"
          type="color"
          value={GetData.chartColour_Code}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              chartColour_Code: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          id="note"
          value={GetData.note}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              note: e.target.value,
            })
          }
        />
      </TableCell>

      <TableCell align="center">
        <Button
          className={classes.Donebtn}
          color="primary"
          type="submit"
          size="small"
          onClick={EditHandler}
        >
          <DoneIcon />
        </Button>
        <Button
          className={classes.Clearbtn}
          color="secondary"
          size="small"
          onClick={() => SetSelectedId(null)}
        >
          <ClearIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
}
