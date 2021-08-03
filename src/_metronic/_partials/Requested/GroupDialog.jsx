import React, { useState, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Slide from "@material-ui/core/Slide";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import Paper from "@material-ui/core/Paper";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Label = styled.div``;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles({
  table: {
    width: 600,
  },
  container: {
    maxHeight: 440,
    boxShadow: 0,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography
        variant="h6"
        style={{
          textAlign: "center",
        }}
      >
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

export default function GroupDialog({ groupDialogOpen, setGroupDialogOpen }) {
  console.log(groupDialogOpen);

  const classes = useStyles();

  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);

  const [PopupApiVal, setPopupApiVal] = useState([
    {
      requestID: 0,
      asset_ID: "",
      employee_ID: "",
      employee_Name: "",
      section_Name: "",
      department_Name: "",
      branch_Name: "",
      location_Name: "",
      company_Name: "",
    },
  ]);

  useEffect(() => {
    fetch(`${server_path}api/RequestingPersons?id=${groupDialogOpen.Id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPopupApiVal(data);
      });
  }, [server_path, groupDialogOpen.Id, token]);

  const handleClose = () => {
    setGroupDialogOpen(false);
  };
  return (
    <div>
      <Dialog
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="customized-dialog-title"
        open={groupDialogOpen.open}
        maxWidth="md"
        style={{
          marginTop: "50px",
          overflow: "none",
          minHeight: "600px",
        }}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{
            background: "rgba(153,203,254,1)",
            color: "#fff",
          }}
        >
          Requesting Persons List
        </DialogTitle>
        <DialogContent dividers>
          <React.Fragment>
            <CssBaseline />
            <Container fixed>
              <Label>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <p>Company Name: {PopupApiVal[0].company_Name}</p>
                    <p>Branch : {PopupApiVal[0].branch_Name}</p>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <p
                      style={{
                        textAlign: "end",
                      }}
                    >
                      Location : {PopupApiVal[0].location_Name}
                    </p>
                  </Grid>
                </Grid>
              </Label>
              <TableContainer className={classes.container} component={Paper}>
                <Table
                  stickyHeader
                  className={classes.table}
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Department</TableCell>
                      <TableCell align="center">Section </TableCell>
                      <TableCell align="center">Employee</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {PopupApiVal.map((row) => (
                      <TableRow key={row.requestID}>
                        <TableCell align="center">
                          {row.department_Name}
                        </TableCell>
                        <TableCell align="center">{row.section_Name}</TableCell>
                        <TableCell align="center">
                          {row.employee_Name}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </React.Fragment>
        </DialogContent>
      </Dialog>
    </div>
  );
}
