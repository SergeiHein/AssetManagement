import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { appsetting } from "../../../../../envirment/appsetting";
import Grid from "@material-ui/core/Grid";
import TableEditGrid from "./TableEditGrid";
import TableEditDetail from "./TableEditDetail";
import Snackbar from "@material-ui/core/Snackbar";
import { useSubheader } from "../../../../layout";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import moment from "moment";
import { TokenContext } from "../../../../../app/BasePage";
import { useHistory } from "react-router-dom";

export const EditableFormStyles = styled.form`
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  background: #fff;
  width: 80%;
  padding: 25px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  justify-content: space-around;

  .MuiFormLabel-asterisk {
    color: red;
  }

  .Mui-error {
    color: #f44336 !important;

    &::after {
      border-bottom: 1px solid #f44336 !important;
    }
  }

  .MuiGrid-spacing-xs-3 > .MuiGrid-item {
    display: flex;
    align-items: center;
  }

  .MuiGrid-spacing-xs-3 > .MuiGrid-item:nth-child(even) {
    justify-content: flex-end;
  }

  .MuiFormControl-root {
    width: 65% !important;

    @media (max-width: 1024px) {
      width: 75% !important;
    }

    @media (max-width: 600px) {
      width: 85% !important;
    }
  }

  .description-grid .MuiFormControl-root {
    width: 90% !important;

    textarea {
      min-height: 75px;
    }

    @media (max-width: 1024px) {
      width: 100% !important;
    }
  }

  @media (max-width: 1024px) {
    width: 85%;
  }
  @media (max-width: 600px) {
    width: 95%;
  }
`;

export default function TableEdit(props) {
  const history = useHistory();
  const suhbeader = useSubheader();
  suhbeader.setTitle("Asset Edit");
  const selectedRow = props.location.state?.selectedRow;
  const { token } = useContext(TokenContext);
  const [hideLicenseColumns, setHideLicenseColumns] = useState(null);
  const [hideVehicleColumns, setHideVehicleColumns] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null);

  const [newChanges, setNewChanges] = useState({
    asset_Details: [],
  });

  useEffect(() => {
    if (!props.location.state) {
      return history.replace("/assets/list-table");
    }
  }, [history, props.location.state]);

  if (selectedRow) {
    selectedRow.purchase_Date = moment(
      selectedRow.purchase_Date,
      "DD-MM-YYYY hh:mm:ss"
    )
      .format("DD-MM-YYYY")
      .split("T")[0]
      .replace(/-/gi, "/");
  }

  // console.log(selectedRow);

  useEffect(() => {
    if (selectedRow) {
      // console.log(selectedRow);
      // if (!selectedRow.category) {
      //   setHideLicenseColumns(true);
      //   setHideVehicleColumns(true);
      // } else {
      setHideLicenseColumns(
        selectedRow.category.toLowerCase() === "license" ? false : true
      );
      setHideVehicleColumns(
        selectedRow.category.toLowerCase() === "vehicle" ? false : true
      );
      // }
    }
  }, [selectedRow]);

  console.log(selectedRow);

  const { server_path } = appsetting;
  const [newValues, setNewValues] = useState({ ...selectedRow });

  const [formApiValues, setFormApiValues] = useState({
    location: [],
    supplier: [],
    brand: [],
    asset_Status: [],
    asset_Condition: [],
    owner_Book_Status: [],
  });

  const [assetDetails, setAssetDetails] = useState([]);
  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState({
    finish: false,
    success: null,
  });

  const { openSnackOpen, vertical, horizontal, title, message } = openSnack;

  const [formValuesErr, setFormValuesErr] = useState({
    dateErr: false,
    location: false,
    asset_Status: false,
  });
  const [urlImg, setURLImg] = useState("");

  const [locationID, setLocationID] = useState(newValues.location_ID);

  // get asset detail values for edit table

  useEffect(() => {
    fetch(
      `${server_path}api/AssetDetail/GetAllAssetID?assetid=${newValues.asset_ID}&categoryid=${newValues.category_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAssetDetails(data);
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
  }, [server_path, newValues.asset_ID, newValues.category_ID, token]);

  // get api values for edit table form

  useEffect(() => {
    const urls = [
      `${server_path}api/AssetLocation/LocationTreeView`,
      `${server_path}api/supplier/supplierDropDownList`,
      `${server_path}api/Brand/GetDropDown`,
      `${server_path}api/statustreeview`,
    ];

    const requests = urls.map((one) =>
      fetch(one, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(requests)
      .then((res) => {
        return Promise.all(res.map((one) => one.json()));
      })
      .then((arr) => {
        if (selectedRow?.location_ID) {
          newValues.location = arr[0].find(
            (one) => one.AssetLocation_ID === selectedRow.location_ID
          )?.Asset_Location;
        }
        const EditTreeData = [...arr[0]];
        const TreeViewData = EditTreeData.sort(function(obj1, obj2) {
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

        setFormApiValues((prev) => {
          return {
            ...prev,
            location: setting,
            supplier: arr[1],
            brand: arr[2],
            asset_Status: arr[3],
            asset_Condition: arr[3],
            owner_Book_Status: arr[3],
          };
        });
      });
  }, [server_path, token]);

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  const gridPropValues = {
    selectedRow: selectedRow,
    newValues: newValues,
    setNewValues: setNewValues,
    formApiValues: formApiValues,
    formValuesErr: formValuesErr,
    setFormValuesErr: setFormValuesErr,
    urlImg: urlImg,
    setUrlImg: setURLImg,
    openSnack: openSnack,
    setOpenSnack: setOpenSnack,
    setLocationID: setLocationID,
    locationID: locationID,
    newChanges: newChanges,
    setNewChanges: setNewChanges,
    updateLoading: updateLoading,
    setUpdateLoading: setUpdateLoading,
  };

  const detailPropValues = {
    formApiValues: formApiValues,
    assetDetails: assetDetails,
    newValues: newValues,
    locationID: locationID,
    openSnack: openSnack,
    setOpenSnack: setOpenSnack,
    hideLicenseColumns: hideLicenseColumns,
    hideVehicleColumns: hideVehicleColumns,
    selectedRow2: selectedRow,
    newChanges: newChanges,
    setNewChanges: setNewChanges,
    updateLoading: updateLoading,
    loading: loading,
  };
  return (
    <>
      <EditableFormStyles>
        <Grid container spacing={3} style={{ margin: "0", width: "100%" }}>
          <TableEditGrid gridPropValues={gridPropValues}></TableEditGrid>
        </Grid>
      </EditableFormStyles>
      <TableEditDetail detailPropValues={detailPropValues}></TableEditDetail>
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
