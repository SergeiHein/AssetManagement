import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { EditableFormStyles } from "../../../layout/components/custom/css/FormTableGrid_Styles";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
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

function Alert(props) {
  return <MuiAlert elevation={2} variant="filled" {...props} />;
}

export default function LocationEdit({
  EditRow,
  GetApi,
  setGetApi,
  SetSelectedId,
  setUpdateSuccess,
  setUpdateError,
}) {
  const classes = useStyles();
  const [GetData, SetGetData] = useState({ ...EditRow });
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const [open, setOpen] = React.useState(false);

  const [UpdatehelperNameText, SetUpdatehelperNameText] = useState();
  const [UpdateNameError, setUpdateNameError] = useState(false);

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
    return isActive ? setOpen(true) : null;
    if (
      GetData.eMessage === "Location Name already used in Asset Form." &&
      isActive === true
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function EditHandler(e) {
    e.preventDefault();
    let AuditData;

    if (GetData.asset_Location_Name === "") {
      setUpdateNameError(true);
      SetUpdatehelperNameText("*Location name cannot be empty");
    } else {
      setUpdateNameError(false);
      SetUpdatehelperNameText("");

      switch (GetData.location_Type) {
        case "Location":
          GetData.location_Type = 1;
          break;
        case "Branch":
          GetData.location_Type = 2;
          break;
        case "Department":
          GetData.location_Type = 3;
          break;
        case "Section":
          GetData.location_Type = 4;
          break;
        default:
          GetData.location_Type = 5;
      }
      fetch(`${server_path}api/AssetLocation`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(GetData),
      }).then((res) => {
        if (res.status === 200) {
          fetch(`${server_path}api/AssetLocation/GetAllAssetLocation`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((data) => setGetApi(data));

          if (GetData.location_Type === "Asset Location") {
            AuditData = {
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
              statusObject: null,
              locationObject: {
                locationName: `${EditRow.asset_Location_Name} to ${GetData.asset_Location_Name}`,
                tagPrefix: `${EditRow.tag_Prefix} to ${GetData.tag_Prefix}`,
                description: `${EditRow.asset_Location_Description} to ${GetData.asset_Location_Description}`,
                active: `${EditRow.active} to ${GetData.active}`,
              },
              allocationObject: [],
              requestObject: null,
            };
          } else {
            AuditData = {
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
              statusObject: null,
              locationObject: {
                locationName: EditRow.asset_Location_Name,
                tagPrefix: `${EditRow.tag_Prefix} to ${GetData.tag_Prefix}`,
                description: `${EditRow.asset_Location_Description} to ${GetData.asset_Location_Description}`,
                active: `${EditRow.active} to ${GetData.active}`,
              },
              allocationObject: [],
              requestObject: null,
            };
          }
          fetch(`${server_path}api/AuditTrial`, {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(AuditData),
          });

          setUpdateSuccess(true);
        } else {
          setUpdateError(true);
        }
        SetSelectedId(null);
      });
    }
  }

  return (
    <TableRow>
      {GetData.location_Type === "Asset Location" ? (
        <TableCell align="center">
          <EditableFormStyles>
            <TextField
              id=" brand Name"
              error={UpdateNameError}
              helperText={UpdatehelperNameText}
              value={GetData.asset_Location_Name}
              onChange={(e) => {
                SetGetData({
                  ...GetData,
                  asset_Location_Name: e.target.value,
                });
                setUpdateNameError(false);
                SetUpdatehelperNameText("");
              }}
            />
          </EditableFormStyles>
        </TableCell>
      ) : (
        <TableCell align="center">{GetData.asset_Location_Name}</TableCell>
      )}
      <TableCell align="center">{GetData.Parent_Location}</TableCell>

      <TableCell align="center">
        <TextField
          id="tagPrefix"
          value={GetData.tag_Prefix}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              tag_Prefix: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          id="description"
          value={GetData.asset_Location_Description}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              asset_Location_Description: e.target.value,
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
            This location is in used.You cannot inactivate this location!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleData} color="secondary">
            Yes
          </Button> */}
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
            There is a duplicate record for this location name. Please check and
            try again.
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
