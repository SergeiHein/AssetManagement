import moment from "moment";
import React, { useState } from "react";
import { appsetting } from "../../../../envirment/appsetting";
// import { RequestedImg } from "../../../layout/components/custom/css/RequestedIndex_Styles";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";

const RequestedImgAsset = styled.img`
  width: 80%;
  object-fit: contain;
  max-height: 44px;
  cursor: pointer;
  transition: transform 300ms;

  /* &.error-img {
    &:hover {
      transform: scale(1);
    }
  } */

  /* &:hover {
    transform: scale(2);
  } */
`;

function makePerson(columnValue, statusApiValues, server_path) {
  if (columnValue.asset_Status) {
    const updated = statusApiValues.find((one) => {
      return one.status_Name === columnValue.asset_Status;
    });

    if (updated) {
      columnValue.chartColor = updated.chartColour_Code;
    }
  }

  return columnValue;
}

export default function MakeTableData(
  columnValues,
  statusApiValues,
  setPreviewImg,
  setOpenPreviewImg
) {
  console.log(columnValues);
  const { server_path } = appsetting;
  for (let i in columnValues) {
    if (columnValues[i].requestable === true) {
      columnValues[i].requestable = "yes";
    }
    if (columnValues[i].requestable === false) {
      columnValues[i].requestable = "no";
    }
    if (columnValues[i].available) {
      if (columnValues[i].asset_Status) {
        columnValues[i].available =
          columnValues[i].asset_Status.toLowerCase() === "available"
            ? "1"
            : "0";
      }
    }
    if (columnValues[i].expiry_Date) {
      columnValues[i].expiry_Date = moment(columnValues[i].expiry_Date)
        .format("DD-MM-YYYY")
        .split("T")[0];
    }

    if (columnValues[i].purchase_Date) {
      columnValues[i].purchase_Date = moment(columnValues[i].purchase_Date)
        .format("DD-MM-YYYY")
        .split("T")[0];
    }
    if (columnValues[i].issue_Date) {
      columnValues[i].issue_Date = moment(columnValues[i].issue_Date)
        .format("DD-MM-YYYY hh:mm:ss A")
        .split("T")[0];
    }
    if (columnValues[i].return_Due_On) {
      columnValues[i].return_Due_On = moment(columnValues[i].return_Due_On)
        .format("DD-MM-YYYY hh:mm:ss A")
        .split("T")[0];
    }
    if (columnValues[i].created_On) {
      columnValues[i].created_On = moment(columnValues[i].created_On)
        .format("DD-MM-YYYY hh:mm:ss A")
        .split("T")[0];
    }

    if (columnValues[i].updated_On) {
      columnValues[i].updated_On = moment(columnValues[i].updated_On)
        .format("DD-MM-YYYY hh:mm:ss A")
        .split("T")[0];
    }

    if (columnValues[i].purchase_Cost) {
      columnValues[i].purchase_Cost = columnValues[
        i
      ].purchase_Cost.toLocaleString("en");
    }

    if (columnValues[i].location) {
      // {urlImg.length < 15
      //   ? urlImg
      //   : urlImg.substring(0, 15).concat(" ..")}
      columnValues[i].location =
        columnValues[i].location.length < 30 ? (
          columnValues[i].location
        ) : (
          <Tooltip title={columnValues[i].location}>
            <span>
              {columnValues[i].location.length < 30
                ? columnValues[i].location
                : columnValues[i].location.substring(0, 30).concat(" ..")}
            </span>
          </Tooltip>
        );
    }

    if (columnValues[i].asset_Tag) {
      columnValues[i].asset_Tag_Name = columnValues[i].asset_Tag;
      columnValues[i].asset_Tag = (
        <Link
          to={{
            pathname: "asset-view",
            state: {
              id: columnValues[i].assetDetail_ID,
              name: columnValues[i].asset_Tag_Name,
            },
          }}
        >
          {columnValues[i].asset_Tag}
        </Link>
      );
    }

    columnValues[i].image = (
      <RequestedImgAsset
        src={`${server_path}Uploads/asset-photos/${
          columnValues[i].asset_ID
        }.jpg?${new Date().getTime()}`}
        alt="asset"
        title={`asset ${columnValues[i].asset_ID} image`}
        onClick={(e) => {
          if (e.target.className.includes("error-img")) {
            setOpenPreviewImg(false);

            return;
          }
          setOpenPreviewImg(true);
          setPreviewImg(columnValues[i].asset_ID);
        }}
        onError={(e) => {
          if (e.target.src.includes(".jpg")) {
            // console.log("changing to png ..");
            e.target.src = `${server_path}Uploads/asset-photos/${
              columnValues[i].asset_ID
            }.png?${new Date().getTime()}`;
            return;
          }
          if (e.target.src.includes(".png")) {
            // console.log("chaning to jpeg ..");
            e.target.src = `${server_path}Uploads/asset-photos/${
              columnValues[i].asset_ID
            }.jpeg?${new Date().getTime()}`;
            return;
          }
          if (e.target.src.includes(".jpeg")) {
            // console.log("changing to gif ..");
            e.target.src = `${server_path}Uploads/asset-photos/${
              columnValues[i].asset_ID
            }.gif?${new Date().getTime()}`;
            return;
          } else {
            if (e.target.src.includes(".gif")) {
              e.target.src = "https://i.imgur.com/s6qHduv.jpeg";
              e.target.classList.add("error-img");
            }
          }
        }}
      />
    );
  }

  const generateData = () => {
    return columnValues.map((columnValue, i) => {
      return {
        ...makePerson(columnValue, statusApiValues, server_path),
      };
    });
  };

  return generateData();
}
