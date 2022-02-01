import React from "react";
import { RadioGroup, Radio } from "@mantine/core";

const RadioInput = (props) => {
  const { callback } = props;

  const onChange = (input) => {
    callback([input]);
  };

  return (
    <div>
      <RadioGroup size="lg" color="green" onChange={onChange}>
        <Radio value="1"> True</Radio>
        <Radio value="0">False</Radio>
      </RadioGroup>
    </div>
  );
};

export default RadioInput;
