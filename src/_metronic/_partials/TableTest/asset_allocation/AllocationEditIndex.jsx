import React, { useState, useEffect, useContext } from "react";
import { EditButton } from "../../../layout/components/custom/css/ListTableIndex_Styles";
import Tooltip from "@material-ui/core/Tooltip";
import CreateIcon from "@material-ui/icons/Create";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IssueToEdit from "./IssueToEdit";
import moment from "moment";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import DetailDialog from "./DetailDialog";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { useSubheader } from "../../../layout";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { TokenContext } from "../../../../app/BasePage";
import { appsetting } from "../../../../envirment/appsetting";

const DetailStyles = styled(IconButton)`
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

const TableBodyRow = styled(TableRow)`
  .actions {
    min-width: 80px;
  }

  .location {
    min-width: 120px;
    max-width: 150px;
  }

  .issue-to {
    min-width: 120px;
    max-width: 150px;
  }

  .tag-prefix {
    min-width: 90px;
  }

  .tag-no {
    min-width: 90px;
  }

  .issue-qty {
    min-width: 90px;
  }

  .issue-date {
    min-width: 150px;
  }

  .return-date {
    min-width: 150px;
  }

  @media (max-width: 600px) {
    .issue-qty {
      min-width: 50px;
      max-width: 70px;
    }
  }
