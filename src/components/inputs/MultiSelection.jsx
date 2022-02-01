import React from "react";
import { MultiSelect } from "@mantine/core";

const MultiSelection = (props) => {
  const { data = [], value = "", callback } = props;

  return (
    <div>
      <MultiSelect
        data={data}
        value={value}
        searchable
        clearable
        onChange={(value) => {
          callback(value);
        }}
      />
    </div>
  );
};

export default MultiSelection;
