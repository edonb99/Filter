import React from "react";
import { RadioGroup, Radio } from "@mantine/core";

const Radioinput = (props) => {
  const { globalFilter, setGlobalFilter, externalOnChange, self } = props;

  const defaultOnChange = (values) => {
    const theindex = globalFilter.findIndex((obj) => obj.id === self.id);

    setGlobalFilter((old) => [
      ...old.slice(0, theindex),
      {
        ...old[theindex],
        values: [values],
      },
      ...old.slice(theindex + 1),
    ]);
  };

  const onChange = externalOnChange ?? defaultOnChange;

  return (
    <div>
      <RadioGroup size="lg" color="green" onChange={onChange}>
        <Radio value="true">True</Radio>
        <Radio value="false">False</Radio>
      </RadioGroup>
    </div>
  );
};

export default Radioinput;