`;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const FinalSubmitBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

export default function IssueToGrid(props) {
  const history = useHistory();

  const suhbeader = useSubheader();
  suhbeader.setTitle("Issued Item for Allocation");
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const [editClicked, setEditClicked] = useState(false);

  const selectedRow = props.location.state?.selectedRow;

  // console.log(props);
  const classes = useStyles();
  const [EditId, setEditId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState();

  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    Id: null,
  });

  const [request_ID, setRequest_ID] = useState();
  const [issue_ID, setIssue_ID] = useState();
  const [issues, setIssues] = useState();
  const [assetDetails, setAssetDetails] = useState([]);
  const [newChanges, setNewChanges] = useState([]);

  // console.log(newChanges);

  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });
  const [changed, setChanged] = useState(false);
  const [oriData, setOriData] = useState([
    {
      id: 0,
      asset_Location: "",
      issue_To: "",
      tag_Prefix: "",
      tag_No: "",
      issue_Qty: 0,
      issue_Date: "",
      return_Date: "",
      issue_Item_ID: 0,
    },
  ]);

  const otherIssues = oriData.map((one) => one.issue_Qty);

  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

  const EditRow = oriData.find((data) => data.issue_Item_ID === EditId);

  // get api values for table edit

  useEffect(() => {
    if (issue_ID && request_ID) {
      // console.log(issue_ID, request_ID);
      const urls = [
        `${server_path}api/Allocation/GetIssueItem?issueID=${issue_ID}`,
        `${server_path}api/AssetLocation/GetAssetLocationByRequestID?RequestID=${request_ID}`,
        `${server_path}api/Allocation/GetAllocationEmployeeList?Request_ID=${request_ID}`,
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
          // console.log(arr);
          let data = [...arr[0]];

          for (let i in data) {
            const locationName = arr[1].find((one) => {
              return data[i].assetLocation_ID === one.assetLocation_ID;
            });

            if (locationName) {
              data[i].asset_Location = locationName.asset_Location;
            }

            const employeeName = arr[2].find((one) => {
              return data[i].employee_ID === one.employee_ID;
            });

            if (employeeName) {
              data[i].issue_To = employeeName.employee_Name;
            }

            data[i].issue_Date = moment(data[i].issue_Date)
              .format("DD-MM-YYYY hh:mm:ss")
              .replace(/T/gi, " ");

            data[i].return_Date = moment(data[i].return_Date)
              .format("DD-MM-YYYY hh:mm:ss")
              .replace(/T/gi, " ");
          }

          setOriData(data);
          setAssetDetails(data);
        });
    }
  }, [server_path, token, issue_ID, changed, request_ID]);

  // redirect to main allocation page if user refresh the page

  useEffect(() => {
    if (!props.location.state) {
      return history.replace("/assets/asset-allocation");
    }

    setIssue_ID(props.location.state.issue_ID);
    setIssues(props.location.state.issues);
    setRequest_ID(props.location.state.request_ID);
  }, [request_ID, history, props.location]);

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  function submitFormData(e) {
    e.preventDefault();

    // console.log(selectedRow);

    const postData = [...oriData];

    const atLeastOne = postData.some((d) => {
      return d.asset_Location;
    });

    if (!atLeastOne) {
      setOpenSnack({
        ...openSnack,
        openSnackOpen: true,
        message: "Please fill at least one row",
        title: "error",
      });

      return;
    }

    // console.log(postData);

    postData.forEach((d) => {
      d.issue_Date = d.issue_Date.replace(/-/gi, "/");
      d.return_Date = d.return_Date.replace(/-/gi, "/");
      d.tag_No = d.tag_No.toString();

      if (!d.location_ID) {
        d.location_ID = d.assetLocation_ID;
      }

      delete d.asset_Detail_ID;
      delete d.asset_ID;
      delete d.assetLocation_ID;
      delete d.asset_Location;
      delete d.asset_Tag;
      delete d.isCategoryGenerate_Code;
      delete d.issue_ID;
      delete d.issue_To;
      delete d.request_ID;
    });

    const postFinal = {
      details: postData,
    };

    // console.log(assetDetails, newChanges);

    const same = newChanges
      .sort((a, b) => (a.time > b.time ? -1 : b.time > a.time ? 1 : 0))
      .filter(
        (thing, index, self) =>
          self.findIndex((t) => t.issue_ID === thing.issue_ID) === index
      )
      .sort((a, b) =>
        a.issue_ID > b.issue_ID ? 1 : b.issue_ID > a.issue_ID ? -1 : 0
      );

    same.forEach((one) => {
      delete one.time;
      // delete one.supplier;
    });

    // console.log(same);

    // console.log(assetDetails);

    const result = assetDetails
      .filter((o) => same.some(({ issue_ID }) => o.issue_ID === issue_ID))
      .map((one, index) => {
        const existingKeys = Object.keys(same[index]).filter((key) =>
          one.hasOwnProperty(key)
        );
        let newObj = existingKeys.reduce((acc, curr) => {
          acc[curr] = one[curr];
          return acc;
        }, {});
        return newObj;
      });

    // console.log(result, same);

    const final = result.map((one, index) => {
      const existingKeys = Object.keys(same[index]).filter((key) =>
        one.hasOwnProperty(key)
      );
      let newObj = existingKeys.reduce((acc, curr) => {
        // console.log(curr);
        if (curr === "issue_ID") {
          acc[curr] = one[curr];
        } else {
          // console.log(same[index][curr]);
          if (same[index][curr] === "") {
            // console.log(same[index]);
            acc[curr] = "";
          } else {
            acc[curr] = `${one[curr]} to ${same[index][curr]}`;
          }
        }
        return acc;
      }, {});
      return newObj;
    });

    // console.log(final);

    for (let i in final) {
      delete final[i].issue_ID;

      final[i].asset_Location = final[i].assetLocation_ID;

      delete final[i].assetLocation_ID;
    }

    console.log(final);

    // console.log(arr, newChanges.asset_Details);

    // for (let i in result) {
    //   for (let j in newChanges.asset_Details) {

    //   }
    // }

    // console.log(result, newChanges.asset_Details);

    // var keys = {};
    // for (var i in selectedRow2) {
    //   for (var j in newChanges) {
    //     if (j === i) {
    //       newChanges[j] = `${selectedRow2[i]} to ${newChanges[j]}`;
    //     }
    //   }
    // }

    // console.log(final);

    fetch(`${server_path}api/Allocation/UpdateAllocation`, {
      method: "POST",
      body: JSON.stringify(postFinal),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          let auditObj = {
            action_By: parseInt(empID),
            event: "Edit",
            asset_Detail_ID: "0",
            asset_Location_ID: 0,
            asset_ID: selectedRow.asset_ID,
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            assetObject: [],
            categoryObjects: null,
            brandObject: null,
            supplierObject: null,
            typeObject: null,
            statusObject: null,
            locationObject: null,
            allocationObject: final,
            description: "",
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
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            message: "Update successfully",
            title: "saved",
          });
        } else {
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            message: "Something went wrong, please try again",
            title: "error",
          });
        }
        setChanged((prev) => !prev);
      })
      .catch((err) => {
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "Something went wrong, please try again",
          title: "error",
        });

        setChanged((prev) => !prev);
      });
  }

  function handleEditChange(id, changes) {
    const newValues = [...oriData];

    const index = newValues.findIndex((value) => value.issue_Item_ID === id);

    newValues[index] = changes;

    setOriData(newValues);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center">Asset Location</TableCell>
              <TableCell align="center">Issue To</TableCell>
              <TableCell align="center">Tag Prefix</TableCell>
              <TableCell align="center">Tag No</TableCell>
              <TableCell align="center">Issue Qty</TableCell>
              <TableCell align="center">Issue Date</TableCell>
              <TableCell align="center">Return Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {oriData.map((row, i) => {
              return row.issue_Item_ID === EditId ? (
                <IssueToEdit
                  key={row.issue_Item_ID}
                  EditRow={EditRow}
                  handleEditChange={handleEditChange}
                  EditId={EditId}
                  setEditId={setEditId}
                  request_ID={request_ID}
                  openSnack={openSnack}
                  setOpenSnack={setOpenSnack}
                  issues={issues}
                  otherIssues={otherIssues}
                  selectedIndex={selectedIndex}
                  dialogOpen={dialogOpen}
                  setDialogOpen={setDialogOpen}
                  newChanges={newChanges}
                  setNewChanges={setNewChanges}
                  editClicked={editClicked}
                  setEditClicked={setEditClicked}
                />
              ) : (
                <TableBodyRow key={row.issue_Item_ID}>
                  <TableCell align="center" className="actions">
                    <span
                      style={{
                        cursor: "pointer",
                        color: "grey",
                        textDecoration: "underline",
                      }}
                      onClick={(e) => {
                        setEditClicked(true);
                        setSelectedIndex(i);
                        setEditId(row.issue_Item_ID);
                      }}
                    >
                      <Tooltip title="Edit Row">
                        <EditButton aria-label="Edit">
                          <CreateIcon fontSize="small" />
                        </EditButton>
                      </Tooltip>
                    </span>
                  </TableCell>
                  <TableCell align="center" className="actions">
                    <span
                      style={{
                        cursor: "pointer",
                        color: "grey",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        setDialogOpen({
                          ...dialogOpen,
                          open: true,
                          Id: row.asset_Detail_ID,
                        });
                      }}
                    >
                      <Tooltip title="View Detail">
                        <DetailStyles>
                          <InfoIcon fontSize="small" />
                        </DetailStyles>
                      </Tooltip>
                    </span>
                  </TableCell>
                  <TableCell align="center" className="location">
                    {row.asset_Location}
                  </TableCell>
                  <TableCell align="center" className="issue-to">
                    {row.issue_To}
                  </TableCell>
                  <TableCell align="center" className="tag-prefix">
                    {row.tag_Prefix}
                  </TableCell>
                  <TableCell align="center" className="tag-no">
                    {row.tag_No}
                  </TableCell>
                  <TableCell align="center" className="issue-qty">
                    {row.issue_Qty}
                  </TableCell>
                  <TableCell align="center" className="issue-date">
                    {row.issue_Date}
                  </TableCell>
                  <TableCell align="center" className="return-date">
                    {row.return_Date}
                  </TableCell>
                </TableBodyRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {editClicked ? (
        <></>
      ) : (
        <FinalSubmitBtn>
          {" "}
          <Button
            variant="contained"
            color="primary"
            onClick={submitFormData}
            style={{ width: "30%", color: "#fff", height: "35px" }}
          >
            Update
          </Button>
        </FinalSubmitBtn>
      )}

      {dialogOpen.open && (
        <DetailDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        ></DetailDialog>
      )}
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackOpen}
        onClose={handleCloseSnack}
        key={vertical + horizontal}
      >
        <SnackbarContent
          aria-describedby="message-id2"
          style={{
            background: `${title === "saved" ? "#4caf50" : "#ff9100"}`,
          }}
          message={
            <span id="message-id2">
              <div>{message}</div>
            </span>
          }
        />
      </Snackbar>
    </>
  );
}
