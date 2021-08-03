import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import styled from "styled-components";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import { NoIssueTableText } from "../../Requested/RequestedIndex_Styles";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";

const LoadingStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;

  div {
    margin-top: 7px;
  }
`;

const PurchasedContainer = styled.div`
  padding: 10px;
  background: #f8f8f8;
  box-shadow: 0 0 4px 0 #f3d2d2;
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function PurchasedIndex({ id }) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [showErrTable, setShowErrTable] = useState(false);

  const [purchaseApiValues, setPurchaseApiValues] = useState([]);
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });

  useEffect(() => {
    fetch(`${server_path}api/AssetView/GetPurchaseList?AssetDetail_ID=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setShowErrTable(true);
          setLoading({ finish: true, success: false });
          setPurchaseApiValues(data);
          return;
        }
        setPurchaseApiValues(data);
        setShowErrTable(false);
        setLoading({ finish: true, success: false });
      })
      .catch((err) => {
        setShowErrTable(true);
        setLoading({ finish: true, success: false });
      });
  }, [server_path, token, id]);

  return (
    <React.Fragment>
      <CssBaseline />
      {!loading.finish ? (
        <LoadingStyle>
          <CircularProgress />
          <div>Loading ..</div>
        </LoadingStyle>
      ) : loading.success ? (
        <Container maxWidth="lg">
          <PurchasedContainer>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Supplier</TableCell>
                    <TableCell align="center">Purchase Date</TableCell>
                    <TableCell align="center">Purchase Quantity</TableCell>
                    <TableCell align="center">Purchase Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseApiValues.map((row) => (
                    <TableRow key={row.supplier}>
                      <TableCell align="center">{row.supplier}</TableCell>
                      <TableCell align="center">
                        {moment(row.purchase_Date).format(
                          "DD-MM-YYYY hh:mm:ss"
                        )}
                      </TableCell>
                      <TableCell align="center">{row.purchase_Qty}</TableCell>
                      <TableCell align="center">{row.purchase_Cost}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </PurchasedContainer>
        </Container>
      ) : (
        <NoIssueTableText>
          Seems like there is no data for this table
        </NoIssueTableText>
      )}
    </React.Fragment>
  );
}
