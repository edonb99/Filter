import React, { useEffect, useState } from "react";
import { MultiSelect } from "@mantine/core";

const Numberinput = (props) => {
  const { data = [], callback, value = "" } = props;
  const [localData, setLocalData] = useState([]);

  return (
    <MultiSelect
      data={data}
      value={localData}
      searchable
      clearable
      creatable
      getCreateLabel={(query) => `+ Create ${query}`}
      onChange={(value) => {
        setLocalData(value);
        callback(value.map((vl) => parseFloat(vl)));
      }}
    />
  );
};

export default Numberinput;
