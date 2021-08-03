import IconButton from "@material-ui/core/IconButton";
import styled from "styled-components";

export const Styles = styled.div`
  width: 100%;
  margin: 0px auto 0 auto;
  height: 100%;
`;

export const EditButton = styled(IconButton)`
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

export const CancelButton = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgba(244, 67, 54, 0.5) !important;
  transition: all 300ms;

  svg {
    color: #fff;
  }
  &:hover {
    background: rgba(244, 67, 54, 0.8) !important;
  }
`;
