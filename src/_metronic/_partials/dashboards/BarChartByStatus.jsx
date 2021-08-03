import React, { useState, useEffect, useContext } from "react";
// import { HorizontalBar } from "react-chartjs-2";
import styled from "styled-components";
import { FormTitle } from "../../layout/components/custom/FormTitle";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";

// import React from "react";
import Chart from "react-apexcharts";

const ChartStyles = styled(Chart)`
  width: 500px;
  /* height: 425px; */
`;

const ChartWrapper = styled.div`
  /* width: 400px;
  height: 470px; */
  /* margin: 0 15px 50px 0; */
  height: 425px;
  background: #fff;
  box-shadow: 0 0 7px 0 rgba(82, 63, 105, 0.15) !important;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  grid-area: bar;
`;

const BarChartWrapper = styled.div`
  width: 100%;
  /* height: 100%; */
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function BarChart() {
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [barData, setBarData] = useState({
    labels: [],
    data: [],
  });

  const [randomColors, setRandomColors] = useState([]);
  const [statusNames, setStatusNames] = useState();

  // console.log(randomColors);

  useEffect(() => {
    let colors = [];

    if (barData.data) {
      barData.data.forEach((one) => {
        colors.push(getRandomColor());
      });
    }

    colors.push(getRandomColor());

    setRandomColors(colors);
    // console.log(colors);
  }, [barData.data]);

  // console.log(barData);

  useEffect(() => {
    const labels = [];
    const data = [];
    fetch(
      `${server_path}api/AssetDetail/GetAssetCountByAssetStatus?statusName=Assetstatus`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        // console.log(obj3);
        const setArr = res.map((one) => {
          return one.Status_Name;
        });

        setStatusNames([...new Set(setArr)]);
        // setStatusNames([
        //   ...new Set(
        //     res.map((one) => {
        //       return one.Status_Name;
        //     })
        //   ),
        // ]);

        const reducer = (a, c) => {
          const item = a.find((x) => x.Category_Name === c.Category_Name);
          const status = c["Status_Name"].replace(" ", "_");

          let obj3 = {};

          res.forEach((one) => {
            one.Status_Name = one.Status_Name.replace(" ", "_");
            obj3[one.Status_Name] = 0;
          });

          // console.log(obj3);

          // console.log(obj3);
          // });
          // console.log(status);
          if (item) {
            // item.Total += c.Count;
            item.status[status] += c.AssetStatusCount;
          } else {
            // console.log(obj3);
            const newItem = {
              Category_Name: c.Category_Name,
              // Total: c.Count,
              status: obj3,
              // status: {
              //   Available: 0,
              //   Requested: 0,
              //   Pending: 0,
              //   Disposed: 0,
              //   Fixing: 0,
              //   In_Use: 0,
              //   Damaged: 0,
              //   Allocated: 0,
              //   Awaiting_Use: 0,
              //   Awaiting_Approval: 0,
              //   Ready: 0,
              //   Partially_Returned: 0,
              //   Returned: 0,
              //   Reserved: 0,
              //   Missing: 0,
              // },
            };
            newItem.status[status] += c.AssetStatusCount;

            // console.log(newItem);
            a.push(newItem);
          }
          return a;
        };

        const final = res.reduce(reducer, []);

        // console.log(final);

        const ex = [];

        final.map((one) => {
          ex.push(Object.values(one.status));
        });

        // console.log(ex);
        // console.log(ex);

        // const output = [];
        if (ex[0]) {
          for (let i = 0; i < ex[0].length; i++) {
            data.push(ex.flatMap((item) => item[i]));
          }
        }

        // console.log(final.map((one) => Object.values(one.status)));

        // var holder = {};
        // var holder2 = {};

        var obj2 = [];

        for (var i in final) {
          obj2.push({ Category_Name: final[i].Category_Name });
        }

        for (let i in obj2) {
          labels.push(obj2[i].Category_Name);
        }
        setBarData({
          ...barData,
          labels: labels,
          data: data,
        });
      });
  }, [server_path, token]);

  function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // console.log(barData);
  // const statusNames = [
  //   "Available",
  //   "Requested",
  //   "Pending",
  //   "Disposed",
  //   "Fixing",
  //   "In Use",
  //   "Damaged",
  //   "Allocated",
  //   "Awaiting Use",
  //   "Awaiting Approval",
  //   "Ready",
  //   "Partially Returned",
  //   "Returned",
  //   "Reserved",
  //   "Missing",
  // ];

  // console.log(statusNames, barData.data);

  const BarOptions = {
    series: barData.data.map((one, i) => {
      // console.log(statusNames[i]);
      // console.log(statusNames);
      return {
        name: statusNames[i],
        data: one ? one : [],
        // backgroundColor: [randomColors],
        // borderColor: [randomColors],
        color: randomColors[i],
      };
    }),

    chart: {
      type: "bar",
      height: 350,
      // width: 600,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    // title: {
    //   text: "Fiction Books Sales",
    // },
    xaxis: {
      categories: barData.labels,
      // labels: {
      //   formatter: function(val) {
      //     return val + "K";
      //   }
      // }
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
  };
  return (
    <ChartWrapper>
      <FormTitle style={{ marginBottom: "20px", textAlign: "center" }}>
        Asset Counts by Status and Category
      </FormTitle>

      <BarChartWrapper>
        <ChartStyles
          options={BarOptions}
          series={BarOptions.series}
          type="bar"
        />
      </BarChartWrapper>
    </ChartWrapper>
  );
}
