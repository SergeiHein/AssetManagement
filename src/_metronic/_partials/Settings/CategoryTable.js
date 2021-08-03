import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { appsetting } from "../../../envirment/appsetting";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TablePagination from "@material-ui/core/TablePagination";
import CategoryEdit from "./CategoryEdit";
import CreateIcon from "@material-ui/icons/Create";
import FormHelperText from "@material-ui/core/FormHelperText";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { TokenContext } from "../../../app/BasePage";
import moment from "moment";
import {
  SnackBarSave,
  SnackBarSaveError,
  SnackBarUpdate,
  SnackBarUpdateError,
  SnackBarDelete,
  SnackBarDeleteError,
} from "./SnackBar";

import {
  EditableFormStyles,
  SortingStyles,
} from "../../layout/components/custom/css/FormTableGrid_Styles";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";
import { NoSupplierDataText } from "../Requested/RequestedIndex_Styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const Bottomarea = styled.div`
  width: 100%;
`;

const LoadingStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding-top: 100px;

  div {
    margin-top: 7px;
  }
`;

const TreeViewarea = styled.div`
  margin: 10px auto 0 auto;
  width: 90%;
  display: flex;
  justify-content: space-between;
`;

const RightArea = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const LeftArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Buttonarea = styled.div`
  margin-bottom: 40px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const DeleteButton = styled(IconButton)`
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
const EditButton = styled(IconButton)`
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

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    boxShadow: "0 0 50px 0 rgba(82,63,105,0.15) !important",
  },
  formContainer: {
    boxShadow: "0 0 50px 0 rgba(82,63,105,0.15) !important",
    marginBottom: "30px",
    flexGrow: 1,
    background: "#fff",
  },
  type: {
    paddingBottom: 20,
    width: "90%",
  },
  table: {
    minWidth: 950,
  },

  savebtn: {
    height: "30px",
    width: "20%",
    color: "#fff",
  },
  cancelbtn: {
    marginLeft: "10px",
    height: "30px",
    width: "20%",
  },
  categoryId: {
    display: "none",
  },
  leftGrid: {
    display: "flex",
    flexDirection: "column",
  },
  RightGrid: {
    display: "flex",
    flexDirection: "column",
  },
  Select: {
    width: "90%",
    marginBottom: "20px",
  },
  tablehead: {
    color: "rgba(0, 0, 0, 0.57)",
    padding: "20px",
    fontSize: "14px",
    alignItems: "center",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  sortinghead: {
    color: "rgba(0, 0, 0, 0.57)",
    padding: "20px",
    fontSize: "14px",
    alignItems: "center",
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "category_Name",
    numeric: false,
    disablePadding: false,
    label: "Asset Category Name",
  },
  { id: "type_ID", numeric: false, disablePadding: false, label: "Asset Type" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            className={classes.sortinghead}
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <SortingStyles
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                paddingLeft: "10px",
              }}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </SortingStyles>
          </TableCell>
        ))}
        <TableCell align="center" className={classes.tablehead}>
          Tag Prefix
        </TableCell>
        <TableCell align="center" className={classes.tablehead}>
          Tag Length
        </TableCell>
        <TableCell align="center" className={classes.tablehead}>
          Tag Format
        </TableCell>
        <TableCell align="center" className={classes.tablehead}>
          Next Increment No
        </TableCell>
        <TableCell align="center" className={classes.tablehead}>
          Active
        </TableCell>
        <TableCell align="center" className={classes.tablehead}>
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,

  onRequestSort: PropTypes.func.isRequired,

  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function Alert(props) {
  return <MuiAlert elevation={2} variant="filled" {...props} />;
}

export default function CategoryTable(props) {
  const classes = useStyles();
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [added, setAdded] = useState(false);
  const [helperNameText, SethelperNameText] = useState();
  const [NameError, setNameError] = useState(false);
  const [TypeError, setTypeError] = useState(false);
  const [treeviewerror, setTreeviewError] = useState(false);
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));

  const [loading, setLoading] = useState(true);
  const [showErrTable, setShowErrTable] = useState(false);

  const [SelectApi, setSelectApi] = useState([]);

  useEffect(() => {
    fetch(`${server_path}api/assettype/AssetTypeDropdownList`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSelectApi(data));
  }, [server_path, token]);

  const [GetApi, setGetApi] = useState([]);

  const [newData, setNewData] = useState({
    category_ID: 0,
    category_Name: "",
    type_ID: "",
    active: true,
    generate_Code: false,
    tag_Prefix: "",
    tag_Length: 0,
    tag_Next_Increment_No: 0,
    tag_Format: 0,
    isSystem_Defined: false,
    status_Details: [],
  });

  const [SelectData, setSelectData] = useState("");

  function handleChange() {
    setNewData((prevProps) => ({
      ...prevProps,
      generate_Code: !prevProps.generate_Code,
    }));
  }

  function handleActive() {
    setNewData((prevProps) => ({ ...prevProps, active: !prevProps.active }));
  }

  useEffect(() => {
    if (props.location.state) {
      let auditObj = {
        action_By: parseInt(empID),
        event: "View",
        asset_Detail_ID: "0",
        asset_Location_ID: 0,
        asset_ID: 0,
        activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
        assetObject: [],
        categoryObjects: null,
        brandObject: null,
        supplierObject: null,
        typeObject: null,
        statusObject: null,
        locationObject: null,
        allocationObject: [],
        description: "Category page",
        requestObject: null,
      };

      fetch(`${server_path}api/AuditTrial`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auditObj),
      });
    }
  }, [empID, server_path, token, props.location.state]);

  useEffect(() => {
    fetch(`${server_path}api/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setShowErrTable(true);
          setLoading(false);
          setGetApi(data);
          return;
        }
        setGetApi(data);
        setShowErrTable(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setShowErrTable(true);
      });
  }, [server_path, token, added]);

  const [updatedata, Setupdatedata] = useState();
  const EditRow = GetApi.find((data) => data.category_ID === updatedata);

  const [Editdata, SetEditdata] = useState(false);
  const [treeviewValues, setTreeviewValues] = useState([]);
  const [Audit, setAudit] = useState([]);
  const [SubAudit, setSubAudit] = useState([]);
  const [final, setFinal] = useState({
    id: "0",
    name: "Select All Status",
    children: getUnique(),
  });

  useEffect(() => {
    fetch(`${server_path}api/statustreeview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTreeviewValues(data);
      });
  }, [server_path, token]);

  const [Postsuccess, Setpostsuccess] = useState(false);
  const [PostError, setposterror] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClear = () => {
    setOpen(false);
  };

  const [SelectDel, setSelectDel] = useState({});
  const [Delopen, setDelOpen] = React.useState(false);

  const CheckDel = () => {
    setDelOpen(false);
  };

  const [UpdateDelOpen, setUpdateDelOpen] = useState(false);

  const handleUpddateDel = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateDelOpen(false);
  };

  const [selected, setSelected] = useState([]);
  const [CheckDelOpen, setCheckDelOpen] = React.useState(false);

  const CheckDelClose = () => {
    setCheckDelOpen(false);
  };

  useEffect(() => {
    setFinal({
      id: "0",
      name: "Select All Status",
      children: getUnique(),
    });
  }, [treeviewValues]);

  function getChildById(node, id) {
    let array = [];

    function getAllChild(nodes) {
      if (nodes === null) return [];
      array.push(nodes.id);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    function getNodeById(nodes, id) {
      if (nodes.id === id) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach((node) => {
          if (!!getNodeById(node, id)) {
            result = getNodeById(node, id);
          }
        });
        return result;
      }

      return null;
    }

    return getAllChild(getNodeById(node, id));
  }

  function getUnique() {
    let vals = [];
    treeviewValues.map((v) => {
      vals[v.statusType_ID] ||
        (vals[v.statusType_ID] = {
          id: uuidv4(),
          statusType_ID: v.statusType_ID.toString(),
          name: v.statusType_Name,
          children: [],
        });

      vals[v.statusType_ID].children[v.status_ID] ||
        (vals[v.statusType_ID].children[v.status_ID] = {
          id: uuidv4(),
          status_ID: v.status_ID.toString(),
          name: v.status_Name,
          children: [],
        });
      return null;
    });

    vals = vals.filter((e) => !!e);
    let result = vals.map((e) => {
      e.children = e.children.filter((v) => !!v);
      return e;
    });
    return result;
  }
  function getOnChange(checked, nodes) {
    let ArrayAudit = [];
    let ChildAudit = [];
    const allNode = getChildById(final, nodes.id);
    let array = checked
      ? [...selected, ...allNode]
      : selected.filter((value) => !allNode.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);
    let arr22 = [];

    final.children.find((type) => {
      if (array.includes(type.id)) {
        ArrayAudit.push(type.name);
      }
      setAudit(ArrayAudit);

      if (Array.isArray(type.children)) {
        type.children.find((condition) => {
          if (array.includes(condition.id)) {
            arr22.push(condition.status_ID);
            ChildAudit.push(condition.name);
          }
          setSubAudit(ChildAudit);

          return null;
        });
      }

      return null;
    });
    setSelected(array);

    let obj = {
      categoryStatus_ID: 0,
      category_ID: 0,
      status_ID: 0,
    };
    let statusDetails = arr22.map((ary) => ({ ...obj, status_ID: ary }));
    setNewData((prevProps) => ({
      ...prevProps,
      status_Details: statusDetails,
    }));
  }

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <FormControlLabel
          control={
            <Checkbox
              checked={selected.some((item) => item === nodes.id)}
              onChange={(event) =>
                getOnChange(event.currentTarget.checked, nodes)
              }
              onClick={(e) => e.stopPropagation()}
            />
          }
          label={<>{nodes.name}</>}
          key={nodes.id}
        />
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  function handleonSubmit(e) {
    e.preventDefault();
    let AuditData;
    const checking = GetApi.filter(
      (item) =>
        item.category_Name === newData.category_Name &&
        item.type_ID === newData.type_ID
    );

    if (newData.category_Name === "") {
      setNameError(true);
      SethelperNameText("*Category cannot be empty");
    } else {
      setNameError(false);
      SethelperNameText("");
      if (newData.type_ID === "") {
        setTypeError(true);
      } else {
        setTypeError(false);
        if (newData.status_Details.length === 0) {
          setTreeviewError(true);
        } else {
          setTreeviewError(false);
          if (checking.length > 0) {
            setOpen(true);
          } else {
            fetch(`${server_path}api/category`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                category_ID: newData.category_ID,
                category_Name: newData.category_Name,
                type_ID: newData.type_ID,
                tag_Prefix: newData.tag_Prefix,
                tag_Length: newData.tag_Length,
                tag_Next_Increment_No: newData.tag_Next_Increment_No,
                tag_Format: newData.tag_Format,
                active: newData.active,
                generate_Code: newData.generate_Code,
                isSystem_Defined: newData.isSystem_Defined,
                status_Details: newData.status_Details,
                created_By: parseInt(empID),
                modified_By: 0,
              }),
            }).then((res) => {
              if (res.status === 200) {
                setAdded(!added);
                setGetApi([...GetApi, newData]);
                Setpostsuccess(true);

                if (Audit.length === 3) {
                  AuditData = {
                    activity_Date: moment(new Date()).format(
                      "DD/MM/YYYY hh:mm:ss"
                    ),
                    action_By: parseInt(empID),
                    event: "Entry",
                    asset_Detail_ID: "0",
                    asset_ID: 0,
                    assetLocation_ID: 0,
                    description: "",
                    assetObject: [],
                    categoryObjects: {
                      categoryName: newData.category_Name,
                      tagPrefix: newData.tag_Prefix,
                      active: `${newData.active}`,
                      treeView: "User Selected All status",
                    },
                    brandObject: null,
                    supplierObject: null,
                    typeObject: null,
                    statusObject: null,
                    locationObject: null,
                    allocationObject: [],
                    requestObject: null,
                  };
                } else if (Audit.length > 0) {
                  AuditData = {
                    activity_Date: moment(new Date()).format(
                      "DD/MM/YYYY hh:mm:ss"
                    ),
                    action_By: parseInt(empID),
                    event: "Entry",
                    asset_Detail_ID: "0",
                    asset_ID: 0,
                    assetLocation_ID: 0,
                    description: "",
                    assetObject: [],
                    categoryObjects: {
                      categoryName: newData.category_Name,
                      tagPrefix: newData.tag_Prefix,
                      active: `${newData.active}`,
                      treeView: Audit.join(","),
                    },
                    brandObject: null,
                    supplierObject: null,
                    typeObject: null,
                    statusObject: null,
                    locationObject: null,
                    allocationObject: [],
                    requestObject: null,
                  };
                } else if (SubAudit.length > 0) {
                  AuditData = {
                    activity_Date: moment(new Date()).format(
                      "DD/MM/YYYY hh:mm:ss"
                    ),
                    action_By: parseInt(empID),
                    event: "Entry",
                    asset_Detail_ID: "0",
                    asset_ID: 0,
                    assetLocation_ID: 0,
                    description: "",
                    assetObject: [],
                    categoryObjects: {
                      categoryName: newData.category_Name,
                      tagPrefix: newData.tag_Prefix,
                      active: `${newData.active}`,
                      treeView: SubAudit.join(","),
                    },
                    brandObject: null,
                    supplierObject: null,
                    typeObject: null,
                    statusObject: null,
                    locationObject: null,
                    allocationObject: [],
                    requestObject: null,
                  };
                }
                fetch(`${server_path}api/AuditTrial`, {
                  method: "POST",

                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(AuditData),
                });
              } else {
                setposterror(true);
              }
            });

            setNewData({
              category_ID: 0,
              category_Name: "",
              type_ID: "",
              active: true,
              generate_Code: false,
              tag_Prefix: "",
              tag_Length: 0,
              tag_Next_Increment_No: 0,
              tag_Format: 0,
              status_Details: [],
              isSystem_Defined: false,
            });
            setSelected([]);
            SethelperNameText("");
            setNameError(false);
            setTreeviewError(false);
            setTypeError(false);
          }
        }
      }
    }
  }

  function handleonClear() {
    setNewData({
      category_ID: 0,
      category_Name: "",
      type_ID: "",
      active: true,
      generate_Code: false,
      tag_Prefix: "",
      tag_Length: 0,
      tag_Next_Increment_No: 0,
      tag_Format: 0,
      isSystem_Defined: false,
      status_Details: [],
    });
    setSelected([]);
    setSelectData("");
    SethelperNameText("");
    setNameError(false);
    setTypeError(false);
    setTreeviewError(false);
  }
  const [DelSuccess, SetdelSuccess] = useState(false);
  const [DelError, SetdelError] = useState(false);
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [UpdateError, setUpdateError] = useState(false);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("AssetName");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function HandleDelete(data) {
    let DeleteAuditData;
    const selectedRow = GetApi.find((row) => row.category_ID === data.ID);

    fetch(`${server_path}api/category/${selectedRow.category_ID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        DeleteAuditData = {
          activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
          action_By: parseInt(empID),
          event: "Delete",
          asset_Detail_ID: "0",
          asset_ID: 0,
          assetLocation_ID: 0,
          description: "",
          assetObject: [],
          categoryObjects: {
            categoryName: selectedRow.category_Name,
            tagPrefix: "",
            active: "",
            treeView: "",
          },
          brandObject: null,
          supplierObject: null,
          typeObject: null,
          statusObject: null,
          locationObject: null,
          allocationObject: [],
          requestObject: null,
        };

        fetch(`${server_path}api/AuditTrial`, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(DeleteAuditData),
        });

        const array = [...GetApi];
        const index = array.indexOf(selectedRow);
        array.splice(index, 1);
        setGetApi(array);

        SetdelSuccess(true);
        setDelOpen(false);
        SetdelError(false);
      } else {
        SetdelError(true);
      }
    });
  }

  const typeArray = SelectApi.filter((val) => {
    return GetApi.some((item) => {
      return item.type_ID === val.type_ID;
    });
  });

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" className={classes.formContainer}>
        {Editdata ? (
          <CategoryEdit
            EditRow={EditRow}
            setGetApi={setGetApi}
            SelectApi={SelectApi}
            updatedata={updatedata}
            setUpdateSuccess={setUpdateSuccess}
            setUpdateError={setUpdateError}
            SetEditdata={SetEditdata}
          />
        ) : (
          <EditableFormStyles>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} className={classes.leftGrid}>
                <TextField
                  required
                  id="Asset Category Name"
                  label="Asset Category Name"
                  helperText={helperNameText}
                  error={NameError}
                  className={classes.type}
                  value={newData.category_Name}
                  onChange={(e) => {
                    setNewData({
                      ...newData,
                      category_Name: e.target.value,
                    });
                    setNameError(false);
                    SethelperNameText("");
                  }}
                />
                <TextField
                  id="Tag Prefix"
                  label="Tag Prefix(optional)"
                  className={classes.type}
                  value={newData.tag_Prefix}
                  onChange={(e) =>
                    setNewData({
                      ...newData,
                      tag_Prefix: e.target.value,
                    })
                  }
                />
                <TextField
                  id="Tag Length"
                  label="Tag Length"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  className={classes.type}
                  value={newData.tag_Length}
                  onChange={(e) =>
                    setNewData({
                      ...newData,
                      tag_Length: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} className={classes.RightGrid}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Asset Type</InputLabel>
                  <Select
                    className={classes.Select}
                    error={TypeError}
                    value={newData.type_ID}
                    onChange={(e) => {
                      setNewData({
                        ...newData,
                        type_ID: e.target.value,
                      });
                      setSelectData(e.target.value);
                      setTypeError(false);
                    }}
                  >
                    {SelectApi.map((row) => (
                      <MenuItem key={row.type_ID} value={row.type_ID}>
                        {row.type_Name}
                      </MenuItem>
                    ))}
                  </Select>
                  {TypeError && (
                    <FormHelperText
                      color="primary"
                      style={{
                        marginTop: "-18px",
                        marginBottom: "20px",
                        color: "#f44336",
                      }}
                    >
                      *Asset Type cannot be Empty
                    </FormHelperText>
                  )}
                </FormControl>
                <TextField
                  id="Tag Format"
                  label="Tag Format"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  className={classes.type}
                  value={newData.tag_Format}
                  onChange={(e) =>
                    setNewData({
                      ...newData,
                      tag_Format: e.target.value,
                    })
                  }
                />
              </Grid>

              <Bottomarea>
                <TreeViewarea>
                  <RightArea>
                    <TreeView
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpanded={[""]}
                      defaultExpandIcon={<ChevronRightIcon />}
                    >
                      {renderTree(final)}
                    </TreeView>
                    {treeviewerror ? (
                      <FormHelperText
                        style={{
                          color: " #f44336",
                        }}
                      >
                        *Status Type cannot be Empty
                      </FormHelperText>
                    ) : null}
                  </RightArea>
                  <LeftArea>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newData.generate_Code}
                          onChange={handleChange}
                          style={{
                            float: "right",
                          }}
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      }
                      label="Auto Increment No"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newData.active}
                          onChange={handleActive}
                          style={{
                            float: "left",
                          }}
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      }
                      label="Active"
                      labelPlacement="start"
                    />
                  </LeftArea>
                </TreeViewarea>

                <Buttonarea>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.savebtn}
                    onClick={handleonSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    color="secondary"
                    className={classes.cancelbtn}
                    onClick={handleonClear}
                  >
                    Cancel
                  </Button>
                </Buttonarea>
              </Bottomarea>
            </Grid>
          </EditableFormStyles>
        )}
        <Dialog
          open={open}
          onClose={handleClear}
          style={{
            marginLeft: 250,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              There is a duplicate record for this asset type and category.
              Please check and try again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClear} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <Container maxWidth="xl">
        {loading ? (
          <LoadingStyle>
            <CircularProgress />
            <div>Loading ..</div>
          </LoadingStyle>
        ) : showErrTable ? (
          <NoSupplierDataText>
            There is no information to display
          </NoSupplierDataText>
        ) : (
          <TableContainer component={Paper} className={classes.Tcontainer}>
            <Table className={classes.table} aria-label="simple table">
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />

              <TableBody>
                {stableSort(GetApi, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row.category_ID}>
                      <TableCell align="center" className={classes.categoryId}>
                        {Number(row.category_ID)}
                      </TableCell>
                      <TableCell align="center">{row.category_Name}</TableCell>
                      {typeArray.length === 0 ? (
                        <TableCell align="center"></TableCell>
                      ) : (
                        typeArray.map(
                          (subrow) =>
                            subrow.type_ID === row.type_ID && (
                              <TableCell key={subrow.type_ID} align="center">
                                {subrow.type_Name}
                              </TableCell>
                            )
                        )
                      )}
                      {/* {SelectApi.map((subrow) =>
                          row.type_ID === subrow.type_ID ? (
                            <TableCell
                              align="center"
                              key={subrow.type_ID}
                              className={classes.thead}
                            >
                              {subrow.type_Name}
                            </TableCell>
                          ) : null
                        )} */}
                      <TableCell align="center">{row.tag_Prefix}</TableCell>
                      <TableCell align="center">{row.tag_Length}</TableCell>
                      <TableCell align="center">{row.tag_Format}</TableCell>
                      <TableCell align="center">
                        {row.tag_Next_Increment_No}
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={row.active}
                          color="secondary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />
                      </TableCell>
                      {row.isSystem_Defined ? (
                        <TableCell
                          align="center"
                          style={{
                            minWidth: "120px",
                          }}
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              color: "grey",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              Setupdatedata(row.category_ID);
                              SetEditdata(true);
                              setAdded(true);
                            }}
                          >
                            <Tooltip title="Edit Row">
                              <EditButton
                                aria-label="Edit"
                                style={{
                                  marginLeft: "41px",
                                }}
                              >
                                <CreateIcon fontSize="small" />
                              </EditButton>
                            </Tooltip>
                          </span>
                        </TableCell>
                      ) : Editdata ? (
                        <TableCell
                          align="center"
                          style={{
                            minWidth: "120px",
                          }}
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              color: "#353535",
                              textDecoration: "underline",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              setUpdateDelOpen(true);
                            }}
                          >
                            <Tooltip title="Delete Row">
                              <DeleteButton aria-label="delete">
                                <DeleteIcon fontSize="small" />
                              </DeleteButton>
                            </Tooltip>
                          </span>
                          <span
                            style={{
                              cursor: "pointer",
                              color: "grey",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              Setupdatedata(row.category_ID);
                              SetEditdata(true);
                              setAdded(true);
                              window.scroll(0, 0);
                            }}
                          >
                            <Tooltip title="Edit Row">
                              <EditButton aria-label="Edit">
                                <CreateIcon fontSize="small" />
                              </EditButton>
                            </Tooltip>
                          </span>
                        </TableCell>
                      ) : (
                        <TableCell
                          align="center"
                          style={{
                            minWidth: "120px",
                          }}
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              color: "#353535",
                              textDecoration: "underline",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              if (
                                row.eMessage ===
                                "Category Name already used in Asset Form."
                              ) {
                                setCheckDelOpen(true);
                              } else {
                                setDelOpen(true);
                              }
                              setSelectDel({ ID: row.category_ID });
                            }}
                          >
                            <Tooltip title="Delete Row">
                              <DeleteButton aria-label="delete">
                                <DeleteIcon fontSize="small" />
                              </DeleteButton>
                            </Tooltip>
                          </span>
                          <span
                            style={{
                              cursor: "pointer",
                              color: "grey",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              Setupdatedata(row.category_ID);
                              SetEditdata(true);
                              setAdded(true);
                              window.scroll(0, 0);
                            }}
                          >
                            <Tooltip title="Edit Row">
                              <EditButton aria-label="Edit">
                                <CreateIcon fontSize="small" />
                              </EditButton>
                            </Tooltip>
                          </span>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {loading || showErrTable ? null : (
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={GetApi.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
        <Dialog
          open={Delopen}
          onClose={CheckDel}
          style={{
            marginLeft: 250,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will stop adding asset under this category and also stop
              generating Asset Tag. Do you wish to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => HandleDelete(SelectDel)}
              color="primary"
              autoFocus
            >
              Yes
            </Button>

            <Button onClick={CheckDel} color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={CheckDelOpen}
          onClose={CheckDelClose}
          style={{
            marginLeft: 250,
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This category is in used. You cannot remove this category.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={CheckDelClose} color="primary" autoFocus>
              Okay
            </Button>
          </DialogActions>
        </Dialog>

        {Postsuccess ? (
          <SnackBarSave
            Postsuccess={Postsuccess}
            Setpostsuccess={Setpostsuccess}
          ></SnackBarSave>
        ) : (
          ""
        )}
        {PostError ? (
          <SnackBarSaveError
            PostError={PostError}
            setposterror={setposterror}
          ></SnackBarSaveError>
        ) : (
          ""
        )}
        {UpdateSuccess ? (
          <SnackBarUpdate
            UpdateSuccess={UpdateSuccess}
            setUpdateSuccess={setUpdateSuccess}
          ></SnackBarUpdate>
        ) : (
          ""
        )}
        {UpdateError ? (
          <SnackBarUpdateError
            UpdateError={UpdateError}
            setUpdateError={setUpdateError}
          ></SnackBarUpdateError>
        ) : (
          ""
        )}

        {DelSuccess ? (
          <SnackBarDelete
            DelSuccess={DelSuccess}
            SetdelSuccess={SetdelSuccess}
          ></SnackBarDelete>
        ) : (
          ""
        )}
        {DelError ? (
          <SnackBarDeleteError
            DelError={DelError}
            SetdelError={SetdelError}
          ></SnackBarDeleteError>
        ) : (
          ""
        )}
        {UpdateDelOpen ? (
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            open={UpdateDelOpen}
            autoHideDuration={3000}
            onClose={handleUpddateDel}
          >
            <Alert onClose={handleUpddateDel} severity="error">
              You cannot delete this record while updating!
            </Alert>
          </Snackbar>
        ) : (
          ""
        )}
      </Container>
    </React.Fragment>
  );
}
