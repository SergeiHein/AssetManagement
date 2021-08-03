import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { v4 as uuidv4 } from "uuid";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import moment from "moment";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";

const TreeViewarea = styled.div`
  margin: 20px auto 0 auto;
  width: 90%;
  display: flex;
  justify-content: space-between;
`;

const RightArea = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const LeftArea = styled.div``;

const Bottomarea = styled.div`
  width: 100%;
`;
const Checkarea = styled.div`
  margin: 20px auto 0 auto;
  width: 90%;
  display: flex;
  justify-content: space-between;
`;
const Buttonarea = styled.div`
  margin-bottom: 40px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const useStyles = makeStyles({
  Donebtn: {
    minWidth: 20,
  },
  Clearbtn: {
    minWidth: 20,
    marginLeft: 10,
  },
  type: {
    paddingBottom: 20,
    width: "90%",
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
    padding: "25px",
    fontSize: "14px",
  },
});

export default function CategoryEdit({
  EditRow,
  setGetApi,
  SelectApi,
  updatedata,
  SetEditdata,
  setUpdateSuccess,
  setUpdateError,
}) {
  const classes = useStyles();
  const [GetData, SetGetData] = useState({ ...EditRow });
  const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));
  const [OriData, setOriData] = useState([]);
  const [EditAudit, setEditAudit] = useState([]);
  const [SubEditAudit, setSubEditAudit] = useState([]);

  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);

  const [selected, setSelected] = useState([]);

  const [EditApi, setEditApi] = useState();

  const [treeviewValues, setTreeviewValues] = useState([]);
  const [final, setFinal] = useState({
    id: "0",
    name: "Select All Status",
    children: getUnique(),
  });

  useEffect(() => {
    setFinal({
      id: "0",
      name: "Select All Status",
      children: getUnique(),
    });
  }, [treeviewValues]);

  useEffect(() => {
    fetch(`${server_path}api/statustreeview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTreeviewValues(data));
  }, [server_path, token]);

  useEffect(() => {
    fetch(`${server_path}api/category/${updatedata}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEditApi(data.status_Details);
      });
  }, [server_path, updatedata, token]);

  useEffect(() => {
    let EditArray = [];
    let arr = [];
    let arr23 = [];
    EditApi &&
      EditApi.map((one) => {
        arr.push(`${one.status_ID}`);
      });
    final.children &&
      final.children.find((val) => {
        if (Array.isArray(val.children)) {
          val.children.find((status) => {
            if (arr.includes(status.status_ID)) {
              arr23.push(status.id);
              EditArray.push(status.name);

              arr.map((checkedData) => {
                if (checkedData.id === val.children.id) {
                  arr23.push(val.id);
                }
                return null;
              });
            }
            return null;
          });
        }
        return null;
      });

    arr23 = arr23.filter((val, i) => {
      return arr23.indexOf(val) === i;
    });
    setSelected(arr23);
    setOriData(EditArray);
  }, [EditApi, final.children]);

  useEffect(() => {
    SetGetData(EditRow);
  }, [EditRow]);

  function handleActiveUpdate() {
    SetGetData((prevProps) => ({ ...prevProps, active: !prevProps.active }));
  }

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
    const allNode = getChildById(final, nodes.id);
    let ArrayAudit = [];
    let ChildAudit = [];
    let array = checked
      ? [...selected, ...allNode]
      : selected.filter((value) => !allNode.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);
    let arr22 = [];
    final.children.find((type) => {
      if (array.includes(type.id)) {
        ArrayAudit.push(type.name);
      }
      setEditAudit(ArrayAudit);
      if (Array.isArray(type.children)) {
        type.children.find((condition) => {
          if (array.includes(condition.id)) {
            arr22.push(condition.status_ID);
            ChildAudit.push(condition.name);
          }
          setSubEditAudit(ChildAudit);
          return null;
        });
      }
      return null;
    });

    let obj = {
      categoryStatus_ID: 0,
      category_ID: 0,
      status_ID: 0,
    };
    let statusDetails = arr22.map((ary) => ({ ...obj, status_ID: ary }));
    SetGetData((prevState) => ({
      ...prevState,
      status_Details: statusDetails,
    }));
    setSelected(array);
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

  function EditHandler() {
    let AuditData;
    fetch(`${server_path}api/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(GetData),
    }).then((res) => {
      if (res.status === 200) {
        fetch(`${server_path}api/category`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setGetApi(data));

        if (EditAudit.length === 3) {
          AuditData = {
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            action_By: parseInt(empID),
            event: "Edit",
            asset_Detail_ID: "0",
            asset_ID: 0,
            assetLocation_ID: 0,
            description: "",
            assetObject: [],
            categoryObjects: {
              categoryName: GetData.category_Name,
              tagPrefix: GetData.tag_Prefix,
              active: `${EditRow.active} to ${GetData.active}`,
              treeView: "User Selected all status",
            },
            brandObject: null,
            supplierObject: null,
            typeObject: null,
            statusObject: null,
            locationObject: null,
            allocationObject: [],
            requestObject: null,
          };
        } else if (EditAudit.length > 0) {
          AuditData = {
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            action_By: parseInt(empID),
            event: "Edit",
            asset_Detail_ID: "0",
            asset_ID: 0,
            assetLocation_ID: 0,
            description: "",
            assetObject: [],
            categoryObjects: {
              categoryName: GetData.category_Name,
              tagPrefix: GetData.tag_Prefix,
              active: `${EditRow.active} to ${GetData.active}`,
              treeView: `${OriData.join(",")} to ${EditAudit.join(",")} `,
            },
            typeObject: null,
            statusObject: null,
            locationObject: null,
            allocationObject: [],
            requestObject: null,
            brandObject: null,
            supplierObject: null,
          };
        } else if (SubEditAudit.length > 0) {
          AuditData = {
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            action_By: parseInt(empID),
            event: "Edit",
            asset_Detail_ID: "0",
            asset_ID: 0,
            assetLocation_ID: 0,
            description: "",
            assetObject: [],
            categoryObjects: {
              categoryName: GetData.category_Name,
              tagPrefix: GetData.tag_Prefix,
              active: `${EditRow.active} to ${GetData.active}`,
              treeView: `${OriData.join(",")} to ${SubEditAudit.join(",")} `,
            },
            brandObject: null,
            supplierObject: null,
            typeObject: null,
            statusObject: null,
            locationObject: null,
            allocationObject: [],
            requestObject: null,
          };
        } else {
          AuditData = {
            activity_Date: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
            action_By: parseInt(empID),
            event: "Edit",
            asset_Detail_ID: "0",
            asset_ID: 0,
            assetLocation_ID: 0,
            description: "",
            assetObject: [],
            categoryObjects: {
              categoryName: GetData.category_Name,
              tagPrefix: GetData.tag_Prefix,
              active: `${EditRow.active} to ${GetData.active}`,
              treeView: `${OriData.join(",")} `,
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
        setUpdateSuccess(true);
      } else {
        setUpdateError(true);
      }
      SetEditdata(false);
    });
  }
  function handleonClearUpdate() {
    SetEditdata(false);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} className={classes.leftGrid}>
        <TextField
          disabled
          id="Category Name"
          label="Category Name"
          className={classes.type}
          value={GetData.category_Name}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              category_Name: e.target.value,
            })
          }
        />
        <TextField
          disabled
          id="Tag Prefix"
          label="Tag Prefix"
          className={classes.type}
          value={GetData.tag_Prefix}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              tag_Prefix: e.target.value,
            })
          }
        />
        <TextField
          disabled
          id="Tag Length"
          label="Tag Length"
          type="number"
          className={classes.type}
          value={GetData.tag_Length}
          onChange={(e) =>
            SetGetData({
              ...GetData,
              tag_Length: e.target.value,
            })
          }
        />
      </Grid>
      <Grid item xs={12} sm={6} className={classes.RightGrid}>
        <FormControl required className={classes.formControl}>
          <InputLabel>Asset Type</InputLabel>
          <Select
            disabled
            className={classes.Select}
            value={GetData.type_ID}
            onClick={(e) =>
              SetGetData({
                ...GetData,
                type_ID: e.target.value,
              })
            }
          >
            {SelectApi.map((row) => (
              <MenuItem key={row.type_ID} value={row.type_ID}>
                {row.type_Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          disabled
          id="Tag Format"
          label="Tag Format"
          type="number"
          className={classes.type}
          value={GetData.tag_Format}
          onChange={(e) =>
            SetGetData({
              ...GetData,
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
              defaultExpanded={["0"]}
              defaultExpandIcon={<ChevronRightIcon />}
            >
              {renderTree(final)}
            </TreeView>
          </RightArea>
          <LeftArea>
            <FormControlLabel
              control={
                <Checkbox
                  checked={GetData.generate_Code}
                  style={{
                    float: "left",
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label="Auto Increment No"
              labelPlacement="start"
            />
          </LeftArea>
        </TreeViewarea>
        <Checkarea>
          <FormControlLabel
            control={
              <Checkbox
                checked={GetData.isSystem_Defined}
                style={{
                  float: "right",
                }}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="System Defined"
            labelPlacement="end"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={GetData.active}
                onChange={handleActiveUpdate}
                style={{
                  float: "left",
                }}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="Active"
            labelPlacement="start"
          />
        </Checkarea>

        <Buttonarea>
          <Button
            variant="contained"
            color="primary"
            className={classes.savebtn}
            onClick={EditHandler}
          >
            Update
          </Button>
          <Button
            color="secondary"
            className={classes.cancelbtn}
            onClick={handleonClearUpdate}
          >
            Cancel
          </Button>
        </Buttonarea>
      </Bottomarea>
      {/* </form> */}
    </Grid>
  );
}
