import { v4 as uuidv4 } from "uuid";
import moment from "moment";

function makeRow(hideLicenseColumns, hideVehicleColumns, data) {
  return {
    id: uuidv4(),
    supplier: "",
    brand: "",
    model_No: "",
    asset_Status: "",
    owner_Book_Status: hideVehicleColumns ? undefined : "",
    asset_Condition: "",
    purchase_Cost: "",
    warranty: "",
    expiry_Date: `${moment(new Date())
      .format("DD-MM-YYYY")
      .split("T")[0]
      .replace(/-/gi, "/")}`,
    asset_Tag: data.assetTagNo,
    product_Key: hideLicenseColumns ? undefined : "",
    searial_No: "",
    created_By: 0,
    modified_By: 0,
  };
}

export default function MakeTableDataForm(
  hideLicenseColumns,
  hideVehicleColumns,
  assetTags
) {
  const generateData = () => {
    return assetTags.map((one, i) => {
      return {
        ...makeRow(hideLicenseColumns, hideVehicleColumns, one),
      };
    });
  };

  return generateData;
}
