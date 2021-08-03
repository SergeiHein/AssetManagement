import React, { useState, useEffect, useContext } from "react";
import { useSubheader } from "../../../layout";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import MakeTableData from "./MakeTableData";
import MakeTable from "./MakeTable";
import DetailDialog from "../asset_allocation/DetailDialog";

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

export default function AssetIssueIndex(props) {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Asset Issue");
  const { token, empID } = useContext(TokenContext);
  const { server_path } = appsetting;
  const [oriData, setOriData] = useState([]);
  const [tableApiValues, setTableApiValues] = useState([]);
  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    Id: null,
  });

  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });

  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }
  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

  const columnsNames = React.useMemo(() => [
    {
      id: "checkbox",
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
      Header: "Details",
      id: "details",
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
                setDialogOpen({
                  ...dialogOpen,
                  open: true,
                  Id: tableProps.row.original.assetDetail_ID,
                });
              }}
            >
              <Tooltip title="View Details">
                <DetailStyles aria-label="delete">
                  <InfoIcon fontSize="small" />
                </DetailStyles>
              </Tooltip>
            </span>
          </>
        );
      },
    },
    {
      Header: "Asset Name",
      accessor: "asset_Name",
    },
    {
      Header: "Asset Tag",
      accessor: "asset_Tag",
    },
    {
      Header: "Status",
      accessor: "status_Name",
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Location",
      accessor: "location",
    },
  ]);

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
        description: "Asset Issue Page",
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
    let arr = [];
    fetch(
      `${server_path}api/AssetDetail/GetAvailableAssetIssue?emp_id=${parseInt(
        empID
      )}`,
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
          setTableApiValues(data);
          return;
        }
        setTableApiValues(data);

        setLoading({ finish: true, success: true });
      })
      .catch((err) => {
        setLoading({ finish: true, success: false });
      });
  }, [server_path, token]);

  useEffect(() => {
    setOriData(MakeTableData(tableApiValues));
  }, [tableApiValues]);

  return (
    <>
      <MakeTable
        columns={columnsNames}
        data={oriData}
        loading={loading}
        props={props}
        subject="sub"
      ></MakeTable>
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
            background: `${
              title === "saved"
                ? "#4caf50"
                : title === "fill all detail"
                ? "#ff9100"
                : "#f44306"
            }`,
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
