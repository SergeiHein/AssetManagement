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
import { EditableFormStyles } from "../../layout/components/custom/css/FormTableGrid_Styles";
import { TokenContext } from "../../../app/BasePage";
import { appsetting } from "../../../envirment/appsetting";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";
import moment from "moment";

const useStyles = makeStyles({
  Donebtn: {
    minWidth: 20,
  },

  Clearbtn: {
    minWidth: 20,
    marginLeft: 10,
  },
});

export default function SupplierEdit({
  EditRow,
  GetApi,
  setGetApi,
  setUpdateSuccess,
  setUpdateError,
  SetSelectedId,
}) {
  const classes = useStyles();
  const [GetData, SetGetData] = useState({ ...EditRow });

  const [UpdatehelperNameText, SetUpdatehelperNameText] = useState();
  const [UpdateNameError, setUpdateNameError] = useState(false);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  const { token } = useContext(TokenContext);
  const { server_path } = appsetting;

  const [open, setOpen] = React.useState(false);

  const handleCancel = () => {
    setOpen(false);
    SetGetData((prevProps) => {
      return { ...prevProps, active: !prevProps.active };
    });
  };

  function handleUpdate() {
    let isActive = false;
    SetGetData((prevProps) => {
      isActive = prevProps.active;
      return { ...prevProps, active: !prevProps.active };
    });
    if (
      GetData.eMessage === "Supplier Name already used in Asset Form." &&
      isActive === true
    ) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  const [Updateopen, setUpdateOpen] = React.useState(false);

  const handleUpdateCancel = () => {
    setUpdateOpen(false);
  };

  function EditHandler() {
    const Updatechecking = GetApi.filter(
      (item) =>
        item.supplier_Name === GetData.supplier_Name &&
        !(item.supplier_ID === GetData.supplier_ID)
    );
    if (GetData.supplier_Name === "") {
      setUpdateNameError(true);
      SetUpdatehelperNameText("*Supplier name cannot be empty");
    } else {
      setUpdateNameError(false);
      SetUpdatehelperNameText("");
      if (Updatechecking.length > 0) {
        setUpdateOpen(true);
      } else {
        fetch(`${server_path}api/supplier`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(GetData),
        }).then((res) => {
          if (res.status === 200) {
            fetch(`${server_path}api/supplier`, {
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
              brandObject: null,
              supplierObject: {
                supplierName: `${EditRow.supplier_Name} to ${GetData.supplier_Name}`,
                address: `${EditRow.supplier_Address} to ${GetData.supplier_Address}`,
                contactNo: `${EditRow.supplier_ContactNo} to ${GetData.supplier_ContactNo}`,
                email: `${EditRow.supplier_Email} to ${GetData.supplier_Email}`,
                remark: `${EditRow.supplier_Remark} to ${GetData.supplier_Remark}`,
                active: `${EditRow.active} to ${GetData.active}`,
              },
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

            SetSelectedId(null);
            setUpdateSuccess(true);
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
            id="Name"
            value={GetData.supplier_Name}
            error={UpdateNameError}
            helperText={UpdatehelperNameText}
            onChange={(e) => {
              SetGetData({
                ...GetData,
                supplier_Name: e.target.value,
              });
              setUpdateNameError(false);
              SetUpdatehelperNameText("");
            }}
          />
        </EditableFormStyles>
      </TableCell>
      <TableCell align="center">
        <TextField
          id="address"
          value={GetData.supplier_Address}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              supplier_Address: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          id="ContactNo"
          value={GetData.supplier_ContactNo}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              supplier_ContactNo: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          multiline
          rowsMax={3}
          id="Email"
          value={GetData.supplier_Email}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              supplier_Email: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell align="center">
        <TextField
          id="Remark"
          multiline
          rowsMax={4}
          value={GetData.supplier_Remark}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              supplier_Remark: e.target.value,
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
            This supplier is in used.You cannot inactivate this supplier!
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
            There is a duplicate record for this Supplier Name. Please check and
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
