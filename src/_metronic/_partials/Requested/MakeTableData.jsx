import React from "react";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import PersonIcon from "@material-ui/icons/Person";
import GroupIcon from "@material-ui/icons/Group";
import IconButton from "@material-ui/core/IconButton";

const RequestForBtn = styled(IconButton)`
  cursor: ${(props) => (props.person ? "not-allowed" : "pointer")}!important;
  transition: all 300ms;
`;

function makePerson(data) {
  return data;
}

export default function MakeTableData(qty, setGroupDialogOpen) {
  const generateData = () => {
    for (let i in qty) {
      if (qty[i].request_For) {
        if (qty[i].request_For.toLowerCase() === "other") {
          qty[i].request_For = (
            <Tooltip title={"View others"}>
              <RequestForBtn
                onClick={() =>
                  setGroupDialogOpen({ open: true, Id: qty[i].request_ID })
                }
                data-request={qty[i].asset_ID}
              >
                <GroupIcon
                  fontSize="large"
                  style={{
                    transition: "250ms transform",
                    color: "rgba(54, 153, 255, 1)",
                    fontSize: "24px",
                  }}
                ></GroupIcon>
              </RequestForBtn>
            </Tooltip>
          );
        } else {
          qty[i].request_For = (
            <RequestForBtn person="true">
              <PersonIcon
                fontSize="large"
                style={{
                  transition: "250ms transform",
                  color: "rgba(54, 153, 255, 1)",
                  fontSize: "24px",
                }}
              ></PersonIcon>
            </RequestForBtn>
          );
        }
      }

      // set date format to dd-mm-YYYY

      if (qty[i].requeste_Date) {
        qty[i].requeste_Date = moment(qty[i].requeste_Date).format(
          "DD-MM-YYYY hh:mm:ss"
        );
      }

      if (qty[i].expected_Return_Date) {
        qty[i].expected_Return_Date = moment(qty[i].expected_Return_Date)
          .format("DD-MM-YYYY")
          .split("T")[0];
      }
    }

    return qty.map((data, i) => {
      return {
        ...makePerson(data),
      };
    });
  };

  return generateData();
}
