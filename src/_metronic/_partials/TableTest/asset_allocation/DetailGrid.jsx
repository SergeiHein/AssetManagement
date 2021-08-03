import React, { useState, useEffect, useContext, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import { DetailImg } from "../../Requested/RequestedIndex_Styles";
import moment from "moment";

const GridContainer = styled(Grid)`
  width: 80% !important;
  margin: 0 auto !important;
  height: 100%;
  flex: 1;

  .MuiGrid-item:nth-child(even) {
    text-align: end;
  }

  span {
    color: #3699ff;
    font-weight: 500;
  }
`;

const GetFormTitle = styled.div`
  font-weight: 700;
  margin: 0 0px 7px 0;
`;

export default function DetailGrid({ dialogOpen }) {
  const { server_path } = appsetting;
  const imgRef = useRef();

  const { token } = useContext(TokenContext);

  const [DialogApiValues, setDialogApiValues] = useState([]);

  useEffect(() => {
    fetch(
      `${server_path}api/Allocation/GetAssetDetailAllocation?AssetDetail_ID=${dialogOpen.Id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDialogApiValues(data);
      });
  }, [server_path, dialogOpen.Id, token]);

  return (
    <GridContainer container spacing={3}>
      <Grid item xs={6}>
        <GetFormTitle>Image:</GetFormTitle>
        <span>
          <DetailImg
            src={`${server_path}Uploads/asset-photos/${DialogApiValues[0]?.asset_ID}.jpg`}
            alt="asset"
            ref={imgRef}
            title={`asset ${DialogApiValues[0]?.asset_ID} image`}
            onError={(e) => {
              if (e.target.src.includes(".jpg")) {
                e.target.src = `${server_path}Uploads/asset-photos/${DialogApiValues[0]?.asset_ID}.png`;
                return;
              }
              if (e.target.src.includes(".png")) {
                e.target.src = `${server_path}Uploads/asset-photos/${DialogApiValues[0]?.asset_ID}.jpeg`;
                return;
              }
              if (e.target.src.includes(".jpeg")) {
                e.target.src = `${server_path}Uploads/asset-photos/${DialogApiValues[0]?.asset_ID}.gif`;
                return;
              } else {
                if (
                  e.target.src ===
                  `${server_path}Uploads/asset-photos/${DialogApiValues[0]?.asset_ID}.gif`
                ) {
                  e.target.src = "https://i.imgur.com/s6qHduv.jpeg";
                  e.target.classList.add("error-img");
                }
              }
            }}
          />
        </span>
      </Grid>

      <Grid item xs={6}>
        <GetFormTitle>Brand:</GetFormTitle>
        <span>{DialogApiValues[0]?.brand_Name}</span>
      </Grid>

      <Grid item xs={6}>
        <GetFormTitle>Model No:</GetFormTitle>
        <span>{DialogApiValues[0]?.model_No}</span>
      </Grid>

      <Grid item xs={6}>
        <GetFormTitle>Serial No:</GetFormTitle>
        <span>{DialogApiValues[0]?.searial_No}</span>
      </Grid>

      {DialogApiValues[0]?.product_Key && (
        <Grid item xs={6}>
          <GetFormTitle>Product Key:</GetFormTitle>
          <span>{DialogApiValues[0]?.product_Key}</span>
        </Grid>
      )}

      <Grid item xs={6}>
        <GetFormTitle>Asset Status:</GetFormTitle>
        <span>{DialogApiValues[0]?.asset_Status}</span>
      </Grid>
      {DialogApiValues[0]?.ownerBook_Status && (
        <Grid item xs={6}>
          <GetFormTitle>Owner Book Status:</GetFormTitle>
          <span>{DialogApiValues[0]?.ownerBook_Status}</span>
        </Grid>
      )}

      <Grid item xs={6}>
        <GetFormTitle>Asset Condition:</GetFormTitle>
        <span>{DialogApiValues[0]?.assetCondition_Status}</span>
      </Grid>

      <Grid item xs={6}>
        <GetFormTitle>Expiry Date:</GetFormTitle>
        <span>
          {moment(DialogApiValues[0]?.expiry_Date).format(
            "DD/MM/YYYY hh:mm:ss"
          )}
        </span>
      </Grid>
      <Grid item xs={6}>
        <GetFormTitle>Warranty:</GetFormTitle>
        <span>{DialogApiValues[0]?.warranty}</span>
      </Grid>
    </GridContainer>
  );
}
