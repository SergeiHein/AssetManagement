// import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const TableStyles = styled(Table)`
  min-width: 650px;

  &.sticky {
    overflow: scroll;

    .body {
      position: relative;
      z-index: 0;
    }

    .header {
      z-index: 100;
      height: 69.6px;
      width: fit-content;
      top: 0;
    }
  }

  th {
    text-align: center;
    transition: 300ms background;

    &.left-sticky-cell {
      border-right: 1px solid rgba(224, 224, 224, 0.3);
    }

    &.right-sticky-cell {
      border-left: 1px solid rgba(224, 224, 224, 0.3);
    }

    &.table-cell-default {
      min-width: 105px;
    }

    &.table-cell-c {
      min-width: 50px;
    }
    &.table-cell-actions {
      min-width: 130px;
      left: 87.2px !important;
    }

    &.global-filter-th {
      padding: 0 8px;
      :hover {
        background: unset;
      }
    }
  }

  td {
    text-align: center;

    &.left-sticky-cell {
      border-right: 1px solid rgba(224, 224, 224, 0.5);
      left: 0px !important;
    }

    &.right-sticky-cell {
      border-left: 1px solid rgba(224, 224, 224, 0.5);
    }

    :last-child {
      border-right: 0;
    }
  }

  td,
  th {
    background: #fff;
    overflow: hidden;
  }

  tbody tr:nth-child(odd) {
    background: #fdfdfd;
  }

  @media (max-width: 600px) {
    th {
      padding: 15px;
      &.table-cell-default {
      }
    }
  }
`;

export const CreateAssetLink = styled(Link)`
  transition: all 400ms;
  border-radius: 4px;

  &:hover {
    background: rgba(54, 153, 255, 1);

    span {
      color: #fff;
    }
  }
`;

export const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },

  tablecell: {
    padding: "15px",
    fontSize: "12px",
    color: "rgba(0, 0, 0, 0.57)",
  },
  select: {
    "& ul": {
      backgroundColor: "#cccccc",
    },
    "& label": {
      fontSize: 42,
    },
  },
}));

export const TableHeadSpan = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 16px;
    margin-left: 3px;
  }
`;

export const AddAssetWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TableOptionsWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const TableNavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TableNavRight = styled.div`
  display: flex;
  margin-bottom: 15px;
  flex-direction: row;

  justify-content: space-between;
  align-items: flex-end;
  max-width: 500px;
  width: 400px;
`;

export const PaginationStyles = styled.div`
  width: 300px;
  margin: ${(props) => (props.top ? "0" : "25px 0 0 auto")};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background: #fff;
  border-radius: 3px;
  box-shadow: rgba(82, 63, 105, 0.15) 0px 0px 50px 0px;
  margin: 25px auto;
  padding: 25px;
  height: 135px;

  @media (max-width: 1024px) {
    height: 180px;
  }
`;
