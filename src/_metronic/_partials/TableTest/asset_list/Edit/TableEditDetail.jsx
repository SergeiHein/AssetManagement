import React, { useMemo, useState, useEffect, useContext } from "react";
import MakeTableDataDetail from "./MakeTableDataDetail";
import TableEditDetailForm from "./TableEditDetailForm";
import MakeTable from "../../../../layout/components/custom/MakeTable";
import styled from "styled-components";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { appsetting } from "../../../../../envirment/appsetting";
import { useHistory } from "react-router-dom";
import { TokenContext } from "../../../../../app/BasePage";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

const Styles = styled.div`
  width: 100%;
  margin: 30px auto 0 auto;

  .MuiPaper-root {
    box-shadow: 0 0 7px 0 rgba(82, 63, 105, 0.15) !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    background: "rgba(0, 0, 0, 0.25) !important",
  },
}));

const EditButton = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgba(54, 153, 255, 0.5) !important;
  transition: all 300ms;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: rgba(54, 153, 255, 0.8) !important;
  }
`;

const FinalSubmitBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

export default function TableEditDetail({ detailPropValues }) {
  const {
    formApiValues,
    assetDetails,
    newValues,
    locationID,
    openSnack,
    setOpenSnack,
    hideLicenseColumns,
    hideVehicleColumns,
    selectedRow2,
    newChanges,
    setNewChanges,
    updateLoading,
    loading,
  } = detailPropValues;

  const history = useHistory();

  const classes = useStyles();
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const [oriData, setOriData] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const selectedRow = oriData.find((row) => row.assetDetail_ID === selectedId);

  const [editLoading, setEditLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEditableID, setSelectedEditableID] = useState({
    supplier_ID: newValues.supplier_ID ? newValues.supplier_ID : 0,
    asset_Status_ID: newValues.asset_Status_ID ? newValues.asset_Status_ID : 0,
    asset_Condition_ID: newValues.asset_Condition_ID
      ? newValues.asset_Condition_ID
      : 0,
    owner_Book_Status_ID: newValues.owner_Book_Status_ID
      ? newValues.owner_Book_Status_ID
      : 0,
    brandID: newValues.brandID ? newValues.brandID : 0,
  });

  useEffect(() => {
    setOriData(
      MakeTableDataDetail(
        assetDetails,
        formApiValues,
        newValues,
        hideLicenseColumns,
        hideVehicleColumns
      )
    );
  }, [
    assetDetails,
    formApiValues,
    newValues,
    hideLicenseColumns,
    hideVehicleColumns,
  ]);

  function handleEditChange(id, changes) {
    const newValues = [...oriData];
    const index = newValues.findIndex((value) => value.id === id);
    newValues[index] = changes;

    setOriData(newValues);
  }

  function submitFormData(e) {
    e.preventDefault();
    setEditLoading(true);
    let postFormData = { ...newValues };
    let postOriData = [...oriData];

    postOriData.forEach((one) => {
      one.type_ID = newValues.type_ID;
      one.product_Key = one.product_Key === undefined ? "" : one.product_Key;

      delete one.id;
      delete one.asset_Condition;
      delete one.asset_Status;
      delete one.supplier;
      delete one.brand;
      delete one.owner_Book_Status;
      delete one.generateCodeMessage;
    });

    let postData = {
      ...postFormData,
      is_Requestable: postFormData.requestable === "yes" ? true : false,
      minimum_Qty: postFormData.min_Qty,
      purchase_Qty: postFormData.total_Qty,
      asset_Name: postFormData.asset,
      modified_By: parseInt(empID),
      created_By: postFormData.created_By ? postFormData.created_By : 0,
      assetClick_Name: "edit",
      photo_Path: postFormData.photo_Path ? postFormData.photo_Path : "",
      location_ID: locationID,
      remaining_Qty: 0,
      asset_Details: [...postOriData],
    };

    // postData.photo_Path = "";

    delete postData.aD_Archive;
    delete postData.min_Qty;
    delete postData.asset;
    delete postData.asset_Status_ID;
    delete postData.asset_Condition_ID;
    delete postData.owner_Book_Status_ID;
    delete postData.owner_Book_Status_Name;
    delete postData.asset_Condition_Name;
    delete postData.asset_Status_Name;
    delete postData.category;
    delete postData.type;
    delete postData.location;
    delete postData.requestable;
    delete postData.total_Qty;
    delete postData.asset_Archieve;
    delete postData.brand;
    delete postData.brandID;
    delete postData.cost;
    delete postData.error_Message;
    delete postData.expiry_Date;
    delete postData.model_No;
    delete postData.owner_Book_Status_ID;
    delete postData.assetDetail_ID;
    delete postData.product_Key;
    delete postData.serial_No;
    delete postData.status;
    delete postData.supplier;
    delete postData.supplier_ID;
    delete postData.warranty;
    delete postData.asset_Tag;
    delete postData.supplier_Name;
    delete postData.brand_Name;
    delete postData.asset_Status;
    delete postData.available;
    delete postData.created_On;
    delete postData.issue_Date;
    delete postData.issued_To;
    delete postData.issues;
    delete postData.purchase_Cost;
    delete postData.requests;
    delete postData.return_Due_On;
    delete postData.returns;
    delete postData.asset_Condition;
    delete postData.owner_Book_Status;
    delete postData.image;
    delete postData.updated_On;

    // start here

    // console.log(newChanges.asset_Details);

    const same = newChanges.asset_Details
      .sort((a, b) => (a.time > b.time ? -1 : b.time > a.time ? 1 : 0))
      .filter(
        (thing, index, self) =>
          self.findIndex((t) => t.assetDetail_ID === thing.assetDetail_ID) ===
          index
      )
      .sort((a, b) =>
        a.assetDetail_ID > b.assetDetail_ID
          ? 1
          : b.assetDetail_ID > a.assetDetail_ID
          ? -1
          : 0
      );

    same.forEach((one) => {
      delete one.time;
      // delete one.supplier;
    });

    // console.log(assetDetails);

    const result = assetDetails
      .filter((o) =>
        same.some(({ assetDetail_ID }) => o.assetDetail_ID === assetDetail_ID)
      )
      .map((one, index) => {
        const existingKeys = Object.keys(same[index]).filter((key) =>
          one.hasOwnProperty(key)
        );
        let newObj = existingKeys.reduce((acc, curr) => {
          acc[curr] = one[curr];
          return acc;
        }, {});
        return newObj;
      });

    // console.log(result, same);

    const final = result.map((one, index) => {
      const existingKeys = Object.keys(same[index]).filter((key) =>
        one.hasOwnProperty(key)
      );
      let newObj = existingKeys.reduce((acc, curr) => {
        // console.log(curr);
        if (curr === "assetDetail_ID") {
          acc[curr] = one[curr];
        } else {
          if (same[index][curr] === "") {
            acc[curr] = "";
          } else {
            acc[curr] = `${one[curr]} to ${same[index][curr]}`;
          }
          // acc[curr] = `${one[curr]} to ${same[index][curr]}`;
        }
        return acc;
      }, {});
      return newObj;
    });

    // console.log(final);

    // console.log(arr, newChanges.asset_Details);

    // for (let i in result) {
    //   for (let j in newChanges.asset_Details) {

    //   }
    // }

    // console.log(result, newChanges.asset_Details);

    // var keys = {};
    // for (var i in selectedRow2) {
    //   for (var j in newChanges) {
    //     if (j === i) {
    //       newChanges[j] = `${selectedRow2[i]} to ${newChanges[j]}`;
    //     }
    //   }
    // }

    for (let i in final) {
      delete final[i].assetDetail_ID;

      final[i].assetName = selectedRow2.asset;
    }

    // let arr = [];

    // for (const property in keys) {
    //   arr.push(`${property}: ${keys[property]}`);
    // }

    // const finalNewChanges = {
    //   ...newChanges,
    //   asset_Details: final,
    // };

    // console.log(final);

    // console.log(finalNewChanges);

    // end here

    console.log(postData);
    // console.log(assetDetails);

    fetch(`${server_path}api/assetdetail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => {
        if (res.status !== 200) {
          setEditLoading(false);
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            message: "An error has occured, please try again later",
            title: "error",
          });

          return;
        }
        if (res.status === 200) {
          let auditObj = {
            action_By: parseInt(empID),
            event: "Edit",
            asset_Detail_ID: "0",
            asset_Location_ID: 0,
            asset_ID: selectedRow.asset_ID,
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            assetObject: final,
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
          setEditLoading(false);
          fetch(`${server_path}api/AuditTrial`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(auditObj),
          });

          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            message: "Asset has successfully updated",
            title: "saved",
          });
          setTimeout(() => {
            return history.replace("/assets/list-table");
          }, 1000);
        }
      })
      .catch((err) => {
        setEditLoading(false);
        console.log(err);
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "An error has occured, please try again later",
          title: "error",
        });

        setTimeout(() => {
          return history.replace("/assets/list-table");
        }, 1000);
      });
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Actions",
        id: "delete",

        Cell: (tableProps) => {
          return (
            <>
              <span
                style={{
                  cursor: "pointer",
                  color: "grey",
                  textDecoration: "underline",
                }}
                onClick={(event) => {
                  let id = tableProps.row.original.assetDetail_ID;
                  setDialogOpen(true);
                  setSelectedId(id);
                }}
              >
                <Tooltip title="Edit Row">
                  <EditButton aria-label="edit">
                    <CreateIcon fontSize="small" />
                  </EditButton>
                </Tooltip>
              </span>
            </>
          );
        },
      },
      {
        Header: "Asset Tag",
        accessor: "asset_Tag",
      },
      {
        Header: "Supplier",
        accessor: "supplier",
      },
      {
        Header: "Brand",
        accessor: "brand",
      },
      {
        Header: "Model No.",
        accessor: "model_No",
      },
      {
        Header: "Serial No.",
        accessor: "searial_No",
      },
      {
        Header: "Product Key",
        accessor: "product_Key",
        show: hideLicenseColumns,
      },
      {
        Header: "Asset Status",
        accessor: "asset_Status",
      },
      {
        Header: "Asset Condition",
        accessor: "asset_Condition",
      },
      {
        Header: "Owner Book Status",
        accessor: "owner_Book_Status",
        show: hideVehicleColumns,
      },
      {
        Header: "ExpDate",
        accessor: "expiry_Date",
      },
      {
        Header: "Warranty",
        accessor: "warranty",
      },
      {
        Header: "Cost",
        accessor: "purchase_Cost",
      },
    ],
    [hideLicenseColumns, hideVehicleColumns]
  );

  const data = useMemo(() => oriData, [oriData]);

  return (
    <Styles>
      <MakeTable
        columns={columns}
        data={data}
        hideLicenseColumns={hideLicenseColumns}
        hideVehicleColumns={hideVehicleColumns}
        subject="form-sub"
        loading={loading}
      ></MakeTable>

      <FinalSubmitBtn>
        <Button
          disabled={updateLoading ? true : false}
          variant="contained"
          color="primary"
          onClick={submitFormData}
          style={{ width: "30%", color: "#fff", height: "35px" }}
        >
          Update
        </Button>
      </FinalSubmitBtn>

      {dialogOpen && (
        <TableEditDetailForm
          selectedRow={selectedRow}
          formApiValues={formApiValues}
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
          handleEditChange={handleEditChange}
          selectedEditableID={selectedEditableID}
          setSelectedEditableID={setSelectedEditableID}
          setOpenSnack={setOpenSnack}
          openSnack={openSnack}
          newChanges={newChanges}
          setNewChanges={setNewChanges}
        ></TableEditDetailForm>
      )}
      <Backdrop className={classes.backdrop} open={editLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Styles>
  );
}
