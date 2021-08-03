import React, { useState, useEffect, useContext } from "react";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import styled from "styled-components";
import { FormTitle } from "../../layout/components/custom/FormTitle";
import { appsetting } from "../../../envirment/appsetting";
import RequestFormGrid from "./RequestFormGrid";
import { TokenContext } from "../../../app/BasePage";
import { KTCookie } from "../../_assets/js/components/cookie";
import moment from "moment";

const DialogStyles = styled(Dialog)`
  .MuiPaper-root {
    min-width: 50%;
    max-width: 700px;
    padding: 0 0 25px 0;
  }

  .mid-grid {
    display: flex;
    align-items: center;
  }
`;

export default function RequestForm({
  dialogOpen,
  handleEditChange,
  setDialogOpen,
  selectedRow,
  valsChanged,
  setValsChanged,
  setOpenSnack,
  openSnack,
}) {
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);

  const selectedRowId = selectedRow.asset_ID;

  const [formApiValues, setFormApiValues] = useState({
    location: [],
    branch: [],
    company: [],
  });

  const [newValues, setNewValues] = useState({
    company: "",
    location: "",
    branch: "",
    request_Qty: 1,
    request_Reason: "",
  });

  const [formValuesErr, setFormValuesErr] = useState({
    company: false,
    branch: false,
    location: false,
    request_Qty: false,
  });

  const [selectedID, setSelectedID] = useState({
    request_By_ID: parseInt(empID),
    company_ID: 0,
    branch_ID: 0,
    asset_Location_ID: 0,
  });

  const [checked, setChecked] = useState(true);
  const [showTreeview, setShowTreeview] = useState(false);
  const [employeeList, setEmployeeList] = useState({
    emp_List: [],
  });

  useEffect(() => {
    if (
      selectedID.company_ID !== 0 &&
      selectedID.branch_ID !== 0 &&
      selectedID.asset_Location_ID !== 0
    ) {
      setShowTreeview(true);
    } else {
      setShowTreeview(false);
    }
  }, [selectedID]);

  useEffect(() => {
    setNewValues({
      company: "",
      location: "",
      branch: "",
      request_Qty: 1,
      request_Reason: "",
    });

    setShowTreeview(false);

    setFormValuesErr({
      company: false,
      branch: false,
      location: false,
      request_Qty: false,
    });
  }, [checked]);

  function handleCheckedChange() {
    setChecked(!checked);
  }

  // get api values for request form

  useEffect(() => {
    const urls = [
      `${server_path}api/Branch?EmployeeID=${empID}`,
      `${server_path}api/Location?EmployeeID=${empID}`,
      `${server_path}api/company`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(requests)
      .then((res) => {
        return Promise.all(res.map((one) => one.json()));
      })
      .then((arr) => {
        console.log(arr);
        setFormApiValues((prev) => {
          return {
            ...prev,
            branch: arr[0],
            location: arr[1],
            company: arr[2],
          };
        });
      });
  }, [server_path, token]);

  function handleRequestFormSubmit(e) {
    e.preventDefault();

    // console.log(selectedRow);

    if (checked) {
      const empID = KTCookie.getCookie("empID");
      const postData = {
        ...newValues,
        asset_ID: selectedRowId,
        ...selectedID,
        employee: [parseInt(empID)],
        status_ID: 0,
      };
      delete postData.company_ID;
      delete postData.branch_ID;
      delete postData.company;
      delete postData.branch;
      delete postData.location;

      console.log(postData);

      fetch(`${server_path}api/requestable`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            fetchAudit("self", selectedRow);
            setValsChanged(!valsChanged);
            setOpenSnack({
              ...openSnack,
              openSnackOpen: true,
              title: "Requested successfully",
              subject: "success",
            });
            // alert("success");
          } else {
            setOpenSnack({
              ...openSnack,
              openSnackOpen: true,
              title: "An error has occured, please try again",
              subject: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            title: "An error has occured, please try again",
            subject: "error",
          });
        });
      setDialogOpen(false);
    } else {
      if (newValues.company === "") {
        setFormValuesErr({
          ...formValuesErr,
          company: true,
        });

        return;
      }

      if (newValues.location === "") {
        setFormValuesErr({
          ...formValuesErr,
          location: true,
        });

        return;
      }
      if (newValues.branch === "") {
        setFormValuesErr({
          ...formValuesErr,
          branch: true,
        });

        return;
      }

      if (newValues.request_Qty === "" || newValues.request_Qty === 0) {
        setFormValuesErr({
          ...formValuesErr,
          request_Qty: true,
        });

        return;
      }

      const postData = {
        ...newValues,
        asset_ID: selectedRowId,
        ...selectedID,
        employee: employeeList,
        status_ID: 0,
      };

      delete postData.company;
      delete postData.branch;
      delete postData.location;
      delete postData.company_ID;
      delete postData.branch_ID;
      console.log(postData);

      fetch(`${server_path}api/requestable`, {
        // mode: "no-cors",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((res) => {
          if (res.status === 200) {
            fetchAudit("others", selectedRow);

            setValsChanged((prev) => !prev);
            setOpenSnack({
              ...openSnack,
              openSnackOpen: true,
              title: "Requested successfully",
              subject: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            title: "An error has occured, please try again",
            subject: "error",
          });
        });
    }

    setDialogOpen(false);
  }

  function fetchAudit(option, selectedRow) {
    let auditObj = {
      action_By: parseInt(empID),
      event: "Request",
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
      allocationObject: [],
      description: "",
      requestObject: {
        assetName: selectedRow.asset_Name,
      },
    };

    if (option === "self") {
      auditObj.description = "for self";
    } else {
      auditObj.description = "for others";
    }
    console.log(auditObj);

    fetch(`${server_path}api/AuditTrial`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(auditObj),
    });
  }

  const requestFormPropValues = {
    handleRequestFormSubmit: handleRequestFormSubmit,
    formValuesErr: formValuesErr,
    setFormValuesErr: setFormValuesErr,
    newValues: newValues,
    setNewValues: setNewValues,
    selectedID: selectedID,
    setSelectedID: setSelectedID,
    formApiValues: formApiValues,
    setDialogOpen: setDialogOpen,
    showTreeview: showTreeview,
    checked: checked,
    handleCheckedChange: handleCheckedChange,
    setEmployeeList: setEmployeeList,
    employeeList: employeeList,
  };

  return (
    <DialogStyles
      aria-labelledby="simple-dialog-title"
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
    >
      <FormTitle>Request</FormTitle>
      <DialogContent>
        <RequestFormGrid
          requestFormPropValues={requestFormPropValues}
        ></RequestFormGrid>
      </DialogContent>
    </DialogStyles>
  );
}
