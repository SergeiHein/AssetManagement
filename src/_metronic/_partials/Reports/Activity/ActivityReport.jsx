import React, { useState, useEffect, useContext } from "react";
import { useSubheader } from "../../../layout";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";

import ActivityFilterSection from "./ActivityFilterSection";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import MakeTable from "../../../layout/components/custom/MakeTable";
import MakeTableData from "./MakeTableData";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";
import ListItemText from "@material-ui/core/ListItemText";
// import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import PlayForWorkIcon from "@material-ui/icons/PlayForWork";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import { NoDataTableText } from "../../../layout/components/custom/css/RequestedIndex_Styles";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Backdrop from "@material-ui/core/Backdrop";

// import moment from "moment";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// const LoadingStyle = styled.div`
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   flex: 1;

//   div {
//     margin-top: 7px;
//   }
// `;

// const ExportOptions = styled.div`
//   position: absolute;
//   top: 25px;
//   right: 35px;
//   display: flex;
//   min-width: 50%;
//   max-width: 90%;
//   justify-content: flex-end;

//   .export-option {
//     padding: 5px 15px;
//     display: flex;
//     min-width: 100px;
//     min-height: 35px;
//     justify-content: center;
//     align-items: center;
//     border-radius: 50px;
//     /* border: 1px solid #c4c4c4; */
//     transition: background 400ms;
//     cursor: pointer;
//     background: rgba(55, 131, 231, 0.5);

//     &:hover {
//       background: rgba(55, 131, 231, 0.8);
//     }

//     span:first-child {
//       font-size: 12px;
//       margin-right: 5px;
//       color: #fff;
//     }
//   }

//   .MuiSelect-iconOpen {
//     transform: rotate(0) !important;
//   }

//   .export-option:not(:last-child) {
//     margin-right: 10px;
//   }
// `;

const ImportOptions = styled.div`
  /* display: flex;
  justify-content: flex-end; */
  width: 96%;
  /* padding-top: 15px; */
  position: absolute;
  top: 25px;
  right: 35px;
  display: flex;
  min-width: 50%;
  max-width: 90%;
  justify-content: flex-end;

  .MuiFormControl-root {
    /* width: 13% !important; */
    width: 100px;

    @media (max-width: 1024px) {
      width: 20% !important;
    }

    @media (max-width: 600px) {
      width: 30% !important;
    }
  }

  .MuiOutlinedInput-root {
    border-radius: 5px !important;
    background: rgba(55, 131, 231, 0.8) !important;
  }
  .MuiInputLabel-outlined {
    transform: translate(14px, 10px) scale(1) !important;
    color: white !important;
  }
  .MuiOutlinedInput-notchedOutline {
    border: none !important;
  }

  .MuiSelect-iconOpen {
    transform: rotate(0) !important;
  }

  .MuiSelect-icon {
    color: #fff;
    margin-right: 3px;
  }

  .Mui-focused {
    display: block !important;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: none !important;
  }
  .MuiSelect-outlined.MuiSelect-outlined {
    padding: 10px 0px !important;
    color: #fff !important;
  }
`;

const ExportLoadingText = styled.div``;

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    background: "rgba(0, 0, 0, 0.25) !important",
  },

  select: {
    // background: "#87a9ff",
    border: "2px solid #87a9ff",
    borderRadius: "9px",
    "& li": {
      // color: "#fff",
    },
  },

  root: {
    minWidth: "30px",
  },
}));

// const useStyles = makeStyles((theme) => {

//   select: {

//     border: "2px solid #87a9ff",
//     borderRadius: "9px",
//     "& li": {
//     },
//   },

//   root: {
//     minWidth: "30px",
//   },

// });

// const LoadingStyles = styled.div``;

const FilterWrapper = styled.div`
  position: relative;
  width: 80%;
  margin: 0 auto 50px auto;
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  background: #fff;
`;

const FilterForm = styled.form`
  width: 100%;
  padding: 100px 35px 35px 35px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 350px;
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

  @media (max-width: 1024px) {
    width: 85%;
  }
  @media (max-width: 600px) {
    width: 95%;
  }
`;

const FilterBtn = styled(Button)`
  color: #fff;
  width: 45%;
  /* margin: 30px auto 0 auto; */
  height: 35px;
  margin-right: 20px;
`;

const ResetBtn = styled(Button)``;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

