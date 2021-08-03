import moment from "moment";

function makePerson(one) {
  return one;
}

export default function MakeTableData(tableApiValues) {
  for (let i in tableApiValues) {
    if (tableApiValues[i].issue_Date) {
      tableApiValues[i].issue_Date = moment(tableApiValues[i].issue_Date)
        .format("DD-MM-YYYY")
        .split("T")[0];
    }
    if (tableApiValues[i].return_Due_On) {
      tableApiValues[i].return_Due_On = moment(tableApiValues[i].return_Due_On)
        .format("DD-MM-YYYY")
        .split("T")[0];
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
