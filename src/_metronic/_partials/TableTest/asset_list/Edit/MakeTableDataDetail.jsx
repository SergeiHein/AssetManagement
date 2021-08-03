import { v4 as uuidv4 } from "uuid";
import moment from "moment";

function makePerson(assetDetail, hideLicenseColumns, hideVehicleColumns) {
  return {
    id: uuidv4(),
    assetDetail_ID: assetDetail.assetDetail_ID,
    asset_ID: assetDetail.asset_ID,
    asset_Tag: assetDetail.asset_Tag,
    supplier:
      assetDetail.supplier_Name === null ? "" : assetDetail.supplier_Name,
    supplier_ID: assetDetail ? assetDetail.supplier_ID : "",
    brand: assetDetail.brand_Name === null ? "" : assetDetail.brand_Name,
    brandID: assetDetail ? assetDetail.brandID : "",
    model_No: assetDetail.model_No,
    searial_No: assetDetail.searial_No,
    product_Key: hideLicenseColumns ? undefined : assetDetail.product_Key,
    asset_Status: assetDetail.asset_Status,
    asset_Status_ID: assetDetail.asset_Status_ID,
    asset_Condition: assetDetail.asset_Condition,
    asset_Condition_ID: assetDetail.asset_Condition_ID,
    owner_Book_Status: hideVehicleColumns
      ? undefined
      : assetDetail.owner_Book_Status,
    owner_Book_Status_ID: assetDetail.owner_Book_Status_ID,
    expiry_Date: moment(assetDetail.expiry_Date)
      .format("DD-MM-YYYY")
      .split("T")[0]
      .replace(/-/gi, "/"),
    warranty: assetDetail.warranty,
    purchase_Cost: assetDetail.purchase_Cost,
    generateCodeMessage: assetDetail.generateCodeMessage,
    created_By: assetDetail.created_By,
    modified_By: 0,
  };
}

export default function MakeTableDataDetail(
  assetDetails,
  formApiValues,
  hideLicenseColumns,
  hideVehicleColumns
) {
  for (let i in assetDetails) {
    if (
      assetDetails[i].asset_Status_ID === 0 ||
      assetDetails[i].asset_Status_ID
    ) {
      let sup = formApiValues.asset_Status.find((val) => {
        return val.status_ID === assetDetails[i].asset_Status_ID;
      });

      if (sup) {
        assetDetails[i].asset_Status = sup.status_Name;
      } else {
        assetDetails[i].asset_Status = "";
      }
    }
    if (
      assetDetails[i].asset_Condition_ID === 0 ||
      assetDetails[i].asset_Condition_ID
    ) {
      let sup = formApiValues.asset_Condition.find((val) => {
        return val.status_ID === assetDetails[i].asset_Condition_ID;
      });

      if (sup) {
        assetDetails[i].asset_Condition = sup.status_Name;
      } else {
        assetDetails[i].asset_Condition = "";
      }
    }
    if (
      assetDetails[i].owner_Book_Status_ID === 0 ||
      assetDetails[i].owner_Book_Status_ID
    ) {
      let sup = formApiValues.owner_Book_Status.find((val) => {
        return val.status_ID === assetDetails[i].owner_Book_Status_ID;
      });
      if (sup) {
        assetDetails[i].owner_Book_Status = sup.status_Name;
      } else {
        assetDetails[i].owner_Book_Status = "";
      }
    }
  }

  const generateData = () => {
    return assetDetails.map((assetDetail, i) => {
      return {
        ...makePerson(
          assetDetail,

          hideLicenseColumns,
          hideVehicleColumns
        ),
      };
    });
  };

  return generateData();
}
