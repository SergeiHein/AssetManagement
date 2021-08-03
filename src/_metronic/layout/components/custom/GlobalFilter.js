import React, { useState } from "react";

import { useAsyncDebounce } from "react-table";
import Input from "@material-ui/core/TextField";

export default function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const [value, setValue] = useState(globalFilter);
  const count = preGlobalFilteredRows.length;
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Input
      inputProps={{ "aria-label": "description" }}
      value={value || ""}
      style={{ marginLeft: "25px", minWidth: "30%" }}
      label="Search"
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`${count} records...`}
      InputLabelProps={{
        shrink: true,
      }}
      variant="outlined"
    />
  );
}
