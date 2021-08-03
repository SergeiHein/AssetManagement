import React, { useMemo, useState, useEffect, useContext, useRef } from "react";
import MakeTableData from "./MakeTableData";
import MakeTable from "../../layout/components/custom/MakeTable";
import { useSubheader } from "../../layout";
import { appsetting } from "../../../envirment/appsetting";
import CancelDialog from "../../layout/components/custom/CancelDialog";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { Link } from "react-router-dom";
import GroupDialog from "./GroupDialog";
import { TokenContext } from "../../../app/BasePage";
import IconButton from "@material-ui/core/IconButton";
import { Styles, RequestedImg, EditButton } from "./RequestedIndex_Styles";
import moment from "moment";

export default function App(props) {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Requested List");
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const imgRef = useRef();
  const [Added, setAdded] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState({
    open: false,
    Id: null,
  });
  const [oriData, setOriData] = useState([]);
  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
  });

  const { openSnackOpen, vertical, horizontal } = openSnack;
  const [requestableApiValues, setRequestableApiValues] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState({
    isDeletable: null,
    dialogOpen: false,
  });
  const [loading, setLoading] = useState({
    finish: null,
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
        description: "Requested page",
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
    setOriData(MakeTableData(requestableApiValues, setGroupDialogOpen));
  }, [requestableApiValues]);

  useEffect(() => {
    fetch(`${server_path}api/requested?empID=${empID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setLoading({ finish: true, success: false });
          setRequestableApiValues(data);
          return;
        }
        setRequestableApiValues(data);
        setAdded(true);
        setLoading({ finish: true, success: true });
      })
      .catch((err) => {
        setLoading({ finish: true, success: false });
      });
  }, [server_path, token, Added, empID]);

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  // set column names

  const columnsNames = React.useMemo(
    () => [
      {
        Header: "Actions",
        id: "actions",
        Cell: (tableProps) => {
          return (
            <>
              {tableProps.row.original.requested_Qty ===
                tableProps.row.original.issued_Qty ||
              tableProps.row.original.availableQty === 0 ? (
                <IconButton
                  aria-label="edit"
                  style={{
                    marginRight: "7px",
                    minWidth: "70%",
                    cursor: "not-allowed",
                    background: "rgba(244, 67, 54, 0.25)",
                    padding: "7px",
                    borderRadius: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#fff",
                    }}
                  >
                    Issue
                  </span>
                </IconButton>
              ) : (
                <Link
                  to={{
                    pathname: "requested-list/issued",
                    state: tableProps.row.original.request_ID,
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
                      Issue
                    </span>
                  </EditButton>
                </Link>
              )}
            </>
          );
        },
      },
      {
        Header: "Image",
        id: "image",
        Cell: (tableProps) => {
          return (
            <RequestedImg
              src={`${server_path}Uploads/asset-photos/${tableProps.row.original.asset_ID}.jpg`}
              alt="asset"
              ref={imgRef}
              title={`asset ${tableProps.row.original.asset_ID} image`}
              onError={(e) => {
                if (e.target.src.includes(".jpg")) {
                  e.target.src = `${server_path}Uploads/asset-photos/${tableProps.row.original.asset_ID}.png`;
                  return;
                }
                if (e.target.src.includes(".png")) {
                  e.target.src = `${server_path}Uploads/asset-photos/${tableProps.row.original.asset_ID}.jpeg`;
                  return;
                }
                if (e.target.src.includes(".jpeg")) {
                  e.target.src = `${server_path}Uploads/asset-photos/${tableProps.row.original.asset_ID}.gif`;
                  return;
                } else {
                  if (
                    e.target.src ===
                    `${server_path}Uploads/asset-photos/${tableProps.row.original.asset_ID}.gif`
                  ) {
                    e.target.src = "https://i.imgur.com/s6qHduv.jpeg";
                    e.target.classList.add("error-img");
                  }
                }
              }}
            />
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
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Asset Location",
        accessor: "asset_Location",
      },

      {
        Header: "Available Qty",
        accessor: "availableQty",
      },
      {
        Header: "Requested Qty",
        accessor: "requested_Qty",
      },
      {
        Header: "Issued Qty",
        accessor: "issued_Qty",
      },

      {
        Header: "Request Person",
        accessor: "request_For",
      },
      {
        Header: "Request By",
        accessor: "request_By",
      },

      {
        Header: "Requested Date",
        accessor: "requeste_Date",
      },
      {
        Header: "Expected Return Date",
        accessor: "expected_Return_Date",
      },
    ],
    [server_path]
  );

  function handleTempDelete() {
    setCancelDialogOpen({
      isDeletable: true,
      dialogOpen: false,
    });
  }

  const data = useMemo(() => oriData, [oriData]);

  return (
    <Styles>
      <MakeTable
        columns={columnsNames}
        data={data}
        loading={loading}
        subject="sub"
      ></MakeTable>

      {cancelDialogOpen.dialogOpen && (
        <CancelDialog
          setCancelDialogOpen={setCancelDialogOpen}
          cancelDialogOpen={cancelDialogOpen}
          deletableTitle="Are you sure you wish to cancel this issued asset?"
          unDeletableTitle="This Issue is in progress and could not be deleted."
          callbackFunc={handleTempDelete}
        ></CancelDialog>
      )}
      {groupDialogOpen.open && (
        <GroupDialog
          setGroupDialogOpen={setGroupDialogOpen}
          groupDialogOpen={groupDialogOpen}
          Added={Added}
          setAdded={setAdded}
        ></GroupDialog>
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
            background: "#4caf50",
          }}
          message={
            <span id="message-id2">
              <div>Canceled Issued asset successfully</div>
            </span>
          }
        />
      </Snackbar>
    </Styles>
  );
}
