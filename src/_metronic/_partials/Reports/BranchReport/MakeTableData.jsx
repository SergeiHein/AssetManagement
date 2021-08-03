import moment from "moment";

function makePerson(one) {
  return one;
}

// const range = (len) => {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     arr.push(i);
//   }
//   return arr;
// };

export default function MakeTableData(tableApiValues) {
  for (let i in tableApiValues) {
    if (tableApiValues[i].purchase_Date) {
      tableApiValues[i].purchase_Date = moment(
        tableApiValues[i].purchase_Date
      ).format("DD-MM-YYYY hh:mm:ss");
    }
    if (tableApiValues[i].return_Due_On) {
      tableApiValues[i].return_Due_On = moment(
        tableApiValues[i].return_Due_On
      ).format("DD-MM-YYYY");
    }
    if (tableApiValues[i].expiry_Date) {
      tableApiValues[i].expiry_Date = moment(
        tableApiValues[i].expiry_Date
      ).format("DD-MM-YYYY hh:mm:ss");
    }
    if (tableApiValues[i].issue_Date) {
      tableApiValues[i].issue_Date = moment(
        tableApiValues[i].issue_Date
      ).format("DD-MM-YYYY");
    }
  }
  const generateData = () => {
    return tableApiValues.map((one, i) => {
      return {
        ...makePerson(one),
      };
    });
  };

  return generateData();
}
