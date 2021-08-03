import Dialog from "@material-ui/core/Dialog";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

export const DialogStyles = styled(Dialog)`
  .MuiDialog-paper {
    padding: 0 0 15px 0;
  }

  .MuiDialog-paper {
    min-width: 400px !important;
    min-height: 400px !important;
    padding: 0px !important;
  }

  .extra-root {
    margin-bottom: 20px;
  }

  .MuiDialogContent-root {
    padding: 25px !important;
  }

  .MuiGrid-spacing-xs-3 {
    margin-right: 0px !important;
  }

  .MuiGrid-root {
    max-width: 100% !important;
    margin-bottom: 10px;
  }

  .MuiDialogContent-root {
    display: flex;
  }
`;

export const GridContainerStyles = styled(Grid)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 0px !important;

  .MuiFormControl-root {
    width: 100%;
  }
`;

export const FormStyles = styled.form`
  flex: 1;

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

export const SubmitBtn = styled(Button)`
  width: 100%;
`;
