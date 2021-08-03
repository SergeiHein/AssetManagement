import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import styled from "styled-components";
import EventsDialog from "./EventsDialog";
import CancelDialog from "./CancelDialog";

import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

const WrapperCalender = styled.div`
  width: 90%;
  margin: 25px auto;

  i {
    color: unset;
  }

  .fc-title {
  }

  .fc-event-main-frame {
    padding: 3px;
  }
  .fc .fc-button-primary {
    background: rgba(54, 153, 255, 0.75);
    border: none !important;
    outline: none !important;
  }
  .fc .fc-button:disabled {
    opacity: 0.45 !important;
  }

  .fc .fc-button.disabled {
    display: none;
  }
  .fc .fc-button-primary:not(:disabled):active,
  .fc .fc-button-primary:not(:disabled).fc-button-active {
    background: rgba(54, 153, 255, 1);
  }
  .fc .fc-button-primary:focus {
    box-shadow: none !important;
  }
`;

export default function Calendar({ id }) {
  const [state, setState] = useState({
    currentEvents: [],
  });

  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    title: "",
    info: null,
  });

  const [cancelDialogOpen, setCancelDialogOpen] = useState({
    open: false,
    title: "",
    info: null,
  });

  const calendarRef = useRef();

  function handleDateSelect(selectInfo) {
    setDialogOpen({ open: true, info: selectInfo, title: "entry" });
  }

  function handleEventClick(clickInfo) {
    if (clickInfo.event.allDay === true) {
      setDialogOpen({
        open: true,
        info: clickInfo,
        title: clickInfo.view.type === "dayGridMonth" ? "edit" : "timeEdit",
      });
    }
  }

  function handleEvents(events) {
    setState({
      currentEvents: events,
    });
  }

  function handleCustomAddEventBtn() {
    if (
      calendarRef.current.getApi().getCurrentData().currentViewType ===
      "dayGridMonth"
    ) {
      setDialogOpen({
        open: true,
        title: "custom month entry",
        info: calendarRef.current.getApi(),
      });
    } else if (
      calendarRef.current.getApi().getCurrentData().currentViewType ===
      "timeGridWeek"
    ) {
      setDialogOpen({
        open: true,
        title: "custom week entry",
        info: calendarRef.current.getApi(),
      });
    } else if (
      calendarRef.current.getApi().getCurrentData().currentViewType ===
      "timeGridDay"
    ) {
      setDialogOpen({
        open: true,
        title: "custom day entry",
        info: calendarRef.current.getApi(),
      });
    } else {
      setDialogOpen({
        open: false,
        title: "",
        info: "",
      });
    }
  }

  function renderInnerContent(innerProps) {
    return (
      <div className="fc-event-main-frame">
        {innerProps.timeText && (
          <div className="fc-event-time">{innerProps.timeText}</div>
        )}
        <div className="fc-event-title-container">
          <div className="fc-event-title fc-sticky">
            {innerProps.event.title || <React.Fragment>&nbsp;</React.Fragment>}
          </div>
        </div>
      </div>
    );
  }

  function handleViewDidMount(info) {
    var calendarEl = document.querySelector(".fc-theme-standard");
    calendarEl.querySelectorAll(".fc-button").forEach((one) => {
      if (one.innerText === "Add Reservation") {
        if (info.view.type === "listWeek") {
          one.classList.add("disabled");
        } else {
          one.classList.remove("disabled");
        }
      }
    });
  }

  return (
    <>
      <WrapperCalender className="demo-app">
        <div className="demo-app-main">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            ref={calendarRef}
            headerToolbar={{
              left: "prev,next today customAddEventBtn",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            customButtons={{
              customAddEventBtn: {
                text: "Add Reservation",
                click: handleCustomAddEventBtn,
              },
            }}
            viewDidMount={handleViewDidMount}
            weekends={true}
            select={handleDateSelect}
            eventContent={(arg) => {
              return (
                <Tooltip
                  title={
                    <Typography color="inherit">{arg.event.title}</Typography>
                  }
                  arrow
                >
                  {renderInnerContent(arg)}
                </Tooltip>
              );
            }}
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          />
        </div>
      </WrapperCalender>
      {dialogOpen.open && (
        <EventsDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          calendarRef={calendarRef}
          id={id}
        ></EventsDialog>
      )}
      {cancelDialogOpen.open && (
        <CancelDialog
          setCancelDialogOpen={setCancelDialogOpen}
          cancelDialogOpen={cancelDialogOpen}
        ></CancelDialog>
      )}
    </>
  );
}
