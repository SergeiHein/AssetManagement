import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { TokenContext } from "../../../app/BasePage";
import { appsetting } from "../../../envirment/appsetting";
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

export default function BrandEdit({
  EditRow,
  TypeApi,
  SetTypeApi,
  Api,
  checked,
  setUpdateSuccess,
  setUpdateError,
  SetSelectedId,
}) {
  const classes = useStyles();
  const [GetData, SetGetData] = useState({ ...EditRow });
  const { token } = useContext(TokenContext);
  const { server_path } = appsetting;
  const [open, setOpen] = React.useState(false);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  const handleCancel = () => {
    setOpen(false);
    SetGetData((prevProps) => {
      return { ...prevProps, active: !prevProps.active };
    });
  };

  const [Updateopen, setUpdateOpen] = React.useState(false);

  const handleUpdateCancel = () => {
    setUpdateOpen(false);
  };

  function handleUpdate() {
    let isActive = false;
    SetGetData((prevProps) => {
      isActive = prevProps.active;
      return { ...prevProps, active: !prevProps.active };
    });
    if (
      GetData.message === "Type Name already used in Category Form." &&
      isActive === true
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }
  function EditHandler() {
    const Updatechecking = TypeApi.filter(
      (item) =>
        item.type_Name === GetData.type_Name &&
        !(item.type_ID === GetData.type_ID)
    );
    if (Updatechecking.length > 0) {
      setUpdateOpen(true);
    } else {
      fetch(`${server_path}api/assetType`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(GetData),
      }).then((res) => {
        if (res.status === 200) {
          fetch(`${server_path}api/assetType`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((data) => SetTypeApi(data));

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
            typeObject: {
              typeName: EditRow.type_Name,
              description: `${EditRow.description} to ${GetData.description}`,
              active: `${EditRow.active} to ${GetData.active}`,
            },
            statusObject: null,
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

          setUpdateSuccess(true);
          SetSelectedId(null);
          setOpen(false);
        } else {
          setUpdateError(true);
        }
      });
    }
  }

  return (
    <TableRow>
      <TableCell align="center">{GetData.type_Name}</TableCell>
      <TableCell align="center">
        <TextField
          id="description"
          multiline
          rowsMax={3}
          value={GetData.description}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              description: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell align="center">
        <Checkbox
          checked={GetData.active}
          onChange={handleUpdate}
          color="secondary"
          inputProps={{ "aria-label": "secondary checkbox" }}
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
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This asset type is in used.You cannot inactivate this asset type!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Updateopen}
        onClose={handleUpdateCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            There is a duplicate record for this Type Name. Please check and try
            again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateCancel} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
