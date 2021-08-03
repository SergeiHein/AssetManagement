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
import Tooltip from "@material-ui/core/Tooltip";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import WarrantyEditPopUp from "./WarrantyEditPopUp";
import WarrantyEntryPopUp from "./WarrantyEntryPopUp";
import { appsetting } from "../../../../../envirment/appsetting";
import { TokenContext } from "../../../../../app/BasePage";
import { NoIssueTableText } from "../../../Requested/RequestedIndex_Styles";
import {
  SnackBarSave,
  SnackBarUpdate,
  SnackBarSaveError,
  SnackBarUpdateError,
} from "../../../Settings/SnackBar";
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

const WarrantyContainer = styled.div`
  padding: 10px;
  background: #f8f8f8;
  box-shadow: 0 0 4px 0 #f3d2d2;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const EditButton = styled(IconButton)`
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function WarrantyIndex({ id }) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [WarrantyEdit, setWarrantyEdit] = useState(false);
  const [WarrantyEntry, setWarrantyEntry] = useState(false);
  const [WarrantyApiValues, setWarrantyApiValues] = useState([]);
  const [showErrTable, setShowErrTable] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [Postsuccess, Setpostsuccess] = useState(false);
  const [PostError, setposterror] = useState(false);
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [UpdateError, setUpdateError] = useState(false);
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });

  const EditRow = WarrantyApiValues.find(
    (data) => data.warranty_ID === selectedId
  );

  useEffect(() => {
    fetch(`${server_path}api/AssetView/GetWarrantyList?AssetDetail_ID=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setShowErrTable(true);
          setLoading({ finish: true, success: false });
          setWarrantyApiValues(data);
          return;
        }
        setWarrantyApiValues(data);
        setLoading({ finish: true, success: true });

        setShowErrTable(false);
      })
      .catch((err) => {
        setShowErrTable(true);
        setLoading({ finish: true, success: true });
      });
  }, [server_path, token, id]);

  return (
    <React.Fragment>
      <CssBaseline />

      <Container maxWidth="lg">
        <ButtonArea>
          <Button
            variant="contained"
            color="secondary"
            style={{
              marginBottom: "20px",
            }}
            className={classes.btn}
            onClick={() => {
              setWarrantyEntry({
                open: true,
                id: id,
              });
            }}
          >
            Add new
          </Button>
        </ButtonArea>
        {!loading.finish ? (
          <LoadingStyle>
            <CircularProgress />
            <div>Loading ..</div>
          </LoadingStyle>
        ) : loading.success ? (
          <WarrantyContainer>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Expire On</TableCell>
                    <TableCell align="center">Warranty (months)</TableCell>
                    <TableCell align="center">Notes</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {WarrantyApiValues.map((row) => (
                    <TableRow key={row.warranty_ID}>
                      <TableCell align="center">
                        {moment(row.expiry_On).format("DD-MM-YYYY hh:mm:ss")}
                      </TableCell>
                      <TableCell align="center">{row.warranty}</TableCell>
                      <TableCell align="center">{row.note}</TableCell>
                      <TableCell align="center">
                        {" "}
                        <span
                          style={{
                            cursor: "pointer",
                            color: "grey",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            setWarrantyEdit({
                              open: true,
                              id: id,
                            });
                            setSelectedId(row.warranty_ID);
                          }}
                        >
                          <Tooltip title="Edit Row">
                            <EditButton aria-label="Edit">
                              <CreateIcon fontSize="small" />
                            </EditButton>
                          </Tooltip>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </WarrantyContainer>
        ) : (
          <NoIssueTableText>
            Seems like there is no data for this table
          </NoIssueTableText>
        )}{" "}
        {WarrantyEdit.open && (
          <WarrantyEditPopUp
            setWarrantyEdit={setWarrantyEdit}
            WarrantyEdit={WarrantyEdit}
            selectedId={selectedId}
            setWarrantyApiValues={setWarrantyApiValues}
            WarrantyApiValues={WarrantyApiValues}
            setUpdateSuccess={setUpdateSuccess}
            setUpdateError={setUpdateError}
            EditRow={EditRow}
          ></WarrantyEditPopUp>
        )}
        {WarrantyEntry.open && (
          <WarrantyEntryPopUp
            setWarrantyEntry={setWarrantyEntry}
            WarrantyEntry={WarrantyEntry}
            setWarrantyApiValues={setWarrantyApiValues}
            WarrantyApiValues={WarrantyApiValues}
            Setpostsuccess={Setpostsuccess}
            setposterror={setposterror}
            setShowErrTable={setShowErrTable}
          ></WarrantyEntryPopUp>
        )}
        {Postsuccess ? (
          <SnackBarSave
            Postsuccess={Postsuccess}
            Setpostsuccess={Setpostsuccess}
          ></SnackBarSave>
        ) : (
          ""
        )}
        {PostError ? (
          <SnackBarSaveError
            PostError={PostError}
            setposterror={setposterror}
          ></SnackBarSaveError>
        ) : (
          ""
        )}
        {UpdateSuccess ? (
          <SnackBarUpdate
            UpdateSuccess={UpdateSuccess}
            setUpdateSuccess={setUpdateSuccess}
          ></SnackBarUpdate>
        ) : (
          ""
        )}
        {UpdateError ? (
          <SnackBarUpdateError
            UpdateError={UpdateError}
            setUpdateError={setUpdateError}
          ></SnackBarUpdateError>
        ) : (
          ""
        )}
      </Container>
    </React.Fragment>
  );
}
