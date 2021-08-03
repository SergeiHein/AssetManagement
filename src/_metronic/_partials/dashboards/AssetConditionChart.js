import React, { useState, useEffect, useContext } from "react";
// import { Doughnut } from "react-chartjs-2";
// import "chartjs-plugin-labels";
import styled from "styled-components";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import { FormTitle } from "../../layout/components/custom/FormTitle";
import Chart from "react-apexcharts";

const ChartStyles = styled(Chart)`
  width: 400px;
`;

const AssetChartWrapper = styled.div`
  /* width: 400px;
  height: 470px; */
  /* margin: 0 15px 50px 0; */
  /* width: 375px; */
  grid-area: hdoughnat;
  height: 350px;
  background: #fff;
  box-shadow: 0 0 7px 0 rgba(82, 63, 105, 0.15) !important;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  @media (max-width: 1400px) {
    height: 425px;
  }
`;

const DoughnatWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function AssetLocationChart() {
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [AssetData, setAssetData] = useState({
    data: [],
    labels: [],
  });

  const DoughnutOptions = {
    series: AssetData.data,
    labels: AssetData.labels,

    dataLabels: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        // width: 850,
        startAngle: -90,
        endAngle: 90,

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
      position: "top",
    },
  };

  // const AstChartData = {
  //   labels: AssetData.labels,
  //   datasets: [
  //     {
  //       label: "Asset Counts",
  //       data: AssetData.data,
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.8)",
  //         "rgba(54, 162, 235, 0.8)",
  //         "rgba(255, 206, 86, 0.8)",
  //         "rgba(75, 192, 192, 0.8)",
  //         "rgba(153, 102, 255, 0.8)",
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(255, 206, 86, 1)",
  //         "rgba(75, 192, 192, 1)",
  //         "rgba(153, 102, 255, 1)",
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  useEffect(() => {
    const labels = [];
    const data = [];
    fetch(`${server_path}api/AssetDetail/GetAssetCountByCondition`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        for (let i in res) {
          data.push(res[i].assetConditionCount);
          labels.push(res[i].status_Name);
        }

        setAssetData({
          ...AssetData,
          data: data,
          labels: labels,
        });
        return res;
      });
  }, [server_path, token]);

  return (
    <>
      <AssetChartWrapper>
        <FormTitle style={{ marginBottom: "20px" }}>Assets Condition</FormTitle>
        <DoughnatWrapper>
          <ChartStyles
            options={DoughnutOptions}
            series={DoughnutOptions.series}
            type="donut"
          />
        </DoughnatWrapper>
      </AssetChartWrapper>
    </>
  );
}
