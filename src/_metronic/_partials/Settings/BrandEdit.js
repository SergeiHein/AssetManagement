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
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import { EditableFormStyles } from "../../layout/components/custom/css/FormTableGrid_Styles";
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
  GetApi,
  setGetApi,
  BrandApi,
  checked,
  setUpdateSuccess,
  setUpdateError,
  SetSelectedId,
}) {
  const classes = useStyles();
  const [GetData, SetGetData] = useState({ ...EditRow });
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [open, setOpen] = React.useState(false);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

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

    if (
      GetData.eMessage === "Brand Name already used in Asset Form." &&
      isActive === true
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  function EditHandler() {
    const Updatechecking = GetApi.filter(
      (item) =>
        item.brand_Name === GetData.brand_Name &&
        !(item.brand_ID === GetData.brand_ID)
    );
    if (GetData.brand_Name === "") {
      setUpdateNameError(true);
      SetUpdatehelperNameText("*Brand name cannot be empty");
    } else {
      setUpdateNameError(false);
      SetUpdatehelperNameText("");
      if (Updatechecking.length > 0) {
        setUpdateOpen(true);
      } else {
        fetch(`${server_path}api/brand`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(GetData),
        }).then((res) => {
          if (res.status === 200) {
            fetch(`${server_path}api/brand`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
              .then((res) => res.json())
              .then((data) => setGetApi(data));

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
              brandObject: {
                brandName: `${EditRow.brand_Name} to ${GetData.brand_Name}`,
                description: `${EditRow.description} to ${GetData.description}`,
                active: `${EditRow.active} to ${GetData.active}`,
              },
              supplierObject: null,
              typeObject: null,
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
  }

  return (
    <TableRow>
      <TableCell align="center">
        <EditableFormStyles>
          <TextField
            id=" brand Name"
            error={UpdateNameError}
            helperText={UpdatehelperNameText}
            value={GetData.brand_Name}
            onChange={(e) => {
              SetGetData({
                ...GetData,
                brand_Name: e.target.value,
              });
              setUpdateNameError(false);
              SetUpdatehelperNameText("");
            }}
          />
        </EditableFormStyles>
      </TableCell>
      <TableCell align="center">
        <TextField
          multiline
          rowsMax={4}
          id="description"
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
            This brand is in used.You cannot inactivate this brand!
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
            There is a duplicate record for this Brand Name. Please check and
            try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleData} color="secondary">
            Yes
          </Button> */}
          <Button onClick={handleUpdateCancel} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
