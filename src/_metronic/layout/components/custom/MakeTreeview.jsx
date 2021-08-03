import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect, useContext } from "react";
import TreeItem from "@material-ui/lab/TreeItem";
import Checkbox from "@material-ui/core/Checkbox";
import TreeView from "@material-ui/lab/TreeView";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";

export default function MakeTreeview({
  showTreeview,
  company_ID,
  checked,
  setEmployeeList,
  employeeList,
}) {
  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);
  const [treeviewValues, setTreeviewValues] = useState([]);
  const [final, setFinal] = useState({
    id: "0",
    name: "Select All Departments",
    children: [],
  });
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
    setTreeviewValues([]);
  }, [checked]);

  useEffect(() => {
    setFinal({
      id: "0",
      name: "Select All Departments",
      children: getUnique(),
    });

    function getUnique() {
      let vals = [];
      treeviewValues.forEach((v) => {
        vals[v.department_ID] ||
          (vals[v.department_ID] = {
            id: uuidv4(),
            department_ID: v.department_ID.toString(),
            name: v.department_Name,
            children: [],
          });

        vals[v.department_ID].children[v.section_ID] ||
          (vals[v.department_ID].children[v.section_ID] = {
            id: uuidv4(),
            section_ID: v.section_ID.toString(),
            name: v.section_Name,
            children: [],
          });

        vals[v.department_ID].children[v.section_ID].children.push({
          id: uuidv4(),
          employee_ID: v.employee_ID.toString(),
          name: v.employee_Name,
        });
      });

      vals = vals.filter((e) => !!e);
      let result = vals.map((e) => {
        e.children = e.children.filter((v) => !!v);
        return e;
      });

      return result;
    }
  }, [treeviewValues]);

  useEffect(() => {
    if (showTreeview) {
      fetch(`${server_path}api/employee?id=${company_ID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTreeviewValues(data);
        });
    }
  }, [server_path, company_ID, showTreeview, token]);

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

  function getOnChange(checked, nodes, final) {
    const allNode = getChildById(final, nodes.id);

    let array = checked
      ? [...selected, ...allNode]
      : selected.filter((value) => !allNode.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);
    let arr22 = [];
    final.children.forEach((department) => {
      if (Array.isArray(department.children)) {
        department.children.forEach((section) => {
          if (Array.isArray(section.children)) {
            section.children.forEach((e) => {
              if (array.includes(e.id)) {
                arr22.push(parseInt(e.employee_ID));
              }
            });
          }
        });
      }
    });

    setEmployeeList(arr22);

    setSelected(array);
  }

  function renderTree(nodes) {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <FormControlLabel
            control={
              <Checkbox
                checked={selected.some((item) => item === nodes.id)}
                onChange={(event) =>
                  getOnChange(event.currentTarget.checked, nodes, final)
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
  }

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={["0"]}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(final)}
    </TreeView>
  );
}
