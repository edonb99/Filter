import React from "react";
import { MultiSelect } from "@mantine/core";

const Generaltag = (props) => {
  const defaultData = ["yeah", "yoo", "idk"];
  const {
    data = defaultData,
    globalFilter,
    setGlobalFilter,
    self,
    callback,
  } = props;

  const onChange = (input) => {
    return callback(input);
  };

  if (["is", "is not"].includes(self.compare))
    return (
      <div>
        <MultiSelect
          data={data}
          value={self.values}
          searchable
          creatable
          getCreateLabel={() => ``}
          clearable
          onChange={onChange}
        />
      </div>
    );

  return (
    <div>
      <MultiSelect
        data={data}
        value={self.values}
        searchable
        creatable
        clearable
        getCreateLabel={(query) => `+ Create ${query}`}
        transitionDuration={150}
        transition="pop-top-left"
        transitionTimingFunction="ease"
        onChange={onChange}
      />
    </div>
  );
};

export default Generaltag;
