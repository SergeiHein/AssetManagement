import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import { DatePicker } from "antd";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export const Styles = styled.div`
  width: 100%;
  margin: 0px auto 0 auto;
  height: 100%;
`;

export const RequestedImg = styled.img`
  width: 80%;
  object-fit: contain;
  max-height: 44px;
  cursor: pointer;
  transition: transform 300ms;

  &.error-img {
    &:hover {
      transform: scale(1);
    }
  }

  &:hover {
    transform: scale(2);
  }
`;

export const NoRequestedTableText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-25%, -50%);
  font-size: 1.4rem;
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

export const CheckBoxLabel = styled(FormControlLabel)`
  .MuiTypography-body1 {
    font-weight: 700;
  }
`;

export const DetailImg = styled.img`
  object-fit: contain;
  max-height: 44px;
  cursor: pointer;
  transition: transform 300ms;

  &.error-img {
    &:hover {
      transform: scale(1);
    }
  }

  &:hover {
    transform: scale(2);
  }
`;

export const NoIssueTableText = styled.div`
  transform: translate(33%, 0%);
  font-size: 1.4rem;
`;

export const Picker = styled(DatePicker)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.42) !important;
  border-top: none !important ;
  border-left: none !important;
  border-right: none !important;

  .ant-picker-focused {
    box-shadow: none !important;
  }

  .ant-picker-input > input {
    margin-left: -10px !important;
  }
`;

export const NoDataTableText = styled.div`
  position: absolute;
  top: 75%;
  left: 54%;
  transform: translate(-25%, -50%);
  font-size: 1.4rem;
`;

export const NoCategoryDataText = styled.div`
  position: absolute;
  top: 87%;
  left: 53%;
  transform: translate(-25%, -50%);
  font-size: 1.4rem;
`;

export const NoSupplierDataText = styled.div`
  position: absolute;
  top: 75%;
  left: 53%;
  transform: translate(-25%, -50%);
  font-size: 1.4rem;
`;

export const NoLocationDataTable = styled.div`
  position: absolute;
  top: 50%;
  left: 53%;
  transform: translate(-25%, -50%);
  font-size: 1.4rem;
`;
