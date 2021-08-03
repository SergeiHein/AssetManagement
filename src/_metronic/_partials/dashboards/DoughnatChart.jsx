import React, { useEffect, useState, useContext } from "react";
// import { Doughnut } from "react-chartjs-2";
// import "chartjs-plugin-labels";
import styled from "styled-components";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";

import Chart from "react-apexcharts";
import { FormTitle } from "../../layout/components/custom/FormTitle";

const ChartStyles = styled(Chart)`
  width: 400px;
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
  grid-area: doughnat;
`;

const DoughnatWrapper = styled.div`
  width: 100%;
  /* height: 100%; */
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function DoughnatChart() {
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  // const dRef = useRef(null);

  const [doughnutData, setDoughnutData] = useState({
    data: [],
    labels: [],
  });

  const doughnatOptions = {
    series: doughnutData.data,
    labels: doughnutData.labels,

    dataLabels: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        width: 850,

        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Rubik",
              color: "#dfsda",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: undefined,
              offsetY: 16,
              formatter: function(val) {
                return val;
              },
            },
            total: {
              show: true,
              label: "Total",
              color: "#373d3f",
              formatter: function(w) {
                return w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
              },
            },
          },
        },
      },
    },
    legend: {
      show: true,
      position: "right",
    },
  };

  // const DoughnutData = {
  //   labels: doughnutData.labels,
  //   datasets: [
  //     {
  //       label: "Asset Counts",
  //       data: doughnutData.data,
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.8)",
  //         "rgba(54, 162, 235, 0.8)",
  //         "rgba(255, 206, 86, 0.8)",
  //         "rgba(75, 192, 192, 0.8)",
  //         "rgba(153, 102, 255, 0.8)",
  //         "rgba(255, 159, 64, 0.8)",
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(255, 206, 86, 1)",
  //         "rgba(75, 192, 192, 1)",
  //         "rgba(153, 102, 255, 1)",
  //         "rgba(255, 159, 64, 1)",
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const DoughnutOptions = {
  //   // legend: {
  //   //   display: false,
  //   // },
  //   // cutoutPercentage: 95,
  //   maintainAspectRatio: false,
  //   responsive: true,
  //   legend: {
  //     position: "bottom",
  //     labels: {
  //       // padding: 20,
  //     },
  //     // padding: 20,
  //   },
  //   plugins: [
  //     // {
  //     //   beforeInit: function(chart, options) {
  //     //     chart.legend.afterFit = function() {
  //     //       console.log(this.height);
  //     //       this.height += 100;
  //     //     };
  //     //   },
  //     // },
  //     {
  //       labels: {
  //         render: "percentage",
  //         fontColor: ["black", "white"],
  //       },
  //     },
  //   ],
  //   // plugins: {
  //   //   beforeInit: function(chart, options) {
  //   //     chart.legend.afterFit = function() {
  //   //       this.height = this.height + 100;
  //   //     };
  //   //   },

  //   //   labels: {
  //   //     render: "percentage",
  //   //     fontColor: ["black", "white"],
  //   //   },
  //   // },
  // };

  useEffect(() => {
    const labels = [];
    const data = [];
    fetch(`${server_path}api/AssetDetail/GetAssetCount`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        for (let i in res) {
          data.push(res[i].Total_Asset);
          labels.push(res[i].Category_Name);
        }

        // console.log(data, labels);
        setDoughnutData({
          ...doughnutData,
          data: data,
          labels: labels,
        });
        // setDoughnutLabels(idfc);

        return res;
      });
  }, [server_path, token, doughnutData]);

  // useEffect(() => {
  //   if (dRef) {
  //     setChartWidth(dRef.current.chartInstance.chart.height);
  //   }
  // }, [dRef]);

  // console.log(chartWidth);

  // useEffect(() => {
  //   console.log(doughnutLabels);
  // }, [doughnutLabels]);

  // console.log(doughnutLabels, doughnutData);
  // console.log(doughnutData);
  return (
    <>
      <ChartWrapper>
        <FormTitle style={{ marginBottom: "20px" }}>
          Assets by Category
        </FormTitle>

        <DoughnatWrapper>
          <ChartStyles
            options={doughnatOptions}
            series={doughnatOptions.series}
            type="donut"
          />
        </DoughnatWrapper>
      </ChartWrapper>
    </>
  );
}
