import React, { useState, useContext, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import { appsetting } from "../../../envirment/appsetting";
import { TokenContext } from "../../../app/BasePage";
import moment from "moment";
import WarningDialog from "./WarningDialog";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

// import { saveAs } from "file-saver";

const LabelContainer = styled.div`
  background: white;
  box-shadow: 0 0px 4px 0px rgba(82, 63, 105, 0.15);
  padding: 30px;
`;

const TextContainer = styled.div`
  padding: 10px;
  @media (max-width: 500px) {
    padding: 0px;
  }
`;
const FormContainer = styled.form`
  padding: 20px;
  padding-top: 40px;
`;

const ImportBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 10px;
  @media (max-width: 1465px) {
    margin-left: 10px;
  }
  @media (max-width: 800px) {
    margin-left: -15px;
  }
  @media (max-width: 622px) {
    margin-left: -40px;
  }
  @media (max-width: 600px) {
    margin-left: 40px;
  }
  @media (max-width: 500px) {
    margin-left: 20px;
  }
  @media (max-width: 400px) {
    margin-left: 0;
  }
`;
const SelectBox = styled.div`
  display: flex;
  margin: 30px 0 0 10px;
  /* width: 92%; */
  justify-content: space-between;
  /* @media (max-width: 1200px) {
    margin-right: -20px;
  } */
  /* @media (max-width: 1100px) {
    margin-right: -40px;
  } */
  @media (max-width: 1000px) {
    margin-right: -56px;
  }
  @media (max-width: 990px) {
    margin-right: 10px;
  }
  @media (max-width: 980px) {
    justify-content: space-between;
  }
  @media (max-width: 870px) {
    margin-left: 16px;
  }
  @media (max-width: 840px) {
    margin-left: -15px;
  }
  @media (max-width: 768px) {
    margin-left: -10px;
  }
  @media (max-width: 675px) {
    margin-left: -23px;
  }
  @media (max-width: 622px) {
    margin-left: -40px;
  }
  @media (max-width: 600px) {
    margin-left: 38px;
  }
  @media (max-width: 569px) {
    margin: 0;
    margin-top: 30px;
    margin-left: 32px;
  }
  @media (max-width: 520px) {
    margin-left: 18px;
  }
  @media (max-width: 480px) {
    margin-left: 9px;
  }
  @media (max-width: 455px) {
    margin-left: 3px;
  }
  @media (max-width: 377px) {
    margin-left: -40px;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  width: 90%;
  padding: 20px;
  /* margin: 30px 0 0 75px; */
  @media (max-width: 1385px) {
    margin: 30px 0 0 15px;
  }
  @media (max-width: 1340px) {
    margin: 30px 0 0 -15px;
  }
  @media (max-width: 1300px) {
    margin: 30px 0 0 -30px;
  }
  @media (max-width: 980px) {
    margin: 30px 0 0 -50px;
  }
  @media (max-width: 800px) {
    margin: 30px 0 0 5px;
  }
`;

const TempArea = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  padding-top: 0;
  @media (max-width: 1470px) {
    padding: 0;
  }
  @media (max-width: 1385px) {
    width: 100%;
  }
  @media (max-width: 1300px) {
    flex-direction: column;
    padding: 20px;
    padding-top: 0;
  }
  @media (max-width: 768px) {
    padding: 0px;
  }
  @media (max-width: 600px) {
    padding: 20px;
    margin-left: 38%;
    width: 70%;
  }
  @media (max-width: 440px) {
    width: 84%;
  }
`;

const useStyles = makeStyles((theme) => ({
  Text: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: " 25px",
    [theme.breakpoints.down(600)]: {
      fontSize: 12,
    },
  },
  SubText: {
    fontSize: 14,
    marginBottom: 20,
    marginTop: 25,
    [theme.breakpoints.down(600)]: {
      fontSize: 12,
    },
  },
  UploadBtn: {
    width: "100%",
    textTransform: "lowercase",
    [theme.breakpoints.down(1300)]: {
      paddingLeft: 25,
    },
  },
  UploadLabel: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down(1100)]: {
      paddingLeft: 10,
    },
  },
  formControl: {
    marginTop: "-10px",
    minWidth: 250,
    // paddingRight: 50,
    [theme.breakpoints.down(1300)]: {
      marginRight: 0,
      minWidth: 197,
      paddingLeft: 20,
    },
    [theme.breakpoints.down(1000)]: {
      marginRight: 10,
      minWidth: 170,
    },
    [theme.breakpoints.down(800)]: {
      minWidth: 180,
      marginRight: 13,
    },
    [theme.breakpoints.down(800)]: {
      minWidth: 120,
    },
    [theme.breakpoints.down(622)]: {
      marginLeft: 22,
      // minWidth: 180,
    },
    [theme.breakpoints.down(600)]: {
      // marginLeft: 22,
      minWidth: 180,
    },
    [theme.breakpoints.down(500)]: {
      // marginLeft: 22,
      minWidth: 140,
    },
    [theme.breakpoints.down(400)]: {
      marginLeft: 0,
      minWidth: 120,
      marginRight: "-10px",
    },
  },
  input: {
    marginLeft: 85,
    [theme.breakpoints.down(1340)]: {
      marginLeft: 62,
    },
    [theme.breakpoints.down(1300)]: {
      marginLeft: 55,
    },
    [theme.breakpoints.down(1120)]: {
      // marginLeft: 0,
      marginRight: "-10px",
      marginLeft: "38px",
    },
    [theme.breakpoints.down(990)]: {
      marginLeft: "43px",
    },
    [theme.breakpoints.down(768)]: {
      marginLeft: "33px",
    },
    [theme.breakpoints.down(675)]: {
      marginLeft: "13px",
    },
    [theme.breakpoints.down(662)]: {
      marginLeft: "21px",
    },
    [theme.breakpoints.down(600)]: {
      marginLeft: "89px",
    },
    [theme.breakpoints.down(569)]: {
      marginLeft: "85px",
    },
    [theme.breakpoints.down(520)]: {
      marginLeft: "65px",
    },
    [theme.breakpoints.down(513)]: {
      marginLeft: "46px",
    },
    [theme.breakpoints.down(455)]: {
      marginLeft: "30px",
    },
    [theme.breakpoints.down(337)]: {
      marginLeft: "23px",
    },
  },
  temp: {
    borderRadius: 20,
    width: "50%",
    [theme.breakpoints.down(1100)]: {
      width: "100%",
    },
    [theme.breakpoints.down(600)]: {
      borderRadius: 0,
    },
    [theme.breakpoints.down(513)]: {
      fontSize: 12,
    },
  },
  limit: {
    borderRadius: 20,
    [theme.breakpoints.down(1300)]: {
      marginTop: 30,
    },
    [theme.breakpoints.down(513)]: {
      fontSize: 8,
    },
  },
  Warning: {
    fontSize: 14,
    marginTop: 50,
    color: "red",
    [theme.breakpoints.down(600)]: {
      fontSize: 12,
    },
  },
  SubmitBtn: {
    color: "#fff",
    width: "37%",
    marginTop: 30,
    height: "35px",
    textTransform: "lowercase",
    [theme.breakpoints.down(1100)]: {
      width: "50%",
    },
    [theme.breakpoints.down(700)]: {
      width: "60%",
    },
    [theme.breakpoints.down(600)]: {
      width: "100%",
    },
  },
}));

