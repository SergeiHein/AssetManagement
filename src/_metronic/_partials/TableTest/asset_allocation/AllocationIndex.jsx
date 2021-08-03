import React, { useState, useMemo, useEffect, useContext } from "react";
import { useSubheader } from "../../../layout";
import MakeTable from "../../../layout/components/custom/MakeTable";
import MakeAllocationData from "./MakeAllocationData";
import IconButton from "@material-ui/core/IconButton";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Tooltip from "@material-ui/core/Tooltip";
import styled from "styled-components";
import { Link,useLocation } from "react-router-dom";
import { TokenContext } from "../../../../app/BasePage";
import { appsetting } from "../../../../envirment/appsetting";
import { Styles } from "../../Requested/RequestedIndex_Styles";
import moment from "moment";

const DetailStyles = styled(IconButton)`
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

export default function AllocationIndex(props) {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Asset Allocation");

  const [oriData, setOriData] = useState([]);
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);
  const [Added, setAdded] = useState(false);
  // const [showErrTable, setShowErrTable] = useState(false);
  const [loading, setLoading] = useState({
    finish: false,
    success: null,
  });
  const [AllocationApiValues, setAllocationApiValues] = useState([]);

  // view audit function

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
        description: "Asset Allocation page",
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
  }, [empID, props.location.state, server_path, token]);

  useEffect(() => {
    setOriData(MakeAllocationData(AllocationApiValues));
  }, [AllocationApiValues]);

  // get api values for table
  const location = useLocation();
  const GetUserID=location.state?location.state.module_ID:'Null';
  let filterData;
  useEffect(() => {
  //   const urlList = [
  //     `${server_path}api/Allocation?empID=${empID}`, // 50 
  //     `${server_path}api/requestable/menus?empId=${empID}&ModuleId=${GetUserID}`
  //   ]
  //   const requestsList = urlList.map((url) =>
  //     fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //   );
  //   Promise.all(requestsList)
  //   .then((res) => Promise.all(res.map((req) => req.json())))
  //   .then((arr) => {
     

  //     let AllEmpList= arr[0];
  //    let FilterListData = arr[1];
  //     let newFilterList =[];

  //     for(let i=0;i<FilterListData.length;i++){

  //       for(let j=0;j<AllEmpList.length;j++){
  //         if(FilterListData[i].employee_ID===AllEmpList[j].request_ID){
  //           if(AllEmpList[j].requests===1){
  //             // let findRecord={...AllEmpList[j],...FilterListData[i]}
  //             // newFilterList.push(findRecord)
  //           newFilterList.push(AllEmpList[j])
  //           }
  //         }
  //       }
  //  }
 
  //     // if (!data || data.length === 0) {
  //     //   // setShowErrTable(true);
  //     //   setAllocationApiValues(newFilterList);
  //     //   setLoading({ finish: true, success: false });
  //     //   return;
  //     // }
  //     setAllocationApiValues(newFilterList);
  //     setAdded(true);
  //     setLoading({ finish: true, success: true });


  //     console.log(arr[0],arr[1],newFilterList)
      
  //   })
  //   .catch((err) => {
  //     console.log(err)

  //   })
    fetch(`${server_path}api/Allocation?empID=${empID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
           //setShowErrTable(true);
          
          setAllocationApiValues(data);
          setLoading({ finish: true, success: false });
          return;
        }
        setAllocationApiValues(data);
        setAdded(true);
        setLoading({ finish: true, success: true });
        // setShowErrTable(false);
      })
      .catch((err) => {
        setLoading({ finish: true, success: false });
        // setShowErrTable(true);
      });
  }, [server_path, token, Added]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Actions",
        id: "actions",
        Cell: (tableProps) => {
          return (
            <>
                {console.log(tableProps)}
              <Link
                to={{
                  pathname: "asset-allocation/asset-allocation-edit",
                  state: {
                    request_ID: tableProps.row.original.request_ID,
                    issue_ID: tableProps.row.original.issue_ID,
                    issues: tableProps.row.original.issues,
                    selectedRow: tableProps.row.original,
                  },
                }}
              >
                <span>
                  <Tooltip title="Issue To">
                    <DetailStyles>
                      <AssignmentIcon fontSize="small" />
                    </DetailStyles>
                  </Tooltip>
                </span>
              </Link>
            </>
          );
        },
      },
      {
        Header: "Asset Name",
        accessor: "asset_Name",
      },
      {
        Header: "Category",
        accessor: "category_Name",
      },
      {
        Header: "Requests",
        accessor: "requests",
      },
      {
        Header: "Issues",
        accessor: "issues",
      },
      {
        Header: "Allocated",
        accessor: "allocated",
      },
    ],
    []
  );

  const data = useMemo(() => oriData, [oriData]);
  return (
    <Styles>
      {/* {showErrTable ? (
        <NoRequestedTableText>
          There is no items to allocate
        </NoRequestedTableText>
      ) : ( */}
      {/* // make table */}
      <MakeTable
        columns={columns}
        data={data}
        loading={loading}
        subject="sub"
      ></MakeTable>
      {/* )} */}
    </Styles>
  );
}
