import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Select2 from "@material-ui/core/Select";
import { TreeSelect, Select } from "antd";

export const ListFormWrapper = styled.div`
  width: 70%;
  margin: 0 auto 50px auto;
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  background: #fff;
`;

export const ListForm = styled.form`
  width: 80%;
  padding: 25px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  justify-content: space-around;

  .MuiFormLabel-asterisk {
    color: red;
  }

  .Mui-error {
    color: #f44336 !important;

    &::after {
      border-bottom: 1px solid #f44336 !important;
    }
  }

  .MuiGrid-spacing-xs-3 > .MuiGrid-item {
    display: flex;
    align-items: center;
  }

  .MuiGrid-spacing-xs-3 > .MuiGrid-item:nth-child(even) {
    justify-content: flex-end;
  }

  .MuiFormControl-root {
    width: 65% !important;

    @media (max-width: 1024px) {
      width: 75% !important;
    }

    @media (max-width: 600px) {
      width: 85% !important;
    }
  }

  .description-grid .MuiFormControl-root {
    width: 90% !important;

    textarea {
      min-height: 75px;
    }

    @media (max-width: 1024px) {
      width: 100% !important;
    }
  }

  @media (max-width: 1024px) {
    width: 85%;
  }
  @media (max-width: 600px) {
    width: 95%;
  }
`;

export const IconButtonStyles = styled(IconButton)`
  position: absolute !important;
  top: 75% !important;
  transform: translateY(-75%) !important;
  left: 65% !important;
`;

export const SelectStyles = styled(Select2)`
  width: 100% !important;
`;

export const DateStyles = styled(KeyboardDatePicker)`
  .Mui-error {
    color: #f44336 !important;

    &::after {
      border-bottom: 1px solid #f44336 !important;
    }
  }
`;

export const SubIconButtonStyles = styled(IconButton)`
  font-size: 30px !important;
`;

export const TreeViewDropDown = styled(TreeSelect)`
  .ant-select-selector {
    border-bottom: 1px solid rgba(0, 0, 0, 0.42) !important;
    border-top: none !important ;
    border-left: none !important;
    border-right: none !important;
    width: 100%;
    padding: 0 !important;
  }
  .ant-select-arrow {
    font-size: 10px !important;
  }

  .ant-select-arrow {
    right: 3px !important;
  }

  .ant-select-selector {
    box-shadow: none !important;
  }
  .ant-select-selection-placeholder {
    color: rgba(0, 0, 0, 0.54) !important;
  }
`;
export const HeaderBar = styled.div`
  .subheader py-2 py-lg-4 {
    top: 0;
    width: 100%;
    position: fixed;
    z-index: 101;
  }
`;

export const IssueDropDown = styled(Select)`
  .ant-select-selector {
    border-bottom: 1px solid rgba(0, 0, 0, 0.42) !important;
    border-top: none !important ;
    border-left: none !important;
    border-right: none !important;
    width: 100%;
  }
  .ant-select-arrow {
    font-size: 10px !important;
  }

  .ant-select-arrow {
    right: 3px !important;
  }

  .ant-select-selector {
    box-shadow: none !important;
  }
  .ant-select-selection-placeholder {
    color: rgba(0, 0, 0, 0.54) !important;
  }
`;
