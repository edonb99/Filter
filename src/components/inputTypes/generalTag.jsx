import React from "react";
import { MultiSelect } from "@mantine/core";

const Generaltag = (props) => {
  const defaultData = ["yeah", "yoo", "idk"];
  const {
    data = defaultData,
    searchNr,
    setSearchNr,
    externalOnCreate,
    externalOnChange,
    self,
  } = props;

  const defaultOnCreate = (query) => {
    const theindex = searchNr.findIndex((obj) => obj.id === self.id);
    setSearchNr((old) => [
      ...old.slice(0, theindex),
      {
        ...old[theindex],
        search: [...old[theindex].search, query],
      },
      ...old.slice(theindex + 1),
    ]);
  };

  const defaultOnChange = (values) => {
    const theindex = searchNr.findIndex((obj) => obj.id === self.id);

    setSearchNr((old) => [
      ...old.slice(0, theindex),
      {
        ...old[theindex],
        search: values,
      },
      ...old.slice(theindex + 1),
    ]);
  };

  const onCreate = externalOnCreate ?? defaultOnCreate;
  const onChange = externalOnChange ?? defaultOnChange;

  return (
    <div>
      <MultiSelect
        data={data}
        placeholder="Select items"
        searchable
        creatable={!["is", "is not"].includes(self.rule)}
        clearable
        getCreateLabel={(query) => `+ Create ${query}`}
        transitionDuration={150}
        transition="pop-top-left"
        transitionTimingFunction="ease"
        onCreate={onCreate}
        onChange={onChange}
      />
    </div>
  );
};

export default Generaltag;
