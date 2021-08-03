import React, { useState, useMemo, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import { FormTitle } from "../../layout/components/custom/FormTitle";
// import MuiDialogTitle from "@material-ui/core/DialogTitle";
// import MuiDialogContent from "@material-ui/core/DialogContent";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
// import IconButton from "@material-ui/core/IconButton";
// import CloseIcon from "@material-ui/icons/Close";
// import { withStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import MakeDataGroupD from "./MakeDataGroupD";
// import { makeStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Slide from '@material-ui/core/Slide';
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import MakeTable from "../../layout/components/custom/MakeTable";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";

const ContentStyles = styled(DialogContent)`
  @media (max-width: 400px) {
    padding: 20px !important;
  }
`;

// import { appsetting } from "../../../envirment/appsetting";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogStyles = styled(Dialog)`
  .MuiDialog-paper {
    min-width: 60%;

    .MuiDialogContent-root {
      padding: 35px;
    }

    .MuiPaper-root {
      box-shadow: 0 0 7px 0 rgba(82, 63, 105, 0.15) !important;
    }
  }
`;

const GetFormTitle = styled.div`
  font-weight: 700;
  margin: 0 0px 7px 0;
  font-size: 14px;
  /* display: inline-flex; */
`;

const GridContainer = styled(Grid)`
  margin: -12px auto 15px auto !important;
  width: 80%;

  .company-list {
    display: flex;
  }

  .branch-list {
    text-align: end;
    display: flex;
    justify-content: flex-end;
  }

  .location-list {
    display: flex;
  }
  span {
    margin-left: 20px;
  }

  @media (max-width: 600px) {
    width: 80% !important;
    .company-list,
    .branch-list,
    .location-list {
      text-align: center;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .MuiGrid-item {
      /* display: flex;
      justify-content: space-between;
      align-items: center; */
    }
  }

  @media (max-width: 400px) {
    width: 100% !important;
  }
`;

export default function GroupDialog({ openDialog, setOpenDialog }) {
  // console.log(openDialog);

  const [oriData, setOriData] = useState([]);
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });
  const [detailValues, setDetailValues] = useState([]);
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);

  const columns = React.useMemo(
    () => [
      {
        Header: "Department",
        accessor: "department_Name",
        maxWidth: 100,
      },
      {
        Header: "Section",
        accessor: "section_Name",
        maxWidth: 100,
      },
      {
        Header: "Employee",
        accessor: "employee_Name",
        maxWidth: 100,
      },
    ],
    []
  );

  const data = useMemo(() => oriData, [oriData]);

  useEffect(() => {
    setOriData(detailValues);
  }, [detailValues]);

  useEffect(() => {
    if (openDialog.id) {
      fetch(`${server_path}api/RequestingPersons?id=${openDialog.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setDetailValues(data);

          setLoading({
            finish: true,
            success: true,
          });
        })
        .catch((err) =>
          setLoading({
            finish: true,
            success: false,
          })
        );
    }
  }, [server_path, token, openDialog.id]);

  // console.log(detailValues);

  return (
    <DialogStyles
      open={openDialog.open}
      onClose={() => setOpenDialog({ ...openDialog, open: false })}
      TransitionComponent={Transition}
    >
      <FormTitle>Assets Requested List</FormTitle>
      <ContentStyles>
        {/* <React.Fragment> */}
        {/* <CssBaseline /> */}
        <Container>
          <GridContainer container spacing={3}>
            <Grid item xs={12} sm={6}>
              <div className="company-list" style={{}}>
                {" "}
                <GetFormTitle>Company Name: </GetFormTitle>
                <span>{detailValues[0]?.company_Name}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="branch-list">
                {" "}
                <GetFormTitle>Branch: </GetFormTitle>
                <span>{detailValues[0]?.branch_Name}</span>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="location-list">
                <GetFormTitle>Location: </GetFormTitle>
                <span>{detailValues[0]?.location_Name}</span>
              </div>
            </Grid>
          </GridContainer>
        </Container>
        <MakeTable
          columns={columns}
          data={data}
          subject="form-sub"
          loading={loading}
        ></MakeTable>
        {/* </React.Fragment> */}
      </ContentStyles>
    </DialogStyles>
  );
}
