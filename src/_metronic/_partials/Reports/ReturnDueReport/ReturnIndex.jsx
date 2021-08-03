import React, { useState, useEffect, useContext } from "react";
import { useSubheader } from "../../../layout";
import { appsetting } from "../../../../envirment/appsetting";
import { TokenContext } from "../../../../app/BasePage";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import moment from "moment";
import ReturnFilterSection from "./ReturnFilterSection";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import PlayForWorkIcon from "@material-ui/icons/PlayForWork";
import MakeTable from "./MakeTable";
import MakeTableData from "./MakeTableData";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FilterWrapper = styled.div`
  position: relative;
  width: 80%;
  margin: 0 auto 50px auto;
  box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15) !important;
  background: #fff;
`;

const ImportOptions = styled.div`
  width: 96%;
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
    padding: 10px 15px !important;
    color: #fff !important;
  }
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
  height: 35px;
  margin-right: 20px;
  .MuiButton-label {
    color: "#fff !important";
  }
`;

const ResetBtn = styled(Button)``;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const useStyles = makeStyles({
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
});

export default function ExpiringIndex(props) {
  const suhbeader = useSubheader();
  const classes = useStyles();
  suhbeader.setTitle("ReturnDue Report");
  const { token, empID } = useContext(TokenContext);
  const { server_path } = appsetting;
  const [dateType, setDateType] = useState("7Days");
  const [oriData, setOriData] = useState([]);

  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });

  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

  const [exportOption, setExportOption] = useState("");

  const [loading, setLoading] = useState({
    finish: null,
    success: null,
  });
  const [tableApiValues, setTableApiValues] = useState([]);

  const [formData, setFormData] = useState({
    category: "All Categories",
    asset: "All Assets",
    location: "All Locations",
    status: "All Status",
    condition: "All Conditions",
    ownerBook: "All Owner Books",
    fromDate: moment(new Date()).format("DD/MM/YYYY"),
    toDate: moment()
      .add(7, "d")
      .format("DD/MM/YYYY"),
  });
  const [DropDownApiValues, setDropDownApiValues] = useState({
    category: [],
    assets: [],
    location: [],
  });

  const columnsNames = React.useMemo(
    () => [
      {
        Header: "Asset Name",
        accessor: "asset",
      },
      {
        Header: "Asset Tag",
        accessor: "asset_Tag",
      },
      {
        Header: "Serial No",
        accessor: "serial_No",
      },
      {
        Header: "Model No",
        accessor: "model_No",
      },
      {
        Header: "Product Key",
        accessor: "product_Key",
      },
      {
        Header: "Asset Status",
        accessor: "asset_Status",
      },
      {
        Header: "Asset Condition",
        accessor: "asset_Condition",
      },
      {
        Header: "Owner Book Status",
        accessor: "owner_Book_Status",
      },
      {
        Header: "Purchase Date",
        accessor: "purchase_Date",
      },
      {
        Header: "Warranty",
        accessor: "warranty",
      },
      {
        Header: "Expiry Date",
        accessor: "expiry_Date",
      },

      {
        Header: "Issue Date",
        accessor: "issue_Date",
      },
      {
        Header: "Return Due On",
        accessor: "return_Due_On",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Category",
        accessor: "category",
      },
    ],
    []
  );

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
        description: "Return Due Report Page",
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
      `${server_path}api/Category`,
      `${server_path}api/AssetDetail`,
      `${server_path}api/AssetLocation/LocationTreeView`,
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

        setDropDownApiValues((prev) => {
          return {
            ...prev,
            category: [...new Set(arr[0].map((val) => val.category_Name))],
            assets: [...new Set(arr[1].map((one) => one.asset))],
            location: arr[2],
          };
        });
      });
  }, [server_path, token]);

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
    setExportOption(e.target.value);
  }

  function initialFetch(string) {
    formData.fromDate = moment(formData.fromDate, "DD/MM/YYYY")
      .format("MM/DD/YYYY")
      .replace(/-/gi, "/");

    formData.toDate = moment(formData.toDate, "DD/MM/YYYY")
      .format("MM/DD/YYYY")
      .replace(/-/gi, "/");

    fetch(
      `${server_path}api/ActivityReport/OverrudeList?fromDate=${formData.fromDate}&toDate=${formData.toDate}&CategoryID=${formData.category}&AssetID=${formData.asset}&LocationID=${formData.location}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.length === 0) {
          setLoading({ finish: true, success: false });
          setTableApiValues(data);
          return;
        }

        setTableApiValues(data);

        setLoading({ finish: true, success: true });
      })
      .catch((err) => {
        setLoading({ finish: true, success: false });
      });

    setFormData({
      ...formData,
      fromDate: moment(formData.fromDate).format("DD/MM/YYYY"),
      toDate: moment(formData.toDate).format("DD/MM/YYYY"),
    });
  }

  useEffect(() => {
    setOriData(MakeTableData(tableApiValues));
  }, [tableApiValues]);

  function handleOnSubmit(e) {
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
  return (
    <>
      <Wrapper>
        <FilterWrapper>
          <FilterForm autoComplete="off" noValidate onSubmit={handleOnSubmit}>
            <ReturnFilterSection
              dateType={dateType}
              setDateType={setDateType}
              formData={formData}
              setFormData={setFormData}
              DropDownApiValues={DropDownApiValues}
            ></ReturnFilterSection>
            <ButtonArea>
              <FilterBtn variant="contained" color="primary" type="submit">
                Filter
              </FilterBtn>
              <ResetBtn
                color="primary"
                onClick={() => {
                  setFormData({
                    category: "All Categories",
                    asset: "All Assets",
                    location: "All Locations",
                    status: "All Status",
                    condition: "All Conditions",
                    ownerBook: "All Owner Books",
                    fromDate: moment(new Date()).format("DD/MM/YYYY"),
                    toDate: moment()
                      .add(7, "d")
                      .format("DD/MM/YYYY"),
                  });
                  setDateType("7Days");
                }}
              >
                Reset
              </ResetBtn>
            </ButtonArea>
          </FilterForm>
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
        ></MakeTable>
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
    </>
  );
}
