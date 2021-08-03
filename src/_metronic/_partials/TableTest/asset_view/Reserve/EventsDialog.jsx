import React, { useState, useEffect, useContext } from "react";

import { DialogContent } from "@material-ui/core";
import { FormTitle } from "../../../../layout/components/custom/FormTitle";
import { v4 as uuidv4 } from "uuid";

import "date-fns";
import moment from "moment";

import { DialogStyles, FormStyles } from "./ReserveDialogStyles";
import EventsDialogGrid from "./EventsDialogGrid";
import { TokenContext } from "../../../../../app/BasePage";
import { appsetting } from "../../../../../envirment/appsetting";

export default function EventsDialog({
  dialogOpen,
  setDialogOpen,
  calendarRef,
  values,
  setValues,
  id,
}) {
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const [formValues, setFormValues] = useState({
    note: "",
    selectedFromDate: new Date(),
    selectedToDate: new Date(),
    selectedFromTime: moment().startOf("day"),
    selectedToTime: moment().startOf("day"),
    location: "",
    issueTo: "",
  });
  const [errorMsg, setErrorMsg] = useState({
    title: false,
    fromDate: false,
    fromTime: false,
    overlap: false,
    issueTo: false,
    location: false,
  });

  const [issueToValues, setIssueToValues] = useState([]);
  // const [employeeData, setEmployeeData] = useState([]);
  const [dropdownValues, setDropdownValues] = useState({
    oriLocation: [],
    location: [],
    employeeData: [],
  });
  const [selectedID, setSelectedID] = useState();
  const selectedValue = dropdownValues.oriLocation.find(
    (row) => row.AssetLocation_ID === selectedID
  );

  // console.log(selectedID);

  useEffect(() => {
    const urls = [
      `${server_path}api/AssetLocation/LocationTreeView`,
      `${server_path}api/Employee?id=${empID}`,
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
        const ApiLocationData = [...arr[0]];
        const TreeViewData = ApiLocationData.sort(function(obj1, obj2) {
          return obj1.Parent_ID - obj2.Parent_ID;
        });
        const setting = [];

        const buildNestedTree = (items, data) => {
          if (items) {
            if (items.children.length) {
              buildNestedTree(items.children[0], data);
            } else {
              items.children.push({
                title: data.Asset_Location,
                value: data.AssetLocation_ID,
                id: data.Parent_ID,
                children: [],
              });
            }
          }
        };
        TreeViewData.map((tree) => {
          if (tree.Parent_ID === 0) {
            setting.push({
              title: tree.Asset_Location,
              value: tree.AssetLocation_ID,
              id: tree.Parent_ID,
              group_List: tree.Group_List,

              children: [],
            });
          } else {
            let index = setting.findIndex(
              (list) => list.group_List === tree.Group_List
            );
            buildNestedTree(setting[index], tree);
          }
          return null;
        });

        setDropdownValues((prev) => {
          return {
            ...prev,
            oriLocation: arr[0],
            location: setting,
            employeeData: arr[1],
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (dialogOpen.title === "edit" && dropdownValues.oriLocation.length > 0) {
      console.log(
        dropdownValues.oriLocation,
        dialogOpen.info.event.extendedProps.location
      );

      const _location = dropdownValues.oriLocation.find(
        (one) =>
          one.AssetLocation_ID ===
          parseInt(dialogOpen.info.event.extendedProps.location)
      ).Asset_Location;

      const _issueTo = dropdownValues.employeeData.find(
        (one) =>
          one.employee_ID ===
          parseInt(dialogOpen.info.event.extendedProps.issueTo)
      ).employee_ID;
      setSelectedID(parseInt(dialogOpen.info.event.extendedProps.location));
      setFormValues({
        ...formValues,
        note: dialogOpen.info.event.title,
        selectedFromDate: dialogOpen.info.event.start,
        selectedToDate: dialogOpen.info.event.end,
        location: _location ? _location : "",
        issueTo: _issueTo ? _issueTo : "",
        // issueTo: ''
      });
      // setFormValues({...formvalues})
    } else if (
      dialogOpen.title === "timeEdit" &&
      dropdownValues.oriLocation.length > 0
    ) {
      const _location = dropdownValues.oriLocation.find(
        (one) =>
          one.AssetLocation_ID ===
          parseInt(dialogOpen.info.event.extendedProps.location)
      ).Asset_Location;

      const _issueTo = dropdownValues.employeeData.find(
        (one) =>
          one.employee_ID ===
          parseInt(dialogOpen.info.event.extendedProps.issueTo)
      ).employee_ID;
      setSelectedID(parseInt(dialogOpen.info.event.extendedProps.location));
      setFormValues({
        ...formValues,
        note: dialogOpen.info.event.title,
        selectedFromDate: dialogOpen.info.event.start,
        selectedFromTime: dialogOpen.info.event.start,
        selectedToTime: dialogOpen.info.event.end,
        location: _location ? _location : "",
        issueTo: _issueTo ? _issueTo : "",
        // issueTo: ''
      });
    } else {
      setFormValues({ ...formValues, note: "" });
    }
  }, [dialogOpen, dropdownValues]);

  // console.log(issueToValues);
  useEffect(() => {
    if (selectedValue?.Location_Type === "Location") {
      setIssueToValues(
        dropdownValues.employeeData.filter(
          (value) => value.location_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Branch") {
      setIssueToValues(
        dropdownValues.employeeData.filter(
          (value) => value.branch_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Department") {
      setIssueToValues(
        dropdownValues.employeeData.filter(
          (value) => value.department_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Section") {
      setIssueToValues(
        dropdownValues.employeeData.filter(
          (value) => value.section_ID === selectedValue.HRLocation_ID
        )
      );
    }
    if (selectedValue?.Location_Type === "Asset Location") {
      setIssueToValues(
        dropdownValues.employeeData.filter(
          (value) => value.location_ID === selectedValue.HRLocation_ID
        )
      );
    }
  }, [selectedValue, dropdownValues.employeeData]);

  function handleAddEvent(e) {
    e.preventDefault();

    let calendarApi = dialogOpen.info.view.calendar;

    const events = calendarRef.current.getApi().getEvents();

    for (let i in events) {
      if (
        moment(dialogOpen.info.startStr).isBefore(events[i].end) &&
        moment(dialogOpen.info.endStr).isAfter(events[i].start)
      ) {
        // return true;
        setErrorMsg({
          ...errorMsg,
          overlap: true,
        });

        return;
      }
      // if (
      //   moment(events[i].start).isSame(
      //     moment(dialogOpen.info.startStr),
      //     "day"
      //   ) &&
      //   moment(events[i].end).isSame(moment(dialogOpen.info.endStr), "day")
      // ) {
      //   console.log("nah");
      //   setErrorMsg({
      //     ...errorMsg,
      //     overlap: true,
      //   });

      //   return;
      // }
    }

    // console.log("yes");

    // setValues([
    //   ...values,
    //   {
    //     id: uuidv4(),
    //     title: formValues.note,
    //     start: dialogOpen.info.startStr,
    //     end: dialogOpen.info.endStr,
    //     allDay: dialogOpen.info.allDay,
    //   },
    // ]);

    if (formValues.note) {
      calendarApi.unselect(); // clear date selection

      // const formObj = {
      //   reserve_ID: 0,
      //   reserveItem_ID: id,
      //   reserve_Form_Date: moment(dialogOpen.info.startStr).format(
      //     "DD/MM/YYYY HH:mm:ss"
      //   ),
      //   reserve_To_Date: moment(dialogOpen.info.endStr).format(
      //     "DD/MM/YYYY HH:mm:ss"
      //   ),
      //   reserveBy_Location_ID: formValues.location,
      //   reserveBy_Employee_ID: formValues.issueTo,
      //   note: formValues.note,
      //   employee_ID: parseInt(empID),
      //   all_Day: dialogOpen.info.allDay,
      // };

      // console.log(formObj);

      // fetch(`${server_path}api/AssetView/SaveReservePopupUpdate`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formObj),
      // }).then((data) => console.log(data));

      calendarApi.addEvent({
        id: uuidv4(),
        title: formValues.note,
        start: dialogOpen.info.startStr,
        end: dialogOpen.info.endStr,
        location: formValues.location,
        issueTo: formValues.issueTo,
        allDay: dialogOpen.info.allDay,
      });
    }

    setDialogOpen({ ...dialogOpen, open: false });
  }

  function handleCustomAddEvent(e) {
    e.preventDefault();

    if (
      moment(formValues.selectedFromDate).isSameOrAfter(
        formValues.selectedToDate
      )
    ) {
      setErrorMsg({
        ...errorMsg,
        fromDate: true,
      });

      return;
    }

    let calendarApi = dialogOpen.info;

    const events = calendarRef.current.getApi().getEvents();

    for (let i in events) {
      if (
        moment(formValues.selectedFromDate).isBefore(events[i].end) &&
        moment(formValues.selectedToDate).isAfter(events[i].start)
      ) {
        // return true;
        setErrorMsg({
          ...errorMsg,
          overlap: true,
        });

        return;
      }
      // if (
      //   moment(events[i].start).isSame(
      //     moment(formValues.selectedFromDate),
      //     "day"
      //   ) &&
      //   moment(events[i].end).isSame(moment(formValues.selectedToDate), "day")
      // ) {
      //   setErrorMsg({
      //     ...errorMsg,
      //     overlap: true,
      //   });

      //   return;
      // }
    }

    if (formValues.note) {
      calendarApi.unselect(); // clear date selection

      // console.log(moment(formValues.selectedFromDate).format("DD/MM/YYYY"));

      const formObj = {
        reserve_ID: 0,
        reserveItem_ID: id,
        reserve_Form_Date: moment(formValues.selectedFromDate).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
        reserve_To_Date: moment(formValues.selectedToDate).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
        reserveBy_Location_ID: formValues.location,
        reserveBy_Employee_ID: formValues.issueTo,
        note: formValues.note,
        employee_ID: parseInt(empID),
        all_Day: true,
      };

      console.log(formObj);

      fetch(`${server_path}api/AssetView/SaveReservePopupUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObj),
      }).then((data) => console.log(data));

      // setValues([
      //   ...values,
      //   {
      //     id: uuidv4(),
      //     title: formValues.note,
      //     start: formValues.selectedFromDate,
      //     end: formValues.selectedToDate,
      //     allDay: true,
      //   },
      // ]);
      calendarApi.addEvent({
        id: uuidv4(),
        title: formValues.note,
        start: formValues.selectedFromDate,
        end: formValues.selectedToDate,
        location: formValues.location,
        issueTo: formValues.issueTo,
        allDay: true,
      });
    }
    setDialogOpen({ ...dialogOpen, open: false });
  }

  function handleCustomAddEventTime(e) {
    e.preventDefault();

    if (
      moment(formValues.selectedFromTime).isSameOrAfter(
        formValues.selectedToTime
      )
    ) {
      // console.log("err");
      setErrorMsg({
        ...errorMsg,
        fromTime: true,
      });

      return;
    }
    let calendarApi = dialogOpen.info;

    if (formValues.note) {
      calendarApi.unselect(); // clear date selection

      const test1 = moment(formValues.selectedFromDate).format("DD-MM-YYYY");

      const test2 = moment(formValues.selectedFromTime)
        // .toDate()
        .format("DD-MM-YYYY HH:mm:ss")
        .split(" ")[1];

      const test3 = moment(formValues.selectedToTime)
        .format("DD-MM-YYYY HH:mm:ss")
        .split(" ")[1];

      const final1 = `${test1} ${test2}`;
      const final2 = `${test1} ${test3}`;

      const formObj = {
        reserve_ID: 0,
        reserveItem_ID: id,
        reserve_Form_Date: final1,
        reserve_To_Date: final2,
        reserveBy_Location_ID: formValues.location,
        reserveBy_Employee_ID: formValues.issueTo,
        note: formValues.note,
        employee_ID: parseInt(empID),
        all_Day: false,
      };

      console.log(formObj);

      fetch(`${server_path}api/AssetView/SaveReservePopupUpdate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObj),
      }).then((data) => console.log(data));

      calendarApi.addEvent({
        id: uuidv4(),
        title: formValues.note,
        start: moment(final1, "DD-MM-YYYY HH:mm:ss").toDate(),
        end: moment(final2, "DD-MM-YYYY HH:mm:ss").toDate(),
        location: formValues.location,
        issueTo: formValues.issueTo,
        allDay: false,
      });
    }
    setDialogOpen({ ...dialogOpen, open: false });
  }

  const handleLocationChange = (e, l) => {
    if (!e) return;

    setSelectedID(e);
    setFormValues({
      ...formValues,
      location: e,
    });
    setErrorMsg({ ...errorMsg, location: false });
  };

  const handleIssueToChange = (e) => {
    setFormValues({
      ...formValues,
      issueTo: e.target.value,
    });
    setErrorMsg({ ...errorMsg, issueTo: false });
  };

  const handleDateChangeFrom = (date) => {
    setErrorMsg({
      ...errorMsg,
      fromDate: false,
    });
    setFormValues({
      ...formValues,
      selectedFromDate: date,
    });
  };

  const handleDateChangeTo = (date) => {
    setFormValues({
      ...formValues,
      selectedToDate: date,
    });

    setErrorMsg({
      ...errorMsg,
      fromDate: false,
    });

    // setSelectedToDate(date);
  };

  const handleTimeChangeFrom = (date) => {
    setErrorMsg({
      ...errorMsg,
      fromTime: false,
    });
    // console.log(date);
    setFormValues({
      ...formValues,
      selectedFromTime: date,
    });
    // setSelectedFromTime(date);
  };

  const handleTimeChangeTo = (date) => {
    setFormValues({
      ...formValues,
      selectedToTime: date,
    });

    setErrorMsg({
      ...errorMsg,
      fromTime: false,
    });
    // setSelectedToTime(date);
  };

  function handleEditEvent() {
    if (formValues.note === "") {
      setErrorMsg({
        ...errorMsg,
        title: true,
      });

      return;
    }
    if (formValues.location === "") {
      // console.log("error");
      setErrorMsg({
        ...errorMsg,
        location: true,
      });

      return;
    }

    // if (formValues.issueTo === "") {
    //   setErrorMsg({
    //     ...errorMsg,
    //     issueTo: true,
    //   });

    //   return;
    // }

    const events = calendarRef.current.getApi().getEvents();

    for (let i in events) {
      if (
        moment(formValues.selectedFromDate).isBefore(events[i].end) &&
        moment(formValues.selectedToDate).isAfter(events[i].start)
      ) {
        console.log(formValues.selectedFromDate, events[i].end);
        console.log(formValues.selectedToDate, events[i].start);
        // return true;
        setErrorMsg({
          ...errorMsg,
          overlap: true,
        });

        return;
      }
      // if (
      //   moment(events[i].start).isSame(
      //     moment(formValues.selectedFromDate),
      //     "day"
      //   ) &&
      //   moment(events[i].end).isSame(moment(formValues.selectedToDate), "day")
      // ) {
      //   console.log("nah");
      //   setErrorMsg({
      //     ...errorMsg,
      //     overlap: true,
      //   });

      //   return;
      // }
    }

    // console.log(formValues.selectedToDate);

    dialogOpen.info.event.setProp("title", formValues.note);
    dialogOpen.info.event.setStart(formValues.selectedFromDate);
    dialogOpen.info.event.setEnd(formValues.selectedToDate);

    // const formObj = {
    //   reserve_ID: 0,
    //   reserveItem_ID: id,
    //   reserve_Form_Date: moment(formValues.selectedFromDate).format(
    //     "DD/MM/YYYY"
    //   ),
    //   reserve_To_Date: moment(formValues.selectedToDate).format("DD/MM/YYYY"),
    //   reserveBy_Location_ID: formValues.location,
    //   reserveBy_Employee_ID: formValues.issueTo,
    //   note: formValues.note,
    //   employee_ID: parseInt(empID),
    // };

    // console.log(formObj);

    // fetch(`${server_path}/api/AssetView/SaveReservePopupUpdate`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formObj),
    // }).then((data) => console.log(data));

    // dialogOpen.info.event.setDates(
    //   formValues.selectedFromDate,
    //   formValues.selectedToDate
    // );

    // if (formValues.selectedFromDate) {

    // }

    // if (formValues.selectedToDate) {

    //   dialogOpen.info.event.setStart(formValues.selectedToDate)
    // }

    setDialogOpen({ ...dialogOpen, open: false });
  }

  function handleTimeEditEvent() {
    if (formValues.note === "") {
      setErrorMsg({
        ...errorMsg,
        title: true,
      });

      return;
    }
    if (formValues.location === "") {
      // console.log("error");
      setErrorMsg({
        ...errorMsg,
        location: true,
      });

      return;
    }

    // if (formValues.issueTo === "") {
    //   setErrorMsg({
    //     ...errorMsg,
    //     issueTo: true,
    //   });

    //   return;
    // }
    const test1 = moment(formValues.selectedFromDate).format("DD-MM-YYYY");

    const test2 = moment(formValues.selectedFromTime)
      // .toDate()
      .format("DD-MM-YYYY HH:mm:ss")
      .split(" ")[1];

    const test3 = moment(formValues.selectedToTime)
      .format("DD-MM-YYYY HH:mm:ss")
      .split(" ")[1];

    const final1 = `${test1} ${test2}`;
    const final2 = `${test1} ${test3}`;

    const events = calendarRef.current.getApi().getEvents();

    for (let i in events) {
      // console.log(events[i].start, events[i].end);
      // console.log(formValues.selectedFromDate, formValues.selectedToDate);
      // if (
      //   moment(events[i].start).isSame(
      //     moment(formValues.selectedFromTime),
      //     "hour"
      //   ) &&
      //   moment(events[i].end).isSame(moment(formValues.selectedToTime), "hour")
      // ) {
      //   setErrorMsg({
      //     ...errorMsg,
      //     overlap: true,
      //   });

      //   return;
      // }

      if (
        moment(formValues.selectedFromDate).isBefore(events[i].end, "minute") &&
        moment(formValues.selectedToDate).isAfter(events[i].start, "minute")
      ) {
        // return true;
        setErrorMsg({
          ...errorMsg,
          overlap: true,
        });

        return;
      }
    }

    // console.log(formValues.selectedFromTime, formValues.selectedToTime);

    dialogOpen.info.event.setProp("title", formValues.note);
    dialogOpen.info.event.setStart(
      moment(final1, "DD-MM-YYYY HH:mm:ss").toDate()
    );
    dialogOpen.info.event.setEnd(
      moment(final2, "DD-MM-YYYY HH:mm:ss").toDate()
    );

    // const formObj = {
    //   reserve_ID: 0,
    //   reserveItem_ID: id,
    //   reserve_Form_Date: moment(formValues.selectedFromDate).format(
    //     "DD/MM/YYYY"
    //   ),
    //   reserve_To_Date: moment(formValues.selectedToDate).format("DD/MM/YYYY"),
    //   reserveBy_Location_ID: formValues.location,
    //   reserveBy_Employee_ID: formValues.issueTo,
    //   note: formValues.note,
    //   employee_ID: parseInt(empID),
    // };

    // console.log(formObj);

    // fetch(`${server_path}/api/AssetView/SaveReservePopupUpdate`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formObj),
    // }).then((data) => console.log(data));

    // dialogOpen.info.event.setDates(
    //   formValues.selectedFromDate,
    //   formValues.selectedToDate
    // );

    // if (formValues.selectedFromDate) {

    // }

    // if (formValues.selectedToDate) {

    //   dialogOpen.info.event.setStart(formValues.selectedToDate)
    // }

    setDialogOpen({ ...dialogOpen, open: false });
  }

  function handleDeleteEvent() {
    dialogOpen.info.event.remove();

    setDialogOpen({ ...dialogOpen, open: false });
  }

  function handleTitleChange(e) {
    setFormValues({
      ...formValues,
      note: e.target.value,
    });

    // setFormValues({
    //   ...formValues,
    //   [e.target]: e.target.value
    // })

    setErrorMsg({
      ...errorMsg,
      title: false,
    });
  }

  const gridPropValues = {
    formValues: formValues,
    setFormValues: setFormValues,
    errorMsg: errorMsg,
    dialogOpen: dialogOpen,
    handleTitleChange: handleTitleChange,
    handleEditEvent: handleEditEvent,
    handleDeleteEvent: handleDeleteEvent,
    handleTitleChange: handleTitleChange,
    handleDateChangeFrom: handleDateChangeFrom,
    handleDateChangeTo: handleDateChangeTo,
    handleTimeChangeFrom: handleTimeChangeFrom,
    handleTimeChangeTo: handleTimeChangeTo,
    handleLocationChange: handleLocationChange,
    handleIssueToChange: handleIssueToChange,
    setSelectedID: setSelectedID,
    dropdownValues: dropdownValues,
    issueToValues: issueToValues,
    handleTimeEditEvent: handleTimeEditEvent,
  };

  return (
    <DialogStyles
      aria-labelledby="simple-dialog-title"
      open={dialogOpen.open}
      onClose={() => setDialogOpen({ ...dialogOpen, open: false })}
    >
      <FormTitle>Reserve Entry</FormTitle>
      <DialogContent>
        <FormStyles
          onSubmit={(e) => {
            // console.log(formValues.location);
            if (formValues.location === "") {
              // console.log("error");
              setErrorMsg({
                ...errorMsg,
                location: true,
              });

              return;
            }

            // if (formValues.issueTo === "") {
            //   setErrorMsg({
            //     ...errorMsg,
            //     issueTo: true,
            //   });

            //   return;
            // }
            if (formValues.note === "") {
              // console.log("error");
              setErrorMsg({
                ...errorMsg,
                title: true,
              });

              return;
            }

            if (dialogOpen.title === "entry") {
              handleAddEvent(e);
            } else if (dialogOpen.title === "custom month entry") {
              handleCustomAddEvent(e);
            } else {
              handleCustomAddEventTime(e);
            }
          }}
        >
          <EventsDialogGrid gridPropValues={gridPropValues}></EventsDialogGrid>
        </FormStyles>
      </DialogContent>
    </DialogStyles>
  );
}
