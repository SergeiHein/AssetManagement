import React, { useMemo, useState, useEffect, useContext } from "react";
import MakeTableDataForm from "./MakeTableDataForm";
import MakeTable from "../../../../layout/components/custom/MakeTable";
import styled from "styled-components";
import CreateIcon from "@material-ui/icons/Create";
import FormTableEdit from "./FormTableEdit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import { appsetting } from "../../../../../envirment/appsetting";
import moment from "moment";
import { TokenContext } from "../../../../../app/BasePage";

const Styles = styled.div`
  width: 100%;
  margin: 0px auto 0 auto;
`;

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

export default function FormTableIndex({ formTablePropsValues }) {
  const {
    showListFormTable,
    setShowListFormTable,
    hideLicenseColumns,
    hideVehicleColumns,
    quantity,
    formData,
    finalSubmit,
    setFormData,
    selectedTypeId,
    setSelectedTypeId,
    setAssetNameValues,
    // assetNameValues,
    openSnack,
    setOpenSnack,
    setFinalSubmit,
    CategoryApi,
    setURLImg,
    setNewAssetName,
  } = formTablePropsValues;

  const { server_path } = appsetting;

  const [assetTags, setAssetTags] = useState([]);
  const [oriData, setOriData] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const selectedRow = oriData.find((row) => row.id === selectedId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { token, empID } = useContext(TokenContext);
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });

  useEffect(() => {
    setOriData(
      MakeTableDataForm(hideLicenseColumns, hideVehicleColumns, assetTags)
    );
  }, [assetTags, hideLicenseColumns, hideVehicleColumns]);

  useEffect(() => {
    fetch(
      `${server_path}api/assettag?categoryid=${selectedTypeId.category_ID}&purchaseQty=${quantity}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAssetTags(data);

        setLoading({
          finish: true,
          success: true,
        });
      })
      .catch((err) =>
        setLoading({
          finish: true,
          success: false,
        })
      );
  }, [server_path, showListFormTable]);

  function handleEditChange(id, changes) {
    const newValues = [...oriData];

    const index = newValues.findIndex((value) => value.id === id);

    newValues[index] = changes;

    setOriData(newValues);
  }

  function submitFormData(e) {
    setFinalSubmit(!finalSubmit);

    for (let i in oriData) {
      if (oriData[i].asset_Status === "") {
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "Please fill all detail items from the table",
          title: "fill all detail",
        });
        return;
      }
    }
    for (let i in oriData) {
      if (oriData[i].warranty === "") {
        oriData[i].warranty = 0;
      }
      if (oriData[i].purchase_Cost === "") {
        oriData[i].purchase_Cost = 0;
      }
    }

    let postFormData = { ...formData };
    let postOriData = [...oriData];

    postOriData.forEach((one) => {
      delete one.id;
      delete one.status;
      delete one.brand;
      delete one.supplier;
      delete one.show_Expiry_Date;
      delete one.asset_Condition;
      delete one.asset_Status;
      delete one.owner_Book_Status;

      if (one.product_Key === undefined || one.product_Key === null) {
        one.product_Key = "";
      }
    });

    delete postFormData.type;
    delete postFormData.location;
    delete postFormData.category;
    delete postFormData.total_Qty;
    delete postFormData.show_Purchase_Date;

    let postData = {
      ...postFormData,
      ...selectedTypeId,
      assetClick_Name: "new",
      asset_Details: [...postOriData],
    };

    const AuditData = {
      activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
      action_By: parseInt(empID),
      event: "Entry",
      asset_Detail_ID: "0",
      asset_ID: 0,
      assetLocation_ID: postData.location_ID,
      description: "",
      assetObject: [
        {
          assetName: postFormData.asset_Name,
          asset_Tag: "",
          serial_No: "",
          model_No: "",
          product_Key: "",
          asset_Status: "",
          asset_Condition: "",
          owner_Book_Status: "",
          supplier_Name: "",
          brand_Name: "",
          warranty: "",
          expiry_Date: "",
          purchase_Cost: "",
        },
      ],
      categoryObjects: null,
      brandObject: null,
      supplierObject: null,
      typeObject: null,
      statusObject: null,
      locationObject: null,
      allocationObject: [],
      requestObject: null,
    };

    fetch(`${server_path}api/assetdetail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => {
        // return res.status;
        if (res.status === 200) {
          return res.text();
        } else {
          return;
        }
      })
      .then((data) => {
        AuditData.asset_ID = parseInt(data);

        console.log(AuditData);

        fetch(`${server_path}api/AuditTrial`, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(AuditData),
        }).then((res) => console.log(res));

        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "Asset has successfully saved",
          title: "saved",
        });
      })
      .catch((err) => {
        console.log(err);
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "An error has occured, please try again later",
          title: "error",
        });
      });

    setAssetNameValues({
      options: [],
    });
    setURLImg("");
    setNewAssetName("");
    setSelectedTypeId({
      type_ID: "",
      asset_ID: "",
      category_ID: "",
      location_ID: "",
    });
    setFormData({
      type: "",
      category: "",
      purchase_Date: `${moment(new Date())
        .format("DD-MM-YYYY")
        .split("T")[0]
        .replace(/-/gi, "/")}`,
      asset_Name: "",
      purchase_Qty: 0,
      minimum_Qty: 0,
      remaining_Qty: 1,
      total_Qty: 0,
      is_Requestable: false,
      location: "",
      photo_Path: "",
      note: "",
      modified_By: 0,
      created_By: parseInt(empID),
      assetClick_Name: "",
    });

    setShowListFormTable(false);
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
                  let id =
                    event.currentTarget.parentElement.parentElement.dataset.id;
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
          variant="contained"
          color="primary"
          onClick={submitFormData}
          style={{ width: "30%", color: "#fff", height: "35px" }}
        >
          Submit
        </Button>
      </FinalSubmitBtn>

      {dialogOpen && (
        <FormTableEdit
          selectedRow={selectedRow}
          CategoryApi={CategoryApi}
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
          handleEditChange={handleEditChange}
          setOpenSnack={setOpenSnack}
          openSnack={openSnack}
          selectedTypeId={selectedTypeId}
        ></FormTableEdit>
      )}
    </Styles>
  );
}
