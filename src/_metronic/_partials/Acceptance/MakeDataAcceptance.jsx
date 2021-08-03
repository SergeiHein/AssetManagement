// import { v4 as uuidv4 } from "uuid";
// import moment from "moment";

function makeRow(data) {
  return data;
}

// const range = (len) => {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     arr.push(i);
//   }
//   return arr;
// };

export default function MakeTableAcceptance(issueApiValues) {
  //   console.log(qty);

  // console.log(issueApiValues);
  const generateData = () => {
    return issueApiValues.acceptanceDetails?.map((one) => {
      return {
        ...makeRow(one),
      };
    });
  };

  return generateData;
}
