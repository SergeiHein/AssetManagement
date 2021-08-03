import React, { useMemo, useState, useEffect, useContext, useRef } from "react";
import MakeTableData from "./MakeTableData";
import MakeTable from "./MakeTable";
import Tooltip from "@material-ui/core/Tooltip";
import { useSubheader } from "../../../layout";
import { appsetting } from "../../../../envirment/appsetting";
import CreateIcon from "@material-ui/icons/Create";
import CancelDialog from "../../../layout/components/custom/CancelDialog";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import DeleteIcon from "@material-ui/icons/Delete";
import { TokenContext } from "../../../../app/BasePage";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment";
import {
  Styles,
  DeleteButton,
  EditButton,
} from "../../../layout/components/custom/css/ListTableIndex_Styles";
import { Link } from "react-router-dom";
import Preview_model from "./Preview_model";

// import Preview_model from "./Preview_model";

// checkbox function for every row of table

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <Checkbox type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

// Table Index

export default function TableIndex(props) {
  //console.log("testing");
  const suhbeader = useSubheader();
  suhbeader.setTitle("Asset List");
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
  });
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });

  const { openSnackOpen, vertical, horizontal } = openSnack;
  const [headers, setHeaders] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);
  const [columnValues, setColumnValues] = useState([]);
  const [oriData, setOriData] = useState([]);
  const [valsChanged, setValsChanged] = useState(false);
  const [selectedID, setSelectedID] = useState();
  const [statusApiValues, setStatusApiValues] = useState([]);
  const [openPreviewImg, setOpenPreviewImg] = useState(false);
  const [previewImg, setPreviewImg] = useState();
  // const popupRef = useRef(null);
  // const [popupSt, setPopupSt] = useState();

  const selectedRow = oriData.find((row) => row.asset_ID === selectedID);
  // let startTime = new Date().getTime();
  // let endTime;

  const [cancelDialogOpen, setCancelDialogOpen] = useState({
    isDeletable: null,
    dialogOpen: false,
  });

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  // view audit function

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
        description: "Asset list page",
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
  }, []);

  // get values from api for table

  useEffect(() => {
    // console.log("calling asset list api !");

    const urls = [
      `${server_path}api/assetcolumnname`,
      `${server_path}api/assetdetail`,
      `${server_path}api/Status`,
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
        setColumnHeaders(Object.keys(arr[0]));
        setStatusApiValues(arr[2]);
        setColumnValues(arr[1]);
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

  useEffect(() => {
    fetch(`${server_path}api/assetdetail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setColumnValues(data));
  }, [valsChanged, server_path, token]);

  // set values from api for table

  useEffect(() => {
    // function handlePreviewImg() {}

    setOriData(
      MakeTableData(
        columnValues,
        statusApiValues,
        setPreviewImg,
        setOpenPreviewImg
      )

      // MakeTableData(columnValues, statusApiValues)
    );
  }, [columnValues]);

  useEffect(() => {
    columnHeaders.map((column) => {
      return setHeaders((prev) => {
        return [
          ...prev,
          {
            sticky:
              column === "total_Qty"
                ? "right"
                : column === "asset"
                ? "left"
                : "",
            width: column === "total_Qty" || column === "image" ? 90 : 120,
            maxWidth: column === "total_Qty" || column === "image" ? 90 : 120,
            Header:
              column === "asset_Location_Name"
                ? "Asset Location"
                : column === "searial_No"
                ? "Serial No"
                : column
                    .replace(/_/gi, " ")
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
            accessor: column,
            hidden: column.toLowerCase() === "asset_id" ? true : undefined,
          },
        ];
      });
    });
  }, [columnHeaders]);

  useEffect(() => {
    if (headers.length === columnHeaders.length) {
      setHeaders([
        {
          id: "checkbox",
          sticky: "left",
          width: 90,
          maxWidth: 90,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        {
          Header: "Actions",
          sticky: "left",
          id: "actions",
          width: 105,
          maxWidth: 105,
          Cell: (tableProps) => {
            return (
              <>
                <span
                  style={{
                    cursor: "pointer",
                    color: "#353535",
                    textDecoration: "underline",
                    marginRight: "10px",
                  }}
                  onClick={() => {
                    if (
                      tableProps.row.original.error_Message.includes(
                        "Asset Name not used in Request Form"
                      )
                    ) {
                      setCancelDialogOpen({
                        dialogOpen: true,
                        isDeletable: true,
                      });
                      setSelectedID(tableProps.row.original.asset_ID);
                    } else {
                      setCancelDialogOpen({
                        dialogOpen: true,
                        isDeletable: false,
                      });
                    }
                  }}
                >
                  <Tooltip title="Delete Row">
                    <DeleteButton aria-label="delete">
                      <DeleteIcon fontSize="small" />
                    </DeleteButton>
                  </Tooltip>
                </span>
                <Link
                  to={{
                    pathname: "list-table/list-table-edit",
                    state: { selectedRow: tableProps.row.original },
                  }}
                >
                  <span
                    style={{
                      cursor: "pointer",
                      color: "grey",
                      textDecoration: "underline",
                    }}
                    onClick={(event) => {
                      setSelectedID(tableProps.row.original.asset_ID);
                    }}
                  >
                    <Tooltip title="Edit Row">
                      <EditButton aria-label="edit">
                        <CreateIcon fontSize="small" />
                      </EditButton>
                    </Tooltip>
                  </span>
                </Link>
              </>
            );
          },
        },
      ]);
    }
  }, [headers, oriData, columnHeaders.length, selectedRow]);

  // Delete asset

  function handleDeleteAsset() {
    fetch(`${server_path}api/assetdetail/${selectedID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setValsChanged(!valsChanged);
          setCancelDialogOpen({
            isDeletable: true,
            dialogOpen: false,
          });

          let auditObj = {
            action_By: parseInt(empID),
            event: "Delete",
            asset_Detail_ID: "0",
            asset_Location_ID: 0,
            asset_ID: selectedRow.asset_ID,
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            assetObject: {
              assetName: selectedRow.asset,
            },
            categoryObjects: null,
            brandObject: null,
            supplierObject: null,
            typeObject: null,
            statusObject: null,
            locationObject: null,
            allocationObject: [],
            description: "",
            requestObject: null,
          };

          console.log(auditObj);

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
          });
        }
      })
      .catch((err) => console.log(err));
  }
  const columns = useMemo(() => headers, [headers]);

  const data = useMemo(() => oriData, [oriData]);

  // console.log(openPreviewImg);

  return (
    <Styles>
      <MakeTable
        columns={columns}
        data={data}
        subject="main"
        loading={loading}
      ></MakeTable>

      {cancelDialogOpen.dialogOpen && (
        <CancelDialog
          setCancelDialogOpen={setCancelDialogOpen}
          cancelDialogOpen={cancelDialogOpen}
          deletableTitle="Are you sure you wish to remove this asset?"
          unDeletableTitle="This asset is in used and could not be deleted."
          callbackFunc={handleDeleteAsset}
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
            background: "#4caf50",
          }}
          message={
            <span id="message-id2">
              <div>Asset has successfully deleted</div>
            </span>
          }
        />
      </Snackbar>
      {openPreviewImg && (
        <Preview_model
          openPreviewImg={openPreviewImg}
          setOpenPreviewImg={setOpenPreviewImg}
          previewImg={previewImg}
          server_path={server_path}
          onClose={() => setOpenPreviewImg(false)}
        ></Preview_model>
      )}
    </Styles>
  );
}
