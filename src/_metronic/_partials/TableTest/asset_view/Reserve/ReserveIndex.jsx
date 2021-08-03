import React from "react";
import Calendar from "./Calendar";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

const IconWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 95%;
`;

const useStyles = makeStyles({
  info: {
    cursor: "pointer",
    fontSize: "22px",
  },
});

const CustomTooltip = withStyles({
  tooltip: {
    fontSize: 10,
    lineHeight: "1.7em",
    maxWidth: 300,
  },
})(Tooltip);

export default function ReserveIndex({ id }) {
  const classes = useStyles();
  return (
    <>
      <IconWrapper>
        <CustomTooltip
          title="Select dates or click on add an event button and you will be prompted to create a new event. Drag, drop, and resize events and Click an event to modify it"
          placement="top"
          arrow
        >
          <InfoIcon className={classes.info} />
        </CustomTooltip>
      </IconWrapper>
      <Calendar id={id}></Calendar>
    </>
  );
}
