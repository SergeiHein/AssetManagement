function makePerson(one) {
  return one;
}

export default function MakeTableData(tableApiValues) {
  const generateData = () => {
    return tableApiValues.map((one, i) => {
      return {
        ...makePerson(one),
      };
    });
  };

  return generateData();
}
