import React, { useState, useEffect, useContext } from "react";
// import objectPath from "object-path";
// import {useHtmlClassService} from "../../layout";
// import {Demo1Dashboard} from "./Demo1Dashboard";
// import {Demo2Dashboard} from "./Demo2Dashboard";
// import {Demo3Dashboard} from "./Demo3Dashboard";
// import {Demo4Dashboard} from "./Demo4Dashboard";
// import {Demo5Dashboard} from "./Demo5Dashboard";
// import {Demo6Dashboard} from "./Demo6Dashboard";
// import {Demo7Dashboard} from "./Demo7Dashboard";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import DoughnatChart from "./DoughnatChart";
// import BarChart from "./BarChartByCategory";
import BarChartByStatus from "./BarChartByStatus";
import AssetConditionChart from "./AssetConditionChart";
import styled from "styled-components";
import moment from "moment";
// import {appsetting} from "../../../envirment/appsetting"

const Charts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 425px;
  grid-template-areas:
    "doughnat doughnat bar bar"
    "hdoughnat hdoughnat . .";
  column-gap: 20px;
  row-gap: 20px;
  width: 100%;
  height: auto;
  /* min-height: 1000px; */
  justify-content: space-around;
  margin-bottom: 20px;

  @media (max-width: 1400px) {
    grid-template-areas:
      "doughnat doughnat hdoughnat hdoughnat"
      "bar bar bar bar";
  }

  @media (max-width: 1024px) {
    grid-template-areas:
      "doughnat doughnat doughnat doughnat"
      "hdoughnat hdoughnat hdoughnat hdoughnat"
      "bar bar bar bar";
  }
`;

// const AssetChart = styled.div``;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.57)",
    fontSize: "14px",
  },
  body: {
    fontSize: 12,
    // lineHeight: 0.2,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  root: {
    width: "100%",
    maxWidth: 500,
  },
  TableContainer: {
    minHeight: 300,
    boxShadow: "0 0px 4px 0px rgba(82,63,105,0.15)",
    background: "white",
    paddingBottom: "30px",
  },
  table: {
    minWidth: 700,
  },
  Tcontainer: {
    border: "1px solid #e3e8e6",
    maxHeight: 280,
  },
  title: {
    padding: 15,
    color: "rgba(0, 0, 0, 0.57)",
    paddingLeft: 0,
    fontSize: 16,
  },
});

export function Dashboard(props) {
  const classes = useStyles();

  // console.log(props);
  // const {server_path} = appsetting;

  const [connection, setConnection] = useState();
  const [Added, setAdded] = useState(false);

  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const [ApiValues, setApiValues] = useState([
    {
      Asset_ID: 0,
      Asset_Name: "",
      Total_Asset: 0,
      Warranty_Expiried: 0,
      Warranty_Expiring: 0,
    },
  ]);

  useEffect(() => {
    if (props.location.state) {
      let auditObj = {
        action_By: parseInt(empID),
        event: "View",
        asset_Detail_ID: "0",
        asset_Location_ID: 0,
        asset_ID: 0,
        activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
        assetObject: [],
        categoryObjects: null,
        brandObject: null,
        supplierObject: null,
        typeObject: null,
        statusObject: null,
        locationObject: null,
        allocationObject: [],
        description: "Dashboard page",
        requestObject: null,
      };

      fetch(`${server_path}api/AuditTrial`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auditObj),
      });
    }
  }, [empID, server_path, token, props.location.state]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${server_path}notificationhub`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          console.log("Connected!");
          setAdded(true);

          connection.on("notiasset", (val) => {
            setApiValues(JSON.parse(val));
            // console.log(JSON.parse(val));
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection, server_path]);

  useEffect(() => {
    fetch(`${server_path}api/RealTime/AssetNoti`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [server_path, token, Added]);

  return (
    <>
      {/* {layoutProps.demo === 'demo1' && <Demo1Dashboard />}
        {layoutProps.demo === 'demo2' && <Demo2Dashboard />}
        {layoutProps.demo === 'demo3' && <Demo3Dashboard />}
        {layoutProps.demo === 'demo4' && <Demo4Dashboard />}
        {layoutProps.demo === 'demo5' && <Demo5Dashboard />}
        {layoutProps.demo === 'demo6' && <Demo6Dashboard />}
        {layoutProps.demo === 'demo7' && <Demo7Dashboard />} */}
      <Charts>
        <DoughnatChart></DoughnatChart>
        <BarChartByStatus></BarChartByStatus>
        <AssetConditionChart></AssetConditionChart>
      </Charts>

      <React.Fragment>
        <CssBaseline />
        <Container fixed>
          <Container maxWidth="md" className={classes.TableContainer}>
            <Typography
              variant="h5"
              component="h5"
              gutterBottom
              className={classes.title}
            >
              ASSETS AND WARRANTY WARNING SUMMARY
            </Typography>
            <TableContainer className={classes.Tcontainer}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      style={{
                        borderRight: "1px solid #e3e8e6",
                      }}
                    >
                      Asset Name
                    </StyledTableCell>
                    <StyledTableCell
                      align="left"
                      style={{
                        borderRight: "1px solid #e3e8e6",
                        width: "20%",
                      }}
                    >
                      Total Asset
                    </StyledTableCell>
                    <StyledTableCell
                      align="left"
                      style={{
                        borderRight: "1px solid #e3e8e6",
                        width: "20%",
                      }}
                    >
                      Warranty Warning
                    </StyledTableCell>
                    <StyledTableCell
                      align="left"
                      style={{
                        width: "20%",
                      }}
                    >
                      Warranty Expired
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ApiValues.map((row) => (
                    <StyledTableRow key={row.Asset_Name}>
                      <StyledTableCell
                        align="center"
                        style={{
                          borderRight: "1px solid #e3e8e6",
                        }}
                      >
                        {row.Asset_Name}
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          borderRight: "1px solid #e3e8e6",
                        }}
                      >
                        {row.Total_Asset}
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          borderRight: "1px solid #e3e8e6",
                        }}
                      >
                        {row.Warranty_Expiring}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {row.Warranty_Expiried}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </Container>
      </React.Fragment>
    </>
  );
}
