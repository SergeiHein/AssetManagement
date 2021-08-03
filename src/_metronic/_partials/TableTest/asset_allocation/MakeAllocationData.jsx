function makePerson(val) {
  return val;
}

export default function MakeAllocationData(AllocationApiValues) {
  const generateData = () => {
    return AllocationApiValues.map((val) => {
      return {
        ...makePerson(val),
      };
    });
  };

  return generateData();
}
