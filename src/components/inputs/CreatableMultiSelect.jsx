import React from "react";
import { MultiSelect } from "@mantine/core";

const CreatableMultiSelect = (props) => {
  const { data = [], value = "", callback } = props;

  return (
    <div>
      <MultiSelect
        data={data}
        value={value}
        searchable
        creatable
        clearable
        getCreateLabel={(query) => `+ Create ${query}`}
        transitionDuration={150}
        transition="pop-top-left"
        transitionTimingFunction="ease"
        onChange={(value) => {
          callback(value);
        }}
      />
    </div>
  );
};
export default CreatableMultiSelect;
