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
  const generateData = () => {
    return tableApiValues.map((one, i) => {
      return {
        ...makePerson(one),
      };
    });
  };

  return generateData();
}
