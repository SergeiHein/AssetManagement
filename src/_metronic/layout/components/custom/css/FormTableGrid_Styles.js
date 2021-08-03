import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import TableSortLabel from "@material-ui/core/TableSortLabel";

export const EditableFormButtonStyles = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

export const EditableFormStyles = styled.form`
  .MuiFormLabel-asterisk {
    color: red;
  }

  .Mui-error {
    color: #f44336 !important;

    &::after {
      border-bottom: 1px solid #f44336 !important;
    }
  }
`;

export const EditableInputStyles = styled(TextField)`
  width: 100%;
`;

export const SelectStyles = styled(Select)`
  width: 100% !important;
`;

export const SortingStyles = styled(TableSortLabel)`
  .MuiTableSortLabel-active {
    color: rgba(0, 0, 0, 0.57);
  }
`;
