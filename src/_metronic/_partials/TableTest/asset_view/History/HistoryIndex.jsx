import React, { useState, useEffect, useContext } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
// import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import styled from "styled-components";
// import moment from "moment";
import TablePagination from "@material-ui/core/TablePagination";
import { TokenContext } from "../../../../../app/BasePage";
import { appsetting } from "../../../../../envirment/appsetting";
import Tooltip from "@material-ui/core/Tooltip";
import { NoIssueTableText } from "../../../Requested/RequestedIndex_Styles";
import ShowSignature from "./ShowSignature";
import CircularProgress from "@material-ui/core/CircularProgress";
import SlideshowIcon from "@material-ui/icons/Slideshow";
import IconButton from "@material-ui/core/IconButton";

const ViewImage = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgba(54, 153, 255, 0.5) !important;
  transition: all 300ms;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: rgba(54, 153, 255, 0.8) !important;
  }
`;

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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: "hidden",
  },
  headerText: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.57)",
  },
});

const HistoryContainer = styled.div`
  padding: 10px;
  background: #f8f8f8;
  box-shadow: 0 0 4px 0 #f3d2d2;
`;

const SignImage = styled.img`
  max-width: 100px;
  max-height: 44px;
  cursor: pointer;
  transition: transform 300ms ease 0s;
  &:hover {
    transform: scale(2);
  }
`;

const ErrorImage = styled.img`
  display: none;
`;

export default function HistoryIndex({ id }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [historyApiValues, setHistoryApiValues] = useState([]);
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  // const [showErrTable, setShowErrTable] = useState(false);
  const [openPreviewImg, setOpenPreviewImg] = useState(false);
  const [previewImg, setPreviewImg] = useState();
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });

  // const [selectedId, setSelectedId] = useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    // console.log("calling asset list api !");

    const urls = [
      `${server_path}api/AssetView/GetAssetViewHistoryModels?AssetDetail_ID=${id}`,
      `${server_path}api/AssetView/GetSignature?Asset_Detail_ID=${id}`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(requests)
      .then((res) => Promise.all(res.map((req) => req.json())))
      .then((arr) => {
        setHistoryApiValues(arr[0]);
        setPreviewImg(arr[1][0]);
        setLoading({ finish: true, success: true });

        // console.log("finish calling asset list api !");

        // endTime = new Date().getTime();

        // const timeStamp = endTime - startTime;

        // console.log(timeStamp);
      })
      .catch((err) => {
        // setLoading(false);

        setLoading({ finish: true, success: false });
      });
  }, [server_path, token]);

  console.log(previewImg);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        {!loading.finish ? (
          <LoadingStyle>
            <CircularProgress />
            <div>Loading ..</div>
          </LoadingStyle>
        ) : loading.success ? (
          <HistoryContainer>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" className={classes.headerText}>
                      Date & Time
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Event
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Action By
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Description
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Note
                    </TableCell>
                    <TableCell align="center" className={classes.headerText}>
                      Signature
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyApiValues
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.activity_ID}>
                        <TableCell align="center">
                          {row.activity_Date}
                        </TableCell>
                        <TableCell align="center">{row.event}</TableCell>
                        <TableCell align="center">{row.action_Name}</TableCell>
                        <TableCell align="center">
                          {row.description.length > 35 ? (
                            <Tooltip
                              title={
                                <p style={{ fontSize: 10 }}>
                                  {row.description}
                                </p>
                              }
                            >
                              <span
                                style={{
                                  fontWeight: "normal",
                                  cursor: "pointer",
                                }}
                              >
                                {row.description?.substr(0, 35) + "..."}
                              </span>
                            </Tooltip>
                          ) : null}
                        </TableCell>
                        <TableCell align="center">{row.action_By}</TableCell>
                        <TableCell align="center">
                          {/* <span
                              style={{
                                cursor: "pointer",
                                color: "#353535",
                                textDecoration: "underline",
                                marginRight: "10px",
                              }}
                              onClick={(e) => {
                                setOpenPreviewImg(true);
                              }}
                            >
                              <Tooltip title="View Signature">
                                <ViewImage aria-label="View">
                                  <SlideshowIcon fontSize="small" />
                                </ViewImage>
                              </Tooltip>
                            </span> */}
                          {previewImg?.base64String.length > 500 &&
                          previewImg?.base64String ? (
                            <SignImage
                              src={`${previewImg?.base64String}`}
                              onClick={(e) => {
                                setOpenPreviewImg(true);
                                // setPreviewImg(row.base64String);
                              }}
                            />
                          ) : (
                            <ErrorImage src="https://i.imgur.com/s6qHduv.jpeg" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </HistoryContainer>
        ) : (
          <NoIssueTableText>
            Seems like there is no data for this table
          </NoIssueTableText>
        )}
      </Container>
      {loading.success && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={historyApiValues.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      {openPreviewImg && (
        <ShowSignature
          openPreviewImg={openPreviewImg}
          setOpenPreviewImg={setOpenPreviewImg}
          previewImg={previewImg}
          server_path={server_path}
          onClose={() => setOpenPreviewImg(false)}
        ></ShowSignature>
      )}
    </React.Fragment>
  );
}
