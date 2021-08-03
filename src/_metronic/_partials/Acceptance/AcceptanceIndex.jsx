import React, { useState, useMemo, useEffect, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import { useSubheader } from "../../layout";
import TextField from "@material-ui/core/TextField";
import MakeTableAcceptance from "./MakeDataAcceptance";
import MakeTable from "../../layout/components/custom/MakeTable";
import styled from "styled-components";
import ESign from "./ESign";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import GroupIcon from "@material-ui/icons/Group";
import IconButton from "@material-ui/core/IconButton";
import GroupDialog from "./GroupDialog";
import { withStyles } from "@material-ui/core/styles";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import { TreeViewDropDown } from "../../layout/components/custom/css/ListForm_Styles";
import moment from "moment";
import { KTCookie } from "../../../_metronic/_assets/js/components/cookie";
import { SnackBarSave, SnackBarSaveError } from "../Settings/SnackBar";
import FormHelperText from "@material-ui/core/FormHelperText";
// import Tooltip from "@material-ui/core/Tooltip";

// import { toAbsoluteUrl } from "../../_helpers";
// import Pen from "./../../layout/assets/pen-tool.svg";
// import SVG from "react-inlinesvg";
// import KTLayoutStickyCard from "../../_assets/js/layout/base/sticky-card";

const RadioGrouopStyles = styled(RadioGroup)`
  @media (max-width: 400px) {
    .accept-label,
    .decline-label {
      margin-bottom: 0 !important;
    }
  }
`;

const TextArea = styled(TextField)`
  width: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SubmitBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;

  .submit-btn {
    background: rgba(54, 153, 255, 0.75);
    padding: 8px 45px;
    color: #fff;
    min-height: 35px;
    box-shadow: none;
  }

  @media (max-width: 600px) {
    .submit-btn {
      min-height: 25px;
    }
  }

  @media (max-width: 400px) {
    /* text-align: center; */

    margin: 10px auto 0 auto;
    .submit-btn {
      min-height: 25px;
    }
  }
`;

const RequestForBtn = styled(IconButton)`
  cursor: ${(props) => (props.person ? "not-allowed" : `pointer`)} !important;
  transition: all 300ms;
`;

const SignatureSection = styled.form`
  background: #fff;
  width: 70%;
  min-height: 450px;
  margin: 75px auto 0 auto;
  padding: 35px;
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  .svg-wrapper {
    width: 70px;
    height: 70px;
    /* background: #6993ff; */
    background: #fff;
    border: 1px solid #e6e6e6;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);

    svg {
      width: 28px;
      height: 28px;
      /* fill: #000; */
    }
  }

  @media (max-width: 600px) {
    width: 100%;

    .MuiTypography-h5 {
      font-size: 1.1rem !important;
    }

    .svg-wrapper {
      width: 60px;
      height: 60px;
    }
  }
`;

const GetForm = styled.div`
  background: #fff;
  /* margin-bottom: 100px; */
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 65%;
  margin: 30px auto 50px;
  min-height: 470px;
  box-shadow: rgba(82, 63, 105, 0.15) 0px 0px 50px 0px !important;
  min-width: 300px;
  /* width */

  .MuiGrid-spacing-xs-3 > .MuiGrid-item:nth-child(even) {
    text-align: end;
  }

  @media (max-width: 600px) {
    width: 70%;

    text-align: center;

    .MuiGrid-spacing-xs-3 > .MuiGrid-item:nth-child(even) {
      text-align: center;
    }

    .MuiGrid-spacing-xs-3 > .MuiGrid-item {
      margin-bottom: 15px;
    }

    .MuiGrid-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  @media (max-width: 400px) {
    width: 100%;

    .MuiGrid-spacing-xs-3 > .MuiGrid-item {
      margin-bottom: 10px;
    }

    .MuiGrid-item {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  }
`;

const GridContainer = styled(Grid)`
  width: 90% !important;
  margin: 0 auto !important;
  height: 100%;
  flex: 1;
  @media (max-width: 1300px) {
    width: 100% !important;
  }
  span {
    font-weight: 400;
    font-size: 14px;
  }
`;

const GetFormTitle = styled.div`
  font-weight: 700;
  margin: 0 0px 7px 0;
  font-size: 14px;
  /* display: inline-flex; */
  @media (max-width: 730px) {
    width: 40%;
  }
  @media (max-width: 450px) {
    width: 50%;
  }
  @media (max-width: 400px) {
    width: 45%;
  }
`;

const LeftGetFormTitle = styled.div`
  font-weight: 700;
  margin: 0 0px 7px 0;
  font-size: 14px;
  @media (max-width: 1050px) {
    width: 50%;
  }
  @media (max-width: 400px) {
    width: 40%;
  }
`;

const RightGetFormTitle = styled.div`
  font-weight: 700;
  margin: 0 0px 7px 0;
  font-size: 14px;
  @media (max-width: 1050px) {
    width: 83%;
  }
  @media (max-width: 1000px) {
    width: 64%;
  }
  @media (max-width: 835px) {
    width: 75%;
  }
  @media (max-width: 730px) {
    width: 50%;
  }
  @media (max-width: 400px) {
    width: 70%;
  }
`;
const IssueFormTitle = styled.div`
  font-weight: 700;
  margin: 0 0px 7px 0;
  font-size: 14px;
  @media (max-width: 730px) {
    width: 25%;
  }
  @media (max-width: 400px) {
    width: 40%;
  }
`;

const RequestFormTitle = styled.div`
  font-weight: 700;
  margin: 0 0px 7px 0;
  font-size: 14px;
  @media (max-width: 730px) {
    width: 40%;
  }
  @media (max-width: 400px) {
    width: 50%;
  }
`;

const StyledTooltip = withStyles({
  tooltip: {
    margin: "5px 0",
  },
})(Tooltip);

const RightGrid = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  padding-bottom: 5px;
  @media (max-width: 1050px) {
    width: 98%;
  }
  @media (max-width: 450px) {
    width: 100%;
  }
  @media (max-width: 400px) {
    width: 100%;
  }
`;

const RightSubGrid = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  padding-bottom: 5px;
  @media (max-width: 1370px) {
    width: 92%;
  }
  @media (max-width: 1300px) {
    width: 92%;
  }
  @media (max-width: 1050px) {
    width: 100%;
  }
`;

const LeftGrid = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: auto;
  padding-bottom: 5px;
  @media (max-width: 450px) {
    width: 100%;
  }
  @media (max-width: 400px) {
    width: 100%;
  }
`;

const SubLeftGrid = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: auto;
  padding-bottom: 5px;
  @media (max-width: 1200px) {
    width: 95%;
  }
  @media (max-width: 450px) {
    width: 100%;
  }
  @media (max-width: 400px) {
    width: 100%;
  }
`;

const TreeViewArea = styled.div`
  width: 125%;
  min-width: 150px;
  max-width: 150px;
`;

export default function AcceptanceIndex() {
  const suhbeader = useSubheader();

  suhbeader.setTitle("Assets Acceptance");

  const { server_path } = appsetting;
  const { token } = useContext(TokenContext);

  const [openDialog, setOpenDialog] = useState({
    open: false,
    id: null,
  });

  const [clickedSubmit, setClickedSubmit] = useState(false);

  const [oriData, setOriData] = useState([]);
  const empID = KTCookie.getCookie("empID");
  const issueID = KTCookie.getCookie("issueID");
  // const [empID, setEmpID] = useState(KTCookie.getCookie("empID"));
  // const [issueID, setIssueID] = useState(KTCookie.getCookie("issueID"));
  // const sigRef = useRef(null);
  const [hideLicenseColumns, setHideLicenseColumns] = useState(true);
  const [hideVehicleColumns, setHideVehicleColumns] = useState(true);
  const [hideAssetTagColumns, setHideAssetTagColumns] = useState(true);
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });
  const [Postsuccess, Setpostsuccess] = useState(false);
  const [PostError, setposterror] = useState(false);

  const [issueApiValues, setIssueApiValues] = useState({
    issueValue: [],
    location: [],
  });

  // console.log(issueApiValues);
  const [SignError, setSignError] = useState(false);
  const [formData, setFormData] = useState({
    signature: "",
    issue_ID: parseInt(issueID),
    request_By_ID: parseInt(empID),
    accepted: true,
    asset_Location_ID: 0,
    self_Request: true,
    created_By: parseInt(empID),
    modified_By: parseInt(empID),
  });

  const [selectedTypeId, setSelectedTypeId] = useState({});
  const [LocationError, setLocationError] = useState(false);

  useEffect(() => {
    // const urls = [
    //   `${server_path}api/AssetDetail/AssetAcceptance?issueID=${issueID}`,
    //   `${server_path}api/AssetLocation/LocationTreeView`,
    // ];

    fetch(`${server_path}api/AssetDetail/AssetAcceptance?issueID=${issueID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);

        setIssueApiValues({
          ...issueApiValues,
          issueValue: data,
          // location: setting,
        });

        setLoading({
          finish: true,
          success: true,
        });
      })
      .catch((err) =>
        setLoading({
          finish: true,
          success: false,
        })
      );

    // Promise.all(requests).then((res) =>
    //   Promise.all(res.map((req) => req.json())).then((data) => {

    //     const TreeViewData = [...data[1]];
    //     const setting = [];
    //     TreeViewData.map((_treeViewData) => {
    //       if (
    //         setting.filter((item) => item.id === _treeViewData.Parent_ID)
    //           .length === 0
    //       ) {
    //         setting.push({
    //           title: _treeViewData.Asset_Location,
    //           value: _treeViewData.AssetLocation_ID,
    //           id: _treeViewData.Parent_ID,
    //           children: [],
    //         });
    //       } else {
    //         setting.map((item, index) => {
    //           if (item.id === _treeViewData.Parent_ID) {
    //             setting[index].children.push({
    //               title: _treeViewData.Asset_Location,
    //               value: _treeViewData.AssetLocation_ID,
    //             });
    //           }
    //         });
    //       }
    //     });

    //     setIssueApiValues({
    //       issueValue: data[0],
    //       location: setting,
    //     });
    //   })
    // );
  }, [server_path, token]);

  // console.log(issueApiValues.issueValue);

  useEffect(() => {
    if (issueApiValues.issueValue?.request_ID) {
      fetch(
        `${server_path}api/AssetLocation/GetAssetLocationByRequestID?RequestID=${issueApiValues.issueValue.request_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const ApiLocationData = [...data];
          const TreeViewData = ApiLocationData.sort(function(obj1, obj2) {
            return obj1.Parent_ID - obj2.Parent_ID;
          });
          const setting = [];

          const buildNestedTree = (items, data) => {
            if (items.children.length) {
              buildNestedTree(items.children[0], data);
            } else {
              items.children.push({
                title: data.asset_Location,
                value: data.assetLocation_ID,
                id: data.parent_ID,
                children: [],
              });
            }
          };
          TreeViewData.map((tree) => {
            if (tree.parent_ID === 0) {
              setting.push({
                title: tree.asset_Location,
                value: tree.assetLocation_ID,
                id: tree.parent_ID,
                group_List: tree.group_List,
                children: [],
              });
            } else {
              let index = setting.findIndex(
                (list) => list.group_List === tree.group_List
              );
              buildNestedTree(setting[index], tree);
            }
          });

          // console.log(setting);

          setIssueApiValues({
            ...issueApiValues,
            location: setting,
          });
        });
    }
  }, [server_path, token, issueApiValues.issueValue]);

  useEffect(() => {
    if (issueID) {
      KTCookie.setCookie("issueID", 1, {
        "max-age": -1,
      });
    }
  }, [issueID]);

  useEffect(() => {
    if (issueApiValues.issueValue.acceptanceDetails) {
      setOriData(MakeTableAcceptance(issueApiValues.issueValue));
    }
  }, [issueApiValues.issueValue]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Asset Tag",
        accessor: "asset_Tag",
        show: hideAssetTagColumns,
      },
      {
        Header: "Brand",
        accessor: "brand_Name",
      },
      {
        Header: "Model No.",
        accessor: "model_No",
      },
      {
        Header: "Serial No.",
        accessor: "searial_No",
      },
      {
        Header: "Product Key",
        accessor: "product_Key",
        show: hideLicenseColumns,
      },
      {
        Header: "Asset Status",
        accessor: "asset_Status",
      },
      {
        Header: "Asset Condition",
        accessor: "asset_Condition_Status",
      },
      {
        Header: "Owner Book Status",
        accessor: "owner_Book_Status",
        show: hideVehicleColumns,
      },
      {
        Header: "Expiry Date",
        accessor: "expiry_Date",
      },
      {
        Header: "Warranty",
        accessor: "warranty",
      },
    ],
    [hideLicenseColumns, hideVehicleColumns, hideAssetTagColumns]
  );

  useEffect(() => {
    if (issueApiValues.issueValue.category) {
      if (issueApiValues.issueValue.category.toLowerCase() === "license") {
        setHideLicenseColumns(false);
      }

      if (issueApiValues.issueValue.category.toLowerCase() === "vehicle") {
        setHideVehicleColumns(false);
      }
    }

    if (issueApiValues.issueValue.asset_Tag) {
      setHideAssetTagColumns(false);
    }
  }, [issueApiValues.issueValue]);

  // console.log(issueApiValues);

  function handleChangeRadio() {
    setFormData((prevProps) => ({
      ...prevProps,
      accepted: !prevProps.accepted,
    }));
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    setFormData({
      signature: "",
      issue_ID: parseInt(issueID),
      request_By_ID: parseInt(empID),
      accepted: true,
      asset_Location_ID: 0,
      self_Request: true,
      created_By: parseInt(empID),
      modified_By: parseInt(empID),
    });
    setClickedSubmit(!clickedSubmit);
  }
  // console.log(formData);

  function HandleSave(e) {
    e.preventDefault();
    formData.signature = formData.signature.split(";base64,")[1];
    if (formData.asset_Location_ID === 0) {
      setLocationError(true);
    } else {
      setLocationError(false);
      if (formData.signature === "") {
        setSignError(true);
      } else {
        // console.log(JSON.stringify(formData));

        console.log(formData);

        setSignError(false);
        fetch(`${server_path}api/AssetDetail/SaveAcceptance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })
          .then((res) => {
            console.log(res);
            if (res.status === 200 || res.status === 404) {
              Setpostsuccess(true);
            } else {
              setposterror(true);
            }
          })
          .catch((err) => console.log(err));
        setFormData({
          signature: "",
          issue_ID: 0,
          request_By_ID: 0,
          accepted: true,
          asset_Location_ID: 0,
          self_Request: true,
          created_By: parseInt(empID),
          modified_By: parseInt(empID),
        });
      }
    }
  }

  const data = useMemo(() => oriData, [oriData]);
  return (
    <>
      <GetForm className="d-flex flex-column flex-root">
        <GridContainer container spacing={3}>
          <Grid item xs={12} sm={6}>
            <RightGrid>
              <GetFormTitle>Type:</GetFormTitle>
              <span>{issueApiValues.issueValue.type_Name}</span>
            </RightGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LeftGrid>
              <GetFormTitle>Category:</GetFormTitle>
              <span>Furniture</span>
            </LeftGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <RightGrid>
              <GetFormTitle>Asset Name:</GetFormTitle>
              <Tooltip
                title={
                  issueApiValues.issueValue.asset_Name
                    ? issueApiValues.issueValue.asset_Name
                    : ""
                }
              >
                <span>
                  {issueApiValues.issueValue.asset_Name?.substr(0, 15) + "..."}
                </span>
              </Tooltip>
            </RightGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LeftGrid>
              <GetFormTitle>Request For:</GetFormTitle>
              <div style={{ marginTop: "-15px" }}>
                {/* <span style={{ marginTop: "-15px" }}>Others</span> */}
                <StyledTooltip title={"View others"}>
                  <RequestForBtn
                    onClick={() =>
                      setOpenDialog({
                        ...openDialog,
                        open: true,
                        id: issueApiValues.issueValue.request_ID,
                      })
                    }
                  >
                    <GroupIcon
                      fontSize="large"
                      style={{
                        transition: "250ms transform",
                        color: "rgba(54, 153, 255, 1)",
                        fontSize: "24px",
                      }}
                    ></GroupIcon>
                  </RequestForBtn>
                </StyledTooltip>
              </div>

              <GroupDialog
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
              ></GroupDialog>
            </LeftGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <RightGrid>
              <RequestFormTitle>Request Date:</RequestFormTitle>
              <span>
                {
                  moment(issueApiValues.issueValue.request_Date)
                    .format("DD-MM-YYYY")
                    .split("T")[0]
                }
              </span>
            </RightGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LeftGrid>
              <IssueFormTitle>Issue Date: </IssueFormTitle>

              <span>
                {
                  moment(
                    issueApiValues.issueValue.acceptanceDetails?.[0].issue_Date
                  )
                    .format("DD-MM-YYYY")
                    .split("T")[0]
                }
              </span>
            </LeftGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <RightSubGrid>
              <LeftGetFormTitle>Expected Return Date: </LeftGetFormTitle>
              <span>
                {
                  moment(
                    issueApiValues.issueValue.acceptanceDetails?.[0]
                      .expectedReturn_Date
                  )
                    .format("DD-MM-YYYY")
                    .split("T")[0]
                }
              </span>
            </RightSubGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LeftGrid>
              <GetFormTitle>Request Quantity: </GetFormTitle>
              <span>{issueApiValues.issueValue.request_Qty}</span>
            </LeftGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <RightGrid>
              <GetFormTitle>Issue Quantity: </GetFormTitle>
              <span>{issueApiValues.issueValue.issue_Qty}</span>
            </RightGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <SubLeftGrid>
              <RightGetFormTitle>
                Remaining Quantity to issue:{" "}
              </RightGetFormTitle>
              <span>{issueApiValues.issueValue.remaining_Qty}</span>
            </SubLeftGrid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <TreeViewArea>
                <TreeViewDropDown
                  style={{ width: "100%" }}
                  dropdownStyle={{
                    maxHeight: 400,
                    overflow: "auto",
                    minWidth: 300,
                  }}
                  treeData={issueApiValues.location}
                  placeholder="Asset Location*"
                  treeDefaultExpandAll
                  onChange={(e, l) => {
                    if (!e) return;
                    setSelectedTypeId({
                      ...selectedTypeId,
                      location_ID: e,
                    });
                    setFormData({ ...formData, asset_Location_ID: e });
                    setLocationError(false);
                  }}
                />
              </TreeViewArea>
              {LocationError && (
                <FormHelperText
                  color="primary"
                  style={{
                    color: "#f44336",
                  }}
                >
                  Asset Location cannot be empty
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextArea
              id="outlined-multiline-static"
              label="Note"
              // value="placeholder"
              // disabled={true}
              multiline
              rows={6}
              variant={"outlined"}
              // style={{ width: "75%" }}
            />
          </Grid>
        </GridContainer>
      </GetForm>
      <MakeTable
        columns={columns}
        data={data}
        hideLicenseColumns={hideLicenseColumns}
        hideVehicleColumns={hideVehicleColumns}
        subject="form-sub"
        loading={loading}
      ></MakeTable>
      <SignatureSection onSubmit={handleOnSubmit}>
        <span className="svg-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            enableBackground="new 0 0 512 512"
            viewBox="0 0 25.588 25.588"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="#6993ff"
              d="M18.724 9.903l3.855 1.416-3.206 8.729c-.3.821-1.927 3.39-3.06 3.914l-.275.75a.472.472 0 01-.603.28.47.47 0 01-.279-.604l.26-.709c-.575-1.117-.146-4.361.106-5.047l3.202-8.729zM24.303.667c-1.06-.388-2.301.414-2.656 1.383l-2.322 6.326 3.854 1.414 2.319-6.325c.292-.792-.133-2.409-1.195-2.798zm-6.975 8.909a.942.942 0 001.209-.555l2.45-6.608a.942.942 0 00-1.764-.653l-2.45 6.608a.94.94 0 00.555 1.208zm-3.944 12.391c-.253-.239-.568-.537-1.078-.764-.42-.187-.829-.196-1.128-.203l-.103-.002c-.187-.512-.566-.834-1.135-.96-.753-.159-1.354.196-1.771.47.037-.21.098-.46.143-.64.144-.58.292-1.18.182-1.742a1.003 1.003 0 00-.914-.806c-1.165-.065-2.117.562-2.956 1.129-.881.595-1.446.95-2.008.749-.686-.244-.755-2.101-.425-3.755.295-1.49.844-4.264 2.251-5.524.474-.424 1.16-.883 1.724-.66.663.26 1.211 1.352 1.333 2.653a.996.996 0 001.089.902.999.999 0 00.902-1.089c-.198-2.12-1.192-3.778-2.593-4.329-.839-.326-2.173-.414-3.79 1.033-1.759 1.575-2.409 4.246-2.88 6.625-.236 1.188-.811 5.13 1.717 6.029 1.54.549 2.791-.298 3.796-.976.184-.124.365-.246.541-.355-.167.725-.271 1.501.167 2.155.653.982 1.576 1.089 2.742.321.045-.029.097-.063.146-.097.108.226.299.475.646.645.42.206.84.216 1.146.224.131.003.31.007.364.031.188.083.299.185.515.389.162.153.333.312.55.476a1 1 0 001.198-1.601c-.145-.112-.26-.223-.371-.328z"
              data-original="#030104"
            ></path>
          </svg>
        </span>

        <FormControl component="fieldset">
          <RadioGrouopStyles
            aria-label="gender"
            name="gender1"
            value={formData.accepted}
            onChange={handleChangeRadio}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Accept"
              className="accept-label"
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="Decline"
              className="decline-label"
            />
          </RadioGrouopStyles>
        </FormControl>

        <ESign
          formData={formData}
          setFormData={setFormData}
          clickedSubmit={clickedSubmit}
          SignError={SignError}
          setSignError={setSignError}

          // sigRef={sigRef}
        ></ESign>
        {formData.signature !== "" && (
          <SubmitBtn>
            <Button
              // variant="contained"
              type="submit"
              className="submit-btn"
              onClick={HandleSave}
            >
              Submit
            </Button>
          </SubmitBtn>
        )}
      </SignatureSection>
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
    </>
  );
}
