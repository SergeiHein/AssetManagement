import moment from "moment";

function makePerson(one) {
  return one;
}

export default function MakeTableData(selectedData) {
  const generateData = () => {
    return selectedData.map((one, i) => {
      return {
        ...makePerson(one),
      };
    });
  };

  return generateData();
}
