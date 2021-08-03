import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import moment from "moment";

const DetailContainer = styled.div`
  padding: 10px;
  background: #f8f8f8;
  box-shadow: 0 0 4px 0 #f3d2d2;
`;

const TypeContainer = styled.div``;

const TypeFirstGrid = styled.div`
  padding: 10px;
`;

const TypeSecondGrid = styled.div`
  padding: 10px;
`;

const TypeLeftGrid = styled.div`
  display: flex;
  background: #fff;
`;

const TypeRightGrid = styled.div`
  display: flex;
  background: #fff;
`;

const FormContainer = styled.div``;

const FormFristGird = styled.div`
  padding: 10px;
`;

const FormSecondGird = styled.div`
  padding: 10px;
`;
const FormLeftGrid = styled.div`
  display: flex;

  background: #fff;
`;

const FormRightGrid = styled.div`
  display: flex;

  background: #fff;
`;

const RequestContainer = styled.div``;

const RequestFristGrid = styled.div`
  padding: 10px;
`;

const RequestSecondGrid = styled.div`
  padding: 10px;
`;
const RequestLeftGrid = styled.div`
  display: flex;

  background: #fff;
`;

const RequestRightGrid = styled.div`
  display: flex;

  background: #fff;
`;

const CreateContainer = styled.div``;

const CreateFristGrid = styled.div`
  padding: 10px;
`;

const CreateSecondGrid = styled.div`
  padding: 10px;
`;
const CreateLeftGrid = styled.div`
  display: flex;

  background: #fff;
`;

const CreateRightGrid = styled.div`
  display: flex;

  background: #fff;
`;

const ModifiedContainer = styled.div``;

const ModifiedFirstGrid = styled.div`
  padding: 10px;
`;

const ModifiedSecondGrid = styled.div`
  padding: 10px;
`;
const ModifiedLeftGrid = styled.div`
  display: flex;

  background: #fff;
`;

const ModifiedRightGrid = styled.div`
  display: flex;

  background: #fff;
`;

const useStyles = makeStyles((theme) => ({
  text: {
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "10px",
    width: "40%",
    fontSize: 12,
  },
  subText: {
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "10px",
    width: "60%",
    fontSize: 12,
  },
  Btext: {
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "10px",
    width: "40%",
    fontSize: 12,
  },
  BsubText: {
    border: "1px solid rgba(224, 224, 224, 1)",
    padding: "10px",
    width: "60%",
    fontSize: 12,
  },
}));

export default function DetailTab({ details }) {
  const classes = useStyles();
  const now = moment();

  const Day = `${moment(details.expire_On).format("DD-MM-YYYY hh:mm:ss")}`;

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <DetailContainer>
          <h4>Asset Details</h4>
          <hr></hr>
          <TypeContainer>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TypeFirstGrid>
                  <TypeLeftGrid>
                    <span className={classes.text}>Type</span>
                    <span className={classes.subText}>{details.type}</span>
                  </TypeLeftGrid>{" "}
                  <TypeLeftGrid>
                    <span className={classes.text}>Category</span>
                    <span className={classes.subText}>{details.category}</span>
                  </TypeLeftGrid>{" "}
                </TypeFirstGrid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TypeSecondGrid>
                  <TypeRightGrid>
                    <span className={classes.Btext}>Specification</span>
                    <span className={classes.BsubText}>
                      {details.specification}
                    </span>
                  </TypeRightGrid>
                  <TypeRightGrid>
                    <span className={classes.Btext}>Requestable</span>
                    <span className={classes.BsubText}>
                      {details.is_Requestable === 1 ? "true" : "false"}
                    </span>
                  </TypeRightGrid>
                </TypeSecondGrid>
              </Grid>
            </Grid>
          </TypeContainer>
          <hr></hr>
          <FormContainer>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <FormFristGird>
                  <FormLeftGrid>
                    <span className={classes.text}>Purchase From</span>
                    <span className={classes.subText}>{details.supplier}</span>
                  </FormLeftGrid>{" "}
                </FormFristGird>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormSecondGird>
                  <FormRightGrid>
                    <span className={classes.Btext}>Expire On</span>
                    {now.isAfter(Day) ? (
                      <span className={classes.BsubText}>
                        {moment(details.expire_On).format(
                          "DD-MM-YYYY hh:mm:ss"
                        )}
                      </span>
                    ) : (
                      <span
                        style={{
                          border: "1px solid rgba(224, 224, 224, 1)",
                          padding: "10px",
                          width: "60%",
                          fontSize: 12,
                          color: "#f44336",
                        }}
                      >
                        {moment(details.expire_On).format(
                          "DD-MM-YYYY hh:mm:ss"
                        )}
                      </span>
                    )}
                  </FormRightGrid>
                </FormSecondGird>
              </Grid>
            </Grid>
          </FormContainer>
          <hr></hr>
          <RequestContainer>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <RequestFristGrid>
                  <RequestLeftGrid>
                    <span className={classes.text}>Requests</span>
                    <span className={classes.subText}>{details.requests}</span>
                  </RequestLeftGrid>{" "}
                  <RequestLeftGrid>
                    <span className={classes.text}>Issues</span>
                    <span className={classes.subText}>{details.issues}</span>
                  </RequestLeftGrid>{" "}
                </RequestFristGrid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <RequestSecondGrid>
                  <RequestRightGrid>
                    <span className={classes.Btext}>Returns</span>
                    <span className={classes.BsubText}>{details.returns}</span>
                  </RequestRightGrid>
                  <RequestRightGrid>
                    <span className={classes.Btext}>Available</span>
                    <span className={classes.BsubText}>1</span>
                  </RequestRightGrid>
                </RequestSecondGrid>
              </Grid>
            </Grid>
          </RequestContainer>
          <hr></hr>
          <CreateContainer>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <CreateFristGrid>
                  <CreateLeftGrid>
                    <span className={classes.text}>Date Created</span>
                    <span className={classes.subText}>
                      {moment(details.date_Created).format(
                        "DD-MM-YYYY hh:mm:ss"
                      )}
                    </span>
                  </CreateLeftGrid>{" "}
                </CreateFristGrid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CreateSecondGrid>
                  <CreateRightGrid>
                    <span className={classes.Btext}>Created By</span>
                    <span className={classes.BsubText}>
                      {details.created_By}
                    </span>
                  </CreateRightGrid>
                </CreateSecondGrid>
              </Grid>
            </Grid>
          </CreateContainer>
          <hr></hr>
          <ModifiedContainer>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <ModifiedFirstGrid>
                  <ModifiedLeftGrid>
                    <span className={classes.text}>Date Modified</span>
                    <span className={classes.subText}>
                      {moment(details.date_Modified).format(
                        "DD-MM-YYYY hh:mm:ss"
                      )}
                    </span>
                  </ModifiedLeftGrid>{" "}
                </ModifiedFirstGrid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ModifiedSecondGrid>
                  <ModifiedRightGrid>
                    <span className={classes.Btext}>Modified By</span>
                    <span className={classes.BsubText}>
                      {details.modified_By}
                    </span>
                  </ModifiedRightGrid>
                </ModifiedSecondGrid>
              </Grid>
            </Grid>
          </ModifiedContainer>
        </DetailContainer>
      </Container>
    </React.Fragment>
  );
}