export default function LabelPage(props) {
  // console.log(props);
  const classes = useStyles();
  const fileSaver = require("file-saver");
  const { server_path } = appsetting;
  const { token, empID } = useContext(TokenContext);

  const [option, setOption] = useState("");
  const [optionError, setOptionError] = useState(false);
  const [urlImg, setURLImg] = useState("");
  const [openSnack, setOpenSnack] = useState({
    openSnackOpen: false,
    vertical: "top",
    horizontal: "center",
    message: "",
    title: "",
  });
  const [excelFile, setExcelFile] = useState();
  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    data: [],
  });
  const [fileError, setFileError] = useState();
  // const [disabled, setDisabled] = useState(null);
  // const [warningMsg, setWarningMsg] = useState();
  // const [newAssetName, setNewAssetName] = useState("");

  const { openSnackOpen, vertical, horizontal, message, title } = openSnack;

  function handleCloseSnack() {
    setOpenSnack({
      ...openSnack,
      openSnackOpen: false,
    });
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
        description: "Data Import page",
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

  function saveCsvFile() {
    if (option === "") {
      setOptionError(true);
      return;
    }
    if (option === "Assets") {
      fileSaver.saveAs("/excel-samples/Asset_Import.csv", "Asset-template.csv");
    } else if (option === "Categories") {
      fileSaver.saveAs(
        "/excel-samples/Category_Import.csv",
        "Category-template.csv"
      );
    } else if (option === "Brands") {
      fileSaver.saveAs("/excel-samples/Brand_Import.csv", "Brand-template.csv");
    } else {
      fileSaver.saveAs(
        "/excel-samples/Supplier_Import.csv",
        "Supplier-template.csv"
      );
    }
  }

  function validateFile(e, setOpenSnack, openSnack) {
    console.log(e.target.files[0].size);
    if (e.target.files && e.target.files[0]) {
      let allowedExtensions = /(\.csv)$/i;
      if (e.target.files[0].size > 5000000) {
        // console.log("here");
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "file size is too big",
          title: "file size is too big",
        });
        return;
      }
      if (!allowedExtensions.exec(e.target.files[0].name)) {
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "Invalid File Type",
          title: "invalid file type",
        });

        e.target.value = "";
        setURLImg("");
        return false;
      } else {
        // const formData = new FormData();

        // console.log(e.target.files[0]);

        // formData.append(e.target.files[0].name, e.target.files[0]);

        setExcelFile(e.target.files[0]);
        // setExcelFile(formData);
        setURLImg(e.target.value.split("C:\\fakepath\\")[1]);
      }
      // setDisabled(false);
    }
  }

  // console.log(disabled);

  function handleOptionChange(event) {
    setOption(event.target.value);
    setOptionError(false);
  }

  // console.log(excelFile);

  function handleOnSubmit(e) {
    e.preventDefault();
    if (option === "") {
      setOptionError(true);
      return;
    }
    if (urlImg === "") {
      setFileError(true);
      return;
    }

    const formData = new FormData();

    formData.append("file", excelFile);

    // console.log(option, empID);

    // const options = {
    //   onUploadProgress: (e) => {
    //     const {loaded, total} = e;
    //     let percent = Math.floor()
    //   }
    // }

    fetch(
      `${server_path}api/ExcelImportApi/ExcelImport?name=${option}&EmpID=${empID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    )
      .then((res) => {
        // console.log(res);
        // if (res.status === 200 || res.status === 203) {
        if (res.status !== 500) {
          return res.text();
        } else {
          setOpenSnack({
            ...openSnack,
            openSnackOpen: true,
            message: "An error has occured, please try again",
            title: "error",
          });

          return;
        }
        // }

        // return

        // return res.json();
      })
      .then((data) => {
        // console.log(typeof data);
        // console.log(JSON.parse(data));
        // setLoading(false);
        if (data !== "" || data) {
          if (data === "Success!") {
            setOpenSnack({
              ...openSnack,
              openSnackOpen: true,
              message: "Sent Successfully",
              title: "saved",
            });
          } else if (data === "Your template format is wrong!") {
            setOpenSnack({
              ...openSnack,
              openSnackOpen: true,
              message: "Failed, Please check your template format again",
              title: "error",
            });
          } else {
            // console.log("this");
            setDialogOpen({ open: true, data: JSON.parse(data) });
            // setWarningMsg(JSON.parse(data));
            // setOpenSnack({
            //   ...openSnack,
            //   openSnackOpen: true,
            //   message: "Sent Successfully",
            //   title: "saved",
            // });
          }
        }

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        setOpenSnack({
          ...openSnack,
          openSnackOpen: true,
          message: "An error has occured, please try again",
          title: "error",
        });
      });

    e.target["icon-button-file"].value = "";

    setExcelFile();
    // setExcelFile(null);
    setOption("");
    setURLImg("");
  }

  // console.log(disabled);
  // console.log(warningMsg);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <LabelContainer>
          <TextContainer>
            <p className={classes.Text}>
              Import locations using an Excel spreadsheet.Download our
              template,fill it in, and upload. Also download "Filed Limits Info"
              to make sure your data is within character limits for all fields.
              There is no limit on the number of locations you can have. But you
              can import up to 5,000 records in one spreadsheet.
            </p>
            <p className={classes.SubText}>
              if you need assistance in uploading your assets,please feel free
              to email your spreadsheet to{" "}
              <span>
                <a
                  href={"mailto:" + "support@smilaxglobal.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  support@smilaxglobal.com
                </a>
              </span>
              .We'll take care of the rest.
            </p>
          </TextContainer>
          <FormContainer onSubmit={handleOnSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <ImportBox>
                  <p>
                    Import To<span style={{ color: "red" }}>*</span>
                  </p>
                  <FormControl className={classes.formControl}>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={option}
                      onChange={handleOptionChange}
                    >
                      <MenuItem value="Assets">Assets</MenuItem>
                      <MenuItem value="Categories">Categories</MenuItem>
                      <MenuItem value="Brands">Brands</MenuItem>
                      <MenuItem value="Suppliers">Suppliers</MenuItem>
                    </Select>
                    {optionError && (
                      <FormHelperText
                        color="primary"
                        style={{
                          color: "#f44336",
                        }}
                      >
                        *Please select an option
                      </FormHelperText>
                    )}
                  </FormControl>
                </ImportBox>
                <SelectBox>
                  <p>
                    Upload excel file (.csv){" "}
                    <span style={{ color: "red" }}>*</span>
                  </p>
                  <Grid item xs={6}>
                    <input
                      id="icon-button-file"
                      type="file"
                      tabIndex="2"
                      onChange={(e) => {
                        // setURLImg(e.target.value.split("C:\\fakepath\\")[1]);
                        // setDisabled(true);
                        validateFile(e, setOpenSnack, openSnack);
                        setFileError(false);
                      }}
                      style={{ display: "none" }}
                    />
                    <label
                      htmlFor="icon-button-file"
                      // style={{ display: "flex", flexDirection: "column",margin }}
                      className={classes.UploadLabel}
                    >
                      <Button
                        // style={{ width: "100%", textTransform: "lowercase" }}
                        variant="contained"
                        color="secondary"
                        component="span"
                        className={classes.UploadBtn}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload
                      </Button>
                      {fileError && (
                        <FormHelperText
                          color="primary"
                          style={{
                            color: "#f44336",
                          }}
                        >
                          Required field*
                        </FormHelperText>
                      )}
                      <span style={{ marginTop: "7px" }}>
                        {urlImg.length < 15
                          ? urlImg
                          : urlImg.substring(0, 15).concat(" ..")}
                      </span>
                    </label>
                  </Grid>
                </SelectBox>
                {/* {disabled &&} */}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TempArea>
                  <Button
                    onClick={saveCsvFile}
                    className={classes.temp}
                    variant="contained"
                    color="default"
                    style={{ textTransform: "lowercase" }}
                    startIcon={<CloudDownloadIcon />}
                    component="span"
                  >
                    Download File
                  </Button>
                  <Button
                    variant="contained"
                    color="default"
                    style={{ textTransform: "lowercase", display: "none" }}
                    className={classes.limit}
                    startIcon={<CloudDownloadIcon />}
                    component="span"
                  >
                    Download Limits and Instructions
                  </Button>
                </TempArea>
              </Grid>
              <ButtonArea>
                <Button
                  variant="contained"
                  color="primary"
                  // disabled={disabled ? true : false}
                  type="submit"
                  className={classes.SubmitBtn}

                  // onClick={handleOnSubmit}
                >
                  Submit
                </Button>
              </ButtonArea>
            </Grid>
            <p className={classes.Warning}>
              *Warning - Before starting import please double check cell
              position and remove empty row.
            </p>
          </FormContainer>
        </LabelContainer>
      </Container>
      {dialogOpen.open && (
        <WarningDialog
          // warningMsg={warningMsg}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        ></WarningDialog>
      )}
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
    </React.Fragment>
  );
}
