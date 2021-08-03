import React, { useState, useEffect, useContext } from "react";
import FormTableIndex from "./FormTableIndex";
import Button from "@material-ui/core/Button";
import { useSubheader } from "../../../../layout";
import { appsetting } from "../../../../../envirment/appsetting";
import moment from "moment";
import FormGrid from "./FormGrid";
import {
  ListFormWrapper,
  ListForm,
} from "../../../../layout/components/custom/css/ListForm_Styles";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { TokenContext } from "../../../../../app/BasePage";
import ForwardDirectoryTree from "antd/lib/tree/DirectoryTree";

export default function FormIndex() {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Create Asset");
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);

  const [formData, setFormData] = useState({
    type: "",
    category: "",
    purchase_Date: `${moment(new Date())
      .format("DD-MM-YYYY")
      .split("T")[0]
      .replace(/-/gi, "/")}`,
    asset_Name: "",
    purchase_Qty: 0,
    minimum_Qty: 0,
    remaining_Qty: 0,
    total_Qty: 0,
    is_Requestable: false,
    location: "",
    photo_Path: "",
    note: "",
    modified_By: 0,
    created_By: parseInt(empID),
    assetClick_Name: "",
  });
  const [formValuesErr, setFormValuesErr] = useState({
    typeErr: false,
    categoryErr: false,
    dateErr: false,
    location: false,
    purchaseQuantityErr: false,
    assetNameErr: false,
  });

  const [showListFormTable, setShowListFormTable] = useState(false);
  const [hideLicenseColumns, setHideLicenseColumns] = useState(null);
  const [hideVehicleColumns, setHideVehicleColumns] = useState(null);
  const [urlImg, setURLImg] = useState("");

  const [finalSubmit, setFinalSubmit] = useState(false);

  const [formApiValues, setFormApiValues] = useState({
    type: [],
    category: [],
    assetName: [],
    location: [],
  });

  const [selectedTypeId, setSelectedTypeId] = useState({
    type_ID: "",
    asset_ID: "",
    category_ID: "",
    location_ID: "",
  });

  const selectedTypeCategoryValues = formApiValues.category.filter(
    (value) => value.type_ID === selectedTypeId.type_ID
  );

  const [assetNameValues, setAssetNameValues] = useState({
    options: [],
  });
  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });

  const [newAssetName, setNewAssetName] = useState("");

  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

  const [CategoryApi, setCategoryApi] = useState({});

  // get values from api for entry form

  useEffect(() => {
    const urls = [
      `${server_path}api/AssetType/AssetTypeDropDownList`,
      `${server_path}api/Category/CategoryDropDownList`,
      `${server_path}api/assetdetail`,
      `${server_path}api/AssetLocation/LocationTreeView`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    Promise.all(requests)
      .then((res) => {
        return Promise.all(res.map((data) => data.json()));
      })
      .then((arr) => {
        console.log(arr);

        const ApiLocationData = [...arr[3]];
        const TreeViewData = ApiLocationData.sort(function(obj1, obj2) {
          return obj1.Parent_ID - obj2.Parent_ID;
        });
        const setting = [];

        const buildNestedTree = (items, data) => {
          // console.log(items);
          if (items) {
            if (items.children.length) {
              buildNestedTree(items.children[0], data);
            } else {
              const filtered = TreeViewData.filter(
                (one) => one.Parent_ID === items.value
              );

              // console.log(filtered);

              filtered.forEach((one) => {
                one.title = one.Asset_Location;
                one.value = one.AssetLocation_ID;
                one.id = one.Parent_ID;
                one.children = [];
                items.children.push(one);
              });

              // console.log(filtered);
            }
          }
        };
        TreeViewData.map((tree) => {
          if (tree.Parent_ID === 0) {
            // console.log(tree);
            setting.push({
              title: tree.Asset_Location,
              value: tree.AssetLocation_ID,
              id: tree.Parent_ID,
              group_List: tree.Group_List,
              children: [],
            });
          } else {
            let index = setting.findIndex(
              (list) => list.group_List === tree.Group_List
            );
            // console.log(setting);
            console.log(setting[index], tree);
            buildNestedTree(setting[index], tree);
          }
        });

        // console.log(setting);

        setFormApiValues((prev) => {
          return {
            ...prev,
            type: arr[0],
            category: arr[1],
            assetName: [...new Set(arr[2])],
            location: setting,
          };
        });
      });
  }, [server_path, token]);

  useEffect(() => {
    setAssetNameValues({
      options: [...new Set(formApiValues.assetName.map((one) => one.asset))],
    });
  }, [formApiValues.assetName, finalSubmit]);

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  console.log(formData);

  function handleListFormSubmit(e) {
    e.preventDefault();

    if (formData.type === "") {
      setFormValuesErr({
        ...formValuesErr,
        typeErr: true,
      });
      return;
    }
    if (formData.category === "") {
      setFormValuesErr({
        ...formValuesErr,
        categoryErr: true,
      });
      return;
    }

    if (!formData.purchase_Date || formData.purchase_Date === "Invalid date") {
      setFormValuesErr({
        ...formValuesErr,
        dateErr: true,
      });
      return;
    }
    if (formData.asset_Name === "") {
      setFormValuesErr({
        ...formValuesErr,
        assetNameErr: true,
      });
      return;
    }
    if (formData.location === "") {
      setFormValuesErr({
        ...formValuesErr,
        locationErr: true,
      });
      return;
    }
    if (!formData.purchase_Qty || 0) {
      setFormValuesErr({
        ...formValuesErr,
        purchaseQuantityErr: true,
      });
      return;
    }

    // submit api

    fetch(`${server_path}api/category/${selectedTypeId.category_ID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setCategoryApi({
          category_ID: data.category_ID,
          category_Name: data.category_Name,
          generate_Code: data.generate_Code,
        })
      );

    setHideLicenseColumns(
      formData.category.toLowerCase() === "license" ? false : true
    );

    setHideVehicleColumns(
      formData.category.toLowerCase() === "vehicle" ? false : true
    );
    setShowListFormTable(false);

    setTimeout(() => {
      setShowListFormTable(true);
    }, 100);
  }

  // form grid props

  const formPropsValues = {
    formValuesErr: formValuesErr,
    setFormValuesErr: setFormValuesErr,
    formData: formData,
    setFormData: setFormData,
    formApiValues: formApiValues,
    selectedTypeId: selectedTypeId,
    setSelectedTypeId: setSelectedTypeId,
    selectedTypeCategoryValues: selectedTypeCategoryValues,
    assetNameValues: assetNameValues,
    setAssetNameValues: setAssetNameValues,
    setOpenSnack: setOpenSnack,
    openSnack: openSnack,
    urlImg: urlImg,
    setURLImg: setURLImg,
    newAssetName: newAssetName,
    setNewAssetName: setNewAssetName,
  };

  // form table props

  const formTablePropsValues = {
    setFinalSubmit: setFinalSubmit,
    finalSubmit: finalSubmit,
    quantity: formData.purchase_Qty,
    showListFormTable: showListFormTable,
    setShowListFormTable: setShowListFormTable,
    hideLicenseColumns: hideLicenseColumns,
    hideVehicleColumns: hideVehicleColumns,
    formData: formData,
    setFormData: setFormData,
    CategoryApi: CategoryApi,
    selectedTypeId: selectedTypeId,
    setSelectedTypeId: setSelectedTypeId,
    openSnack: openSnack,
    setOpenSnack: setOpenSnack,
    assetNameValues: assetNameValues,
    setAssetNameValues: setAssetNameValues,
    setURLImg: setURLImg,
    setNewAssetName: setNewAssetName,
  };

  return (
    <>
      <ListFormWrapper>
        <ListForm autoComplete="off" onSubmit={handleListFormSubmit} noValidate>
          <FormGrid formPropsValues={formPropsValues}></FormGrid>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{
              color: "#fff",
              width: "45%",
              margin: "30px auto 0 auto",
              height: "35px",
            }}
          >
            Get Asset Tags
          </Button>
        </ListForm>
      </ListFormWrapper>
      {showListFormTable && (
        <FormTableIndex
          formTablePropsValues={formTablePropsValues}
        ></FormTableIndex>
      )}

      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackOpen}
        onClose={handleCloseSnack}
        key={vertical + horizontal}
      >
        <SnackbarContent
          aria-describedby="message-id2"
          style={{
            background: `${
              title === "saved"
                ? "#4caf50"
                : title === "fill all detail"
                ? "#ff9100"
                : "#f44306"
            }`,
          }}
          message={
            <span id="message-id2">
              <div>{message}</div>
            </span>
          }
        />
      </Snackbar>
    </>
  );
}
