import React, { useMemo, useState, useEffect, useContext } from "react";
import MakeTableData from "./MakeTableData";
import MakeTable from "../../layout/components/custom/MakeTable";
import RequestForm from "./RequestForm";
import { useSubheader } from "../../layout";
import { appsetting } from "../../../envirment/appsetting";
import CancelDialog from "../../layout/components/custom/CancelDialog";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { Styles, EditButton, CancelButton } from "./RequestableIndex_Styles";
import { TokenContext } from "../../../app/BasePage";
import moment from "moment";

export default function App(props) {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Requestable Assets 1");
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState({
    isDeletable: null,
    dialogOpen: false,
  });
  const [statusApiValues, setStatusApiValues] = useState([]);
  const [selectedID, setSelectedID] = useState();
  const [oriData, setOriData] = useState([]);
  const selectedRow = oriData.find((one) => one.asset_ID === selectedID);

  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    title: "",
    subject: "",
  });

  const { openSnackOpen, vertical, horizontal, title, subject } = openSnack;
  const [requestableApiValues, setRequestableApiValues] = useState([]);
  const [valsChanged, setValsChanged] = useState(false);
  const [loading, setLoading] = useState({
    finish: false,
    success: null,
  });

  // view audit api function

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
        description: "Requestable page",
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
  }, [empID, server_path, props.location.state, token]);

  useEffect(() => {
    setOriData(MakeTableData(requestableApiValues, statusApiValues));
  }, [requestableApiValues, statusApiValues]);

  // get requestable api values

  useEffect(() => {
    const urls = [
      `${server_path}api/Status`,
      `${server_path}api/requestable?empID=${empID}`,
    ];

    const requests = urls.map((one) =>
      fetch(one, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(requests)
      .then((res) => Promise.all(res.map((req) => req.json())))
      .then((arr) => {
        setStatusApiValues(arr[0]);
        setRequestableApiValues(arr[1]);
        setLoading({ finish: true, success: true });
      })
      .catch((err) => setLoading({ finish: true, success: false }));
  }, [server_path, valsChanged, token, empID]);

  function handleEditChange(id, changes) {
    const newValues = [...oriData];

    const index = newValues.findIndex((value) => value.id === id);

    newValues[index] = changes;

    setOriData(newValues);
  }

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  function handleCancelRequest(id, row) {
    let auditObj = {
      action_By: parseInt(empID),
      event: "Cancel",
      asset_Detail_ID: "0",
      asset_Location_ID: 0,
      asset_ID: row.asset_ID,
      activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
      assetObject: [],
      categoryObjects: null,
      brandObject: null,
      supplierObject: null,
      typeObject: null,
      statusObject: null,
      locationObject: null,
      allocationObject: [],
      description: "",
      requestObject: {
        assetName: row.asset_Name,
      },
    };
    fetch(`${server_path}api/Requestable/CancelRequest?requestID=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            title: "An error has occured, please try again",
            subject: "error",
          });

          return;
        }

        return res.text();
      })
      .then((data) => {
        console.log(data);
        if (data.includes("Success Cancel Request")) {
          // console.log(auditObj);
          fetch(`${server_path}api/AuditTrial`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(auditObj),
          });
          setValsChanged((prev) => !prev);
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            title: "Canceled request successfully",
            subject: "success",
          });

          return;
        } else if (
          data.includes(
            "This request is partially issued and cannot be cancelled."
          )
        ) {
          setCancelDialogOpen({
            isDeletable: false,
            dialogOpen: true,
          });
        }
        // setCancelDialogOpen({
        //   isDeletable: false,
        //   dialogOpen: true,
        // });
      })
      .catch((err) => {
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          title: "An error has occured, please try again",
          subject: "error",
        });
      });
  }

  const columnsNames = React.useMemo(
    () => [
      {
        Header: "Actions",
        id: "delete",
        sticky: "left",

        Cell: (tableProps) => {
          return (
            <>
              {tableProps.row.original.status_Name.includes("Available") ? (
                <span
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={(event) => {
                    const id = tableProps.row.original.asset_ID;
                    setSelectedID(id);

                    setDialogOpen(true);
                  }}
                >
                  <EditButton
                    aria-label="edit"
                    style={{ marginRight: "7px", minWidth: "70%" }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    >
                      Request
                    </span>
                  </EditButton>
                </span>
              ) : (
                <span
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={(event) => {
                    handleCancelRequest(
                      tableProps.row.original.request_ID,
                      tableProps.row.original
                    );
                  }}
                >
                  <CancelButton
                    aria-label="edit"
                    style={{
                      marginRight: "7px",
                      minWidth: "70%",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#fff",
                      }}
                    >
                      Cancel
                    </span>
                  </CancelButton>
                </span>
              )}
            </>
          );
        },
      },
      {
        Header: "Asset ID",
        accessor: "asset_ID",
        hidden: true,
      },
      {
        Header: "Asset Name",
        accessor: "asset_Name",
        width: 20,
      },
      {
        Header: "Type",
        accessor: "type_Name",
      },
      {
        Header: "Category",
        accessor: "category_Name",
      },
      {
        Header: "Asset Location",
        accessor: "asset_Location_Name",
      },

      {
        Header: "Available Qty",
        accessor: "available_Qty",
      },
      {
        Header: "Requested Qty",
        accessor: "requestedQty",
      },
      {
        Header: "Status",
        accessor: "status_Name",
      },
      {
        Header: "Requested For",
        accessor: "request_For",
      },
    ],
    []
  );

  const data = useMemo(() => oriData, [oriData]);

  return (
    <Styles>
      {/* Make table */}
      <MakeTable
        columns={columnsNames}
        data={data}
        loading={loading}
        subject="sub"
      ></MakeTable>

      {dialogOpen && (
        <RequestForm
          setDialogOpen={setDialogOpen}
          setValsChanged={setValsChanged}
          valsChanged={valsChanged}
          dialogOpen={dialogOpen}
          handleEditChange={handleEditChange}
          selectedRow={selectedRow}
          setOpenSnack={setOpenSnack}
          openSnack={openSnack}
        ></RequestForm>
      )}

      {cancelDialogOpen.dialogOpen && (
        <CancelDialog
          setCancelDialogOpen={setCancelDialogOpen}
          cancelDialogOpen={cancelDialogOpen}
          unDeletableTitle="This request is partially issued and cannot be cancelled."
        ></CancelDialog>
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
            background: `${subject === "success" ? "#4caf50" : "#f44306"}`,
          }}
          message={
            <span id="message-id2">
              <div>{title}</div>
            </span>
          }
        />
      </Snackbar>
    </Styles>
  );
}
