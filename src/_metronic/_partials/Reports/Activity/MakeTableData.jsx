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
    if (tableApiValues[i].activity_Date) {
      // tableApiValues[i].activity_Date = moment(
      //   tableApiValues[i].activity_Date,
      //   "MM/DD/YYYY hh:mm:ss"
      // ).format("DD-MM-YYYY hh:mm:ss");

      tableApiValues[i].activity_Date = moment(
        tableApiValues[i].activity_Date
      ).format("DD-MM-YYYY hh:mm:ss");
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
