import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

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
  EditData,
  SetEditdata,
  GetApi,
  SetstatusApi,
  StatusApi,
  added,
  // HandleEdit,
  newData,
}) {
  const classes = useStyles();
  const [GetData, SetGetData] = useState({ ...EditRow });
  //   const [Editdata, Seteditdata] = useState(false);

  function EditHandler() {
    fetch(GetApi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(GetData),
    }).then((res) => {
      if (res.status === 200) {
        fetch(GetApi)
          .then((res) => res.json())
          .then((data) => SetstatusApi(data));
      }
    });

    SetEditdata(!EditData);
  }
  console.log(StatusApi);

  return (
    <TableRow>
      <TableCell>
        <TextField
          id="statusName"
          value={GetData.status_Name}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              status_Name: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell>
        <TextField
          id="createId"
          type="number"
          value={GetData.created_By}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              created_By: e.target.value,
            })
          }
        />
      </TableCell>
      <TableCell>
        <TextField
          id="ModifieBy"
          type="number"
          value={GetData.modified_By}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              modified_By: e.target.value,
            })
          }
        />
      </TableCell>

      <TableCell>
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
          onClick={() => SetEditdata(!EditData)}
        >
          <ClearIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// let isActive = false;
// setUpdatedata((prevProps) => {
//   isActive = prevProps.active;
//   setNewData((prevProps) => ({ ...prevProps, active: !prevProps.active }));
//   if (GetApi.eMessage === "Supplier Name already used in Asset Form.") {
//     isActive ? true(setActiveOpen(true)) : null;
//   }
// });
// }
