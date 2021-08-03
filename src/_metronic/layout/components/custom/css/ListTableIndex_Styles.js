import IconButton from "@material-ui/core/IconButton";
import styled from "styled-components";
import AppBar from "@material-ui/core/AppBar";

export const Styles = styled.div`
  width: 100%;
  height: 100%;
  margin: 0px auto 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const DeleteButton = styled(IconButton)`
  padding: 7px !important;
  border-radius: 4px !important;
  background: rgba(244, 67, 54, 0.5) !important;
  transition: all 300ms;

  svg {
    color: #fff;
  }
  &:hover {
    background-color: rgba(244, 67, 54, 0.8) !important;
  }
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

export const TabBar = styled(AppBar)`
  box-shadow: 0 0px 4px 0px rgba(82, 63, 105, 0.15) !important;
`;
