import React from "react";
import Grid from "@material-ui/core/Grid";
// import FolderIcon from "@material-ui/icons/Folder";
import ErrorIcon from "@material-ui/icons/Error";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import styled from "styled-components";

const ListWrapper = styled.div`
  max-height: 250px;
  width: 100%;
  overflow-y: auto;
`;

export default function WarningGrid({ data }) {
  //   const [dense, setDense] = React.useState(false);
  //   const [secondary, setSecondary] = React.useState(false);
  console.log(data);
  //   function generate(element) {
  //     return [0, 1, 2].map((value) =>
  //       React.cloneElement(element, {
  //         key: value,
  //       })
  //     );
  //   }
  return (
    <Grid container spacing={3} style={{ margin: "0", width: "100%" }}>
      <Grid item xs={12}>
        Your excel has been saved successfully, however it seems like some of
        the required fields are having issues (typing errors, empty fields,
        wrong data type). Please check the following details and you can
        (re)upload again if you wish.
      </Grid>
      <ListWrapper>
        {data.map((one) => {
          return (
            <Grid item xs={12} key={one.error_Row_No}>
              {/* {one.error_Message} */}
              {/* <Typography variant="h6" className={classes.title}>
            Icon with text
          </Typography> */}
              <div>
                <List dense={true}>
                  {/* {generate( */}
                  <ListItem>
                    <ListItemIcon>
                      <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={one.error_Message}
                      // secondary={secondary ? "Secondary text" : null}
                    />
                  </ListItem>
                  {/* )} */}
                </List>
              </div>
            </Grid>
          );
        })}
      </ListWrapper>
    </Grid>
  );
}