// const useStyles = makeStyles({
//   select: {
//     background: "#87a9ff",
//     borderRadius: "9px",
//     "& li": {
//       color: "#fff",
//     },
//   },
// });

export default function ActivityReport(props) {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Activity Report");
  const { token, empID } = useContext(TokenContext);
  const { server_path } = appsetting;
  const [dateType, setDateType] = useState("7Days");
  // const [exportClicked, setExportClicked] = useState();
  const [exportOption, setExportOption] = useState("");
  // const [exportLoading, setExportLoading] = useState(null);
  // const [exportWait, setExportWait] = useState(false);
  const [formData, setFormData] = useState({
    event: "All Events",
    user: "All Users",
    asset: "All Assets",
    location: "All Locations",
    fromDate: moment()
      .subtract(7, "d")
      .format("DD/MM/YYYY"),
    toDate: moment(new Date()).format("DD/MM/YYYY"),
  });
  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });
  const [oriData, setOriData] = useState([]);
  const [tableApiValues, setTableApiValues] = useState([]);
  // const [showErrTable, setShowErrTable] = useState(false);
  const [formApiValues, setFormApiValues] = useState({
    location: [],
    users: [],
    assets: [],
  });
  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });
  // const [age, setAge] = React.useState("");

  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

  const classes = useStyles();

  // console.log(exportWait);

  // console.log(formData);

  const columnsNames = React.useMemo(
    () => [
      {
        Header: "Event",
        accessor: "event",
      },
      {
        Header: "Date & Time",
        accessor: "activity_Date",
      },
      {
        Header: "Action By",
        accessor: "action_By",
      },
      {
        Header: "Asset Name",
        accessor: "asset_Name",
      },
      {
        Header: "Asset Tag",
        accessor: "asset_Tag",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Location",
        accessor: "location",
      },
    ],
    []
  );

  // view audit api function

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
        description: "Activity Report page",
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
    const urls = [
      `${server_path}api/AssetLocation/GetAllAssetLocation`,
      `${server_path}api/Employee?id=${empID}`,
      `${server_path}api/AssetDetail`,
    ];

    const requests = urls.map((url) =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );

    Promise.all(requests)
      .then((res) => Promise.all(res.map((req) => req.json())))
      .then((arr) => {
        initialFetch();

        setFormApiValues((prev) => {
          return {
            ...prev,
            location: arr[0],
            users: arr[1],
            assets: [...new Set(arr[2].map((one) => one.asset))],
          };
        });
      });
    // .catch((err) => setLoading({ finish: true, success: false }));
  }, [server_path, token]);

  // useEffect(() => {
  //   if (exportLoading) {
  //     setExportWait(true);
  //   } else {
  //     setExportWait(false);
  //   }
  // }, [exportLoading]);

  // const handleChange = (event) => {

  //   setAge(event.target.value);
  // };

  function handleExportOption(e) {
    if (oriData.length === 0) {
      setOpenSnack({
        ...openSnack,
        openSnackOpen: true,
        message: "Please filter to export!",
        title: "error",
      });

      return;
    }
    // setExportLoading(true);
    setExportOption(e.target.value);
  }
  function initialFetch(string) {
    formData.fromDate = moment(formData.fromDate, "DD/MM/YYYY")
      .format("MM/DD/YYYY")
      .replace(/-/gi, "/");

    formData.toDate = moment(formData.toDate, "DD/MM/YYYY")
      .format("MM/DD/YYYY")
      .replace(/-/gi, "/");

    // }
    // console.log(formData);

    fetch(
      `${server_path}api/ActivityReport/GetActivityReport?fromDate=${formData.fromDate}&toDate=${formData.toDate}&asset=${formData.asset}&location=${formData.location}&user=${formData.user}&Event=${formData.event}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (!data || data.length === 0) {
          // console.log("data not exist");
          // setShowErrTable(true);
          // setLoading(false);
          setTableApiValues(data);
          setLoading({ finish: true, success: false });
          return;
        }
        // console.log("data exist");
        // setShowErrTable(false);
        // console.log(data);
        // if (string) {
        //   setLoading(false);
        // }

        setTableApiValues(data);
        setLoading({ finish: true, success: true });

        // setLoading(false);
      })
      .catch((err) => {
        setLoading({ finish: true, success: true });
        // setLoading(false);
        // setShowErrTable(true);
      });

    setFormData({
      ...formData,
      fromDate: moment(formData.fromDate).format("DD/MM/YYYY"),
      toDate: moment(formData.toDate).format("DD/MM/YYYY"),
    });
  }

  // console.log(showErrTable);

  useEffect(() => {
    setOriData(MakeTableData(tableApiValues));
  }, [tableApiValues]);

  function submitFilteredForm(e) {
    e.preventDefault();

    setLoading(true);

    initialFetch("filtered");
  }

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
  }

  // console.log(exportClicked);

  return (
    <>
      <Wrapper>
        <FilterWrapper>
          <FilterForm
            autoComplete="off"
            noValidate
            onSubmit={submitFilteredForm}
          >
            <ActivityFilterSection
              dateType={dateType}
              setDateType={setDateType}
              formData={formData}
              setFormData={setFormData}
              formApiValues={formApiValues}
            ></ActivityFilterSection>
            <BtnWrapper>
              <FilterBtn variant="contained" color="primary" type="submit">
                Filter
              </FilterBtn>
              <ResetBtn
                color="primary"
                onClick={() => {
                  setFormData({
                    event: "All Events",
                    user: "All Users",
                    asset: "All Assets",
                    location: "All Locations",
                    fromDate: moment()
                      .subtract(7, "d")
                      .format("DD/MM/YYYY"),
                    toDate: moment(new Date()).format("DD/MM/YYYY"),
                  });
                  setDateType("7Days");
                }}
              >
                Reset
              </ResetBtn>
            </BtnWrapper>
          </FilterForm>
          {/* <ExportOptions>
            <FormControl style={{ width: "125px" }}>
              <InputLabel id="demo-simple-select-label">
                Download{" "}

              </InputLabel>
              <Select
                IconComponent={CloudDownloadIcon}
                MenuProps={{ classes: { paper: classes.select } }}
              >
                <MenuItem value="pdf">
                  <ListItemIcon>
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/files/pdf.svg")}
                      ></SVG>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary="Export to PDF" />
                </MenuItem>
                <MenuItem value="csv">
                  {" "}
                  <ListItemIcon>
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/files/csv.svg")}
                      ></SVG>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary="Export to CSV" />
                </MenuItem>
                <MenuItem value="excel">
                  {" "}
                  <ListItemIcon>
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/files/xml.svg")}
                      ></SVG>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary="Export to Excel" />
                </MenuItem>
              </Select>
            </FormControl>
          </ExportOptions> */}
          <ImportOptions>
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Export
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={exportOption}
                onChange={handleExportOption}
                IconComponent={PlayForWorkIcon}
                MenuProps={{ classes: { paper: classes.select } }}
                label="Export"
              >
                <MenuItem value="pdf">
                  <ListItemIcon className={classes.root}>
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/files/pdf.svg")}
                      ></SVG>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary="Export to PDF" />
                </MenuItem>
                <MenuItem value="csv">
                  {" "}
                  <ListItemIcon className={classes.root}>
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/files/csv.svg")}
                      ></SVG>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary="Export to CSV" />
                </MenuItem>
                <MenuItem value="xlsx">
                  {" "}
                  <ListItemIcon className={classes.root}>
                    <span className="svg-icon menu-icon">
                      <SVG
                        src={toAbsoluteUrl("/media/svg/files/xml.svg")}
                      ></SVG>
                    </span>
                  </ListItemIcon>
                  <ListItemText primary="Export to Excel" />
                </MenuItem>
              </Select>
            </FormControl>
          </ImportOptions>
        </FilterWrapper>

        <MakeTable
          columns={columnsNames}
          data={oriData}
          loading={loading}
          subject="sub"
          exportOption={exportOption}
          setExportOption={setExportOption}
          // setExportLoading={setExportLoading}
        ></MakeTable>
        {/* {exportLoading && <ExportLoadingText>Downloading ..</ExportLoadingText>} */}
      </Wrapper>
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical, horizontal }}
        open={openSnackOpen}
        onClose={handleCloseSnack}
        key={vertical + horizontal}
      >
        <SnackbarContent
          aria-describedby="message-id2"
          style={{
            background: `${
              title === "saved"
                ? "#4caf50"
                : title === "fill all detail"
                ? "#ff9100"
                : "#f44306"
            }`,
          }}
          message={
            <span id="message-id2">
              <div>{message}</div>
            </span>
          }
        />
      </Snackbar>
      {/* <Backdrop className={classes.backdrop} open={exportWait}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
    </>
  );
}
