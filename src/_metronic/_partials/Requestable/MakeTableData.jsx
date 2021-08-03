function makePerson(data, statusApiValues) {
  if (data.status_Name) {
    data.chartColor = statusApiValues.find(
      (one) => one.status_Name === data.status_Name
    ).chartColour_Code;
  }
  return data;
}

export default function MakeTableData(qty, statusApiValues) {
  const generateData = () => {
    return qty.map((data, i) => {
      return {
        ...makePerson(data, statusApiValues),
      };
    });
  };

  return generateData();
}
