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
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import styled from "styled-components";
import moment from "moment";
import TablePagination from "@material-ui/core/TablePagination";
import { NoIssueTableText } from "../../Requested/RequestedIndex_Styles";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  headerText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.57)",
  },
});

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

const IssueContainer = styled.div`
  padding: 10px;
  background: #f8f8f8;
  box-shadow: 0 0 4px 0 #f3d2d2;
`;

export default function IssueReturn({ id }) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);

  const [IssueReturnApi, setIssueReturnApi] = useState([]);
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });

  useEffect(() => {
    fetch(
      `${server_path}api/AssetView/GetIssueReturnList?AssetDetail_ID=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setLoading({ finish: true, success: false });
          setIssueReturnApi(data);
          return;
        }
        setIssueReturnApi(data);
        setLoading({ finish: true, success: true });
      })
      .catch((err) => {
        setLoading({ finish: true, success: true });
      });
  }, [server_path, token, id]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
          <IssueContainer>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" className={classes.headerText}>
                      Asset Location
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Assigned To
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Asset Issued
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Asset Returned
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Duration Out
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Issued By
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {IssueReturnApi.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  ).map((row) => (
                    <TableRow key={row.row_ID}>
                      <TableCell align="center">
                        <Tooltip
                          title={
                            <p style={{ fontSize: 10 }}>{row.location_Name}</p>
                          }
                        >
                          <span
                            style={{
                              fontWeight: "normal",
                              cursor: "pointer",
                            }}
                          >
                            {row.location_Name?.substr(0, 35) + "..."}
                          </span>
                        </Tooltip>{" "}
                      </TableCell>
                      <TableCell align="center">{row.assigned_To}</TableCell>
                      <TableCell align="center">
                        {moment(row.asset_Issued).format("DD-MM-YYYY hh:mm a")}
                      </TableCell>
                      <TableCell align="center">
                        {moment(row.asset_Returned).format(
                          "DD-MM-YYYY hh:mm a"
                        )}{" "}
                      </TableCell>
                      <TableCell align="center">{row.duration_Out}</TableCell>
                      <TableCell align="center">{row.issued_Out_By}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>{" "}
          </IssueContainer>
        </Container>
      ) : (
        <NoIssueTableText>
          Seems like there is no data for this table
        </NoIssueTableText>
      )}
      {loading.success && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={IssueReturnApi.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </React.Fragment>
  );
}
