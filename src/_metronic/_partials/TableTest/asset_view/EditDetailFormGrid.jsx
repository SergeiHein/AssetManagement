import React, { useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import {
  EditableFormButtonStyles,
  EditableFormStyles,
  EditableInputStyles,
  SelectStyles,
} from "../../../layout/components/custom/css/FormTableGrid_Styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    background: "rgba(0, 0, 0, 0.25) !important",
  },
}));

export default function EditDetailFormGrid({ gridPropValues }) {
  const {
    newValues,
    setNewValues,
    formApiValues,
    selectedRow,
    formValuesErr,
    setFormValuesErr,
    setDialogOpen,
    openSnack,
    setOpenSnack,
    newChanges,
    setNewChanges,
    empID,
    // selectedRow,
    token,
    server_path,
    edited,
    setEdited,
  } = gridPropValues;
  const classes = useStyles();

  const [testState, setTestState] = useState({
    asset_Name: newValues.asset_Name,
    asset_Tag: "",
    supplier: "",
    brand: "",
    model_No: "",
    searial_No: "",
    product_Key: "",
    cost: "",
    asset_Status: "",
    asset_Condition: "",
    owner_Book_Status: "",
    expiry_Date: "",
    warranty: "",
  });

  const [selectedEditableID, setSelectedEditableID] = useState({
    asset_Status_ID: 0,
    supplier_ID: 0,
    brand_ID: 0,
    asset_Condition_ID: 0,
    owner_Book_Status_ID: 0,
    type_ID: 0,
    category_ID: 0,
    location_ID: 0,
  });
  const [editLoading, setEditLoading] = useState(false);

  console.log(newValues);

  useEffect(() => {
    const asset_Status_ID = formApiValues.asset_Status.find(
      (one) => one.status_Name === newValues.asset_Status
    );

    const supplier_ID = formApiValues.supplier.find(
      (one) => one.supplier_Name === newValues.supplier
    );

    const brand_ID = formApiValues.brand.find(
      (one) => one.brand_Name === newValues.brand
    );

    const asset_Condition_ID = formApiValues.asset_Status.find(
      (one) => one.status_Name === newValues.asset_Condition
    );
    const owner_Book_Status_ID = formApiValues.asset_Status.find(
      (one) => one.status_Name === newValues.owner_Book_Status
    );

    const category_ID = formApiValues.category.find(
      (one) => one.category_Name === newValues.category
    );
    const type_ID = formApiValues.asset_Type.find(
      (one) => one.type_Name === newValues.type
    );

    // console.log(type_ID);

    const location_ID = formApiValues.location.find(
      (one) => one.Asset_Location === newValues.location_Name
    );

    // console.log(location_ID);

    setSelectedEditableID({
      asset_Status_ID: asset_Status_ID ? asset_Status_ID.status_ID : 0,
      supplier_ID: supplier_ID ? supplier_ID.supplier_ID : 0,
      brand_ID: brand_ID ? brand_ID.brand_ID : 0,
      asset_Condition_ID: asset_Condition_ID ? asset_Condition_ID.status_ID : 0,
      owner_Book_Status_ID: owner_Book_Status_ID
        ? owner_Book_Status_ID.status_ID
        : 0,
      type_ID: type_ID ? type_ID.type_ID : 0,
      category_ID: category_ID ? category_ID.category_ID : 0,
      location_ID: location_ID ? location_ID.AssetLocation_ID : 0,
    });
  }, [
    formApiValues,
    newValues.asset_Condition,
    newValues.asset_Status,
    newValues.brand,
    newValues.category,
    newValues.owner_Book_Status,
    newValues.supplier,
    newValues.type,
    newValues.location_Name,
  ]);

  // console.log(selectedEditableID);

  function handleEditSubmit(e) {
    e.preventDefault();

    if (selectedRow.asset_Status === "") {
      setFormValuesErr({
        status: true,
      });
      return;
    }

    setEditLoading(true);

    // setNewChanges((prev) => {
    //   return {
    //     ...prev,
    //     asset_Details: [
    //       ...prev.asset_Details,
    //       {
    //         ...testState,
    //         assetDetail_ID: newValues.assetDetail_ID,
    //         time: new Date(),
    //       },
    //     ],
    //   };
    // });

    // selectedRow.supplier = detailRow.supplier;
    // selectedRow.expiry_Date = moment(detailRow.expire_On).format("DD/MM/YYYY");
    // selectedRow.type = detailRow.type;
    // selectedRow.category = detailRow.category;

    const postData = {
      asset_ID: newValues.asset_ID,
      type_ID: selectedEditableID.type_ID,
      category_ID: selectedEditableID.category_ID,
      location_ID: selectedEditableID.location_ID,
      asset_Name: newValues.asset_Name,
      photo_Path: "",
      remaining_Qty: newValues.remaining_Qty,
      minimum_Qty: newValues.minimum_Qty,
      is_Requestable: newValues.is_Requestable,
      note: "",
      created_By: newValues.created_By,
      modified_By: parseInt(empID),
      assetClick_Name: "edit",
      purchase_Qty: newValues.purchase_Qty,
      purchase_Date: moment(newValues.purchase_Date).format("DD/MM/YYYY"),
      message: "",
      asset_Details: [
        {
          assetDetail_ID: newValues.assetDetail_ID,
          asset_ID: newValues.asset_ID,
          supplier_ID: selectedEditableID.supplier_ID,
          asset_Status_ID: selectedEditableID.asset_Status_ID,
          asset_Condition_ID: selectedEditableID.asset_Condition_ID,
          owner_Book_Status_ID: selectedEditableID.owner_Book_Status_ID,
          brandID: selectedEditableID.brand_ID,
          type_ID: selectedEditableID.type_ID,
          model_No: newValues.model_No,
          purchase_Cost: newValues.cost,
          warranty: 0,
          expiry_Date: newValues.expiry_Date,
          asset_Tag: newValues.asset_Tag,
          product_Key: newValues.product_Key,
          searial_No: newValues.searial_No,
          created_By: newValues.created_By,
          modified_By: parseInt(empID),
        },
      ],
    };

    // console.log(newValues);

    for (var i in selectedRow) {
      for (var j in testState) {
        if (j === i) {
          if (testState[i] === "") {
            testState[j] = "";
          } else {
            if (j === "asset_Name") {
              testState[j] = selectedRow[i];
            } else {
              testState[j] = `${selectedRow[i]} to ${testState[j]}`;
            }
            // console.log(selectedRow);
          }
        }
      }
    }

    // for (let i in testState) {
    testState.supplier_Name = testState.supplier;
    delete testState.supplier;
    testState.brand_Name = testState.brand;
    delete testState.brand;
    testState.purchase_Cost = testState.cost;
    delete testState.cost;
    testState.serial_No = testState.searial_No;
    delete testState.searial_No;
    testState.assetName = testState.asset_Name;
    delete testState.asset_Name;
    // delete testState.cost;
    // }
    console.log(postData);

    // console.log(newValues);

    // console.log(testState);
    // console.log(newChanges);

    fetch(`${server_path}api/assetetail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          let auditObj = {
            action_By: parseInt(empID),
            event: "Edit",
            asset_Detail_ID: newValues.assetDetail_ID,
            asset_Location_ID: selectedEditableID.location_ID,
            asset_ID: newValues.asset_ID,
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            assetObject: [testState],
            categoryObjects: null,
            brandObject: null,
            supplierObject: null,
            typeObject: null,
            statusObject: null,
            locationObject: null,
            allocationObject: null,
            description: "",
            requestObject: null,
          };

          console.log(auditObj);

          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            message: "Updated successfully",
            title: "saved",
          });
          setDialogOpen(false);
          fetch(`${server_path}api/AuditTrial`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(auditObj),
          });
        }

        setEditLoading(false);

        setEdited((prev) => !prev);
      })
      .catch((err) => {
        setEditLoading(false);
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "An error has occured",
          title: "error",
        });
        setDialogOpen(false);
      });
  }

  return (
    <>
      <EditableFormStyles onSubmit={(e) => handleEditSubmit(e)}>
        <Grid container spacing={3} style={{ margin: "0", width: "100%" }}>
          {(newValues.supplier !== undefined || null) && (
            <Grid item xs={6}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">Supplier</InputLabel>
                <SelectStyles
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    newValues.supplier === null ||
                    newValues.supplier === undefined
                      ? ""
                      : formApiValues.supplier.length > 0
                      ? newValues.supplier
                      : ""
                  }
                  onChange={(e) => {
                    const id = formApiValues.supplier.find(
                      (one) => one.supplier_Name === e.target.value
                    ).supplier_ID;

                    setNewValues({
                      ...newValues,
                      supplier: e.target.value,
                    });

                    if (!id) return;

                    setTestState({
                      ...testState,
                      supplier: e.target.value,
                    });

                    setSelectedEditableID({
                      ...selectedEditableID,
                      supplier_ID: id,
                    });
                  }}
                >
                  {formApiValues.supplier.map((one) => (
                    <MenuItem value={one.supplier_Name} key={one.supplier_ID}>
                      {one.supplier_Name}
                    </MenuItem>
                  ))}
                </SelectStyles>
              </FormControl>
            </Grid>
          )}

          {(newValues.brand !== undefined || null) && (
            <Grid item xs={6}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">Brand</InputLabel>
                <SelectStyles
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    newValues.brand === null || newValues.brand === undefined
                      ? ""
                      : formApiValues.brand.length > 0
                      ? newValues.brand
                      : ""
                  }
                  onChange={(e) => {
                    const id = formApiValues.brand.find(
                      (one) => one.brand_Name === e.target.value
                    ).brand_ID;

                    setTestState({
                      ...testState,
                      brand: e.target.value,
                    });

                    setSelectedEditableID({
                      ...selectedEditableID,
                      brand_ID: id,
                    });
                    setNewValues({
                      ...newValues,
                      brand: e.target.value,
                    });
                  }}
                >
                  {formApiValues.brand.map((one) => (
                    <MenuItem value={one.brand_Name} key={one.brand_ID}>
                      {one.brand_Name}
                    </MenuItem>
                  ))}
                </SelectStyles>
              </FormControl>
            </Grid>
          )}
          {(newValues.asset_Tag !== undefined || null) && (
            <Grid item xs={6}>
              <EditableInputStyles
                style={{ width: "100%" }}
                disabled={newValues.generateCodeMessage ? true : false}
                id="filled-disabled"
                label="Asset Tag"
                defaultValue={newValues.asset_Tag}
                onChange={(e) => {
                  setTestState({
                    ...testState,
                    asset_Tag: e.target.value,
                  });
                  setNewValues({ ...newValues, asset_Tag: e.target.value });
                }}
              />
            </Grid>
          )}
          {(newValues.model_No !== undefined || null) && (
            <Grid item xs={6}>
              <EditableInputStyles
                label="Model No."
                value={newValues.model_No}
                onChange={(e) => {
                  setTestState({
                    ...testState,
                    model_No: e.target.value,
                  });
                  setNewValues({ ...newValues, model_No: e.target.value });
                }}
              />
            </Grid>
          )}
          {(newValues.searial_No !== undefined || null) && (
            <Grid item xs={6}>
              <EditableInputStyles
                id="standard-number-serial-no"
                label="Serial Number"
                onChange={(e) => {
                  setTestState({
                    ...testState,
                    searial_No: e.target.value,
                  });
                  setNewValues({ ...newValues, searial_No: e.target.value });
                }}
                value={newValues.searial_No}
              />
            </Grid>
          )}
          {newValues.category.toLowerCase() === "license" && (
            <Grid item xs={6}>
              <EditableInputStyles
                id="standard-number-product-key"
                label="Product Key"
                onChange={(e) => {
                  setTestState({
                    ...testState,
                    product_Key: e.target.value,
                  });

                  setNewValues({
                    ...newValues,
                    product_Key: e.target.value,
                  });
                }}
                value={newValues.product_Key}
              />
            </Grid>
          )}
          {(newValues.cost !== undefined || null) && (
            <Grid item xs={6}>
              <EditableInputStyles
                type="number"
                label="Cost "
                onChange={(e) => {
                  setTestState({
                    ...testState,
                    cost: parseInt(e.target.value),
                  });
                  setNewValues({
                    ...newValues,
                    cost: parseInt(e.target.value),
                  });
                }}
                value={newValues.cost}
              />
            </Grid>
          )}
          {(newValues.asset_Status !== undefined || null) && (
            <Grid item xs={6}>
              <FormControl
                style={{ width: "100%" }}
                error={formValuesErr.status}
              >
                <InputLabel id="demo-simple-select-label" required>
                  Asset Status
                </InputLabel>
                <SelectStyles
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    formApiValues.asset_Status.length > 0
                      ? newValues.asset_Status
                      : ""
                  }
                  required
                  onChange={(e) => {
                    const id = e.currentTarget.dataset.id;

                    setSelectedEditableID({
                      ...selectedEditableID,
                      asset_Status_ID: parseInt(id),
                    });
                    setFormValuesErr({
                      status: false,
                    });
                    setTestState({
                      ...testState,
                      asset_Status: e.target.value,
                    });
                    setNewValues({
                      ...newValues,
                      asset_Status: e.target.value,
                    });
                  }}
                >
                  {formApiValues.asset_Status
                    .filter((one) => one.statusType_Name === "Asset Status")
                    .map((one) => (
                      <MenuItem
                        value={one.status_Name}
                        key={one.status_ID}
                        data-id={one.status_ID}
                      >
                        {one.status_Name}
                      </MenuItem>
                    ))}
                </SelectStyles>
                {formValuesErr.status && (
                  <FormHelperText>Asset Status can't be empty</FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}

          {(newValues.asset_Condition !== undefined || null) && (
            <Grid item xs={6}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">
                  Asset Condition
                </InputLabel>
                <SelectStyles
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    formApiValues.asset_Condition.length > 0
                      ? newValues.asset_Condition
                      : ""
                  }
                  onChange={(e) => {
                    const id = e.currentTarget.dataset.id;

                    setSelectedEditableID({
                      ...selectedEditableID,
                      asset_Condition_ID: parseInt(id),
                    });
                    setFormValuesErr({
                      status: false,
                    });
                    setTestState({
                      ...testState,
                      asset_Condition: e.target.value,
                    });
                    setNewValues({
                      ...newValues,
                      asset_Condition: e.target.value,
                    });
                  }}
                >
                  {formApiValues.asset_Condition
                    .filter((one) => one.statusType_Name === "Asset Condition")
                    .map((one) => (
                      <MenuItem
                        value={one.status_Name}
                        key={one.status_ID}
                        data-id={one.status_ID}
                      >
                        {one.status_Name}
                      </MenuItem>
                    ))}
                </SelectStyles>
              </FormControl>
            </Grid>
          )}
          {/* newValues.category.toLowerCase() === "license" && */}
          {newValues.category.toLowerCase() === "vehicle" && (
            <Grid item xs={6}>
              <FormControl style={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">
                  Owner Book Status
                </InputLabel>
                <SelectStyles
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={
                    newValues.owner_Book_Status === null ||
                    newValues.owner_Book_Status === undefined
                      ? ""
                      : formApiValues.owner_Book_Status.length > 0
                      ? newValues.owner_Book_Status
                      : ""
                  }
                  onChange={(e) => {
                    const id = e.currentTarget.dataset.id;

                    setSelectedEditableID({
                      ...selectedEditableID,
                      owner_Book_Status_ID: parseInt(id),
                    });

                    setTestState({
                      ...testState,
                      owner_Book_Status: e.target.value,
                    });

                    setNewValues({
                      ...newValues,
                      owner_Book_Status: e.target.value,
                    });
                  }}
                >
                  {formApiValues.owner_Book_Status
                    .filter(
                      (one) => one.statusType_Name === "Owner Book Status"
                    )
                    .map((one) =>
                      one.statusType_ID === 3 ? (
                        <MenuItem
                          value={one.status_Name}
                          key={one.status_ID}
                          data-id={one.status_ID}
                        >
                          {one.status_Name}
                        </MenuItem>
                      ) : null
                    )}
                </SelectStyles>
              </FormControl>
            </Grid>
          )}

          {(newValues.warranty !== undefined || null) && (
            <Grid item xs={6}>
              <EditableInputStyles
                type="number"
                label="Warranty (years)"
                inputProps={{ min: "0", max: "20" }}
                onChange={(e) => {
                  setTestState({
                    ...testState,
                    warranty: parseInt(e.target.value),
                  });

                  setNewValues({
                    ...newValues,
                    warranty: parseInt(e.target.value),
                  });
                }}
                value={newValues.warranty}
              />
            </Grid>
          )}

          {(newValues.expiry_Date !== undefined || null) && (
            <Grid
              item
              xs={6}
              style={{
                marginTop: "-15px",
              }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Expiry Date"
                  format="dd/MM/yyyy"
                  inputValue={newValues.expiry_Date}
                  onChange={(e) => {
                    setTestState({
                      ...testState,
                      expiry_Date: moment(e)
                        .format("DD-MM-YYYY")
                        .split("T")[0]
                        .replace(/-/gi, "/"),
                    });
                    setNewValues({
                      ...newValues,
                      expiry_Date: moment(e)
                        .format("DD-MM-YYYY")
                        .split("T")[0]
                        .replace(/-/gi, "/"),
                    });
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          )}
        </Grid>

        <EditableFormButtonStyles>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{
              minWidth: "120px",
              color: "#fff",
              marginRight: "15px",
            }}
          >
            Save
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setDialogOpen(false);
            }}
            style={{ minWidth: "80px" }}
          >
            Cancel
          </Button>
        </EditableFormButtonStyles>
      </EditableFormStyles>
      <Backdrop className={classes.backdrop} open={editLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
