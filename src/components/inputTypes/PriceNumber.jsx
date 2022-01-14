import { NumberInput } from "@mantine/core";
import React from "react";

const PriceNumber = (props) => {
  const { searchNr, setSearchNr, externalOnChange, self } = props;

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
  const onChange = externalOnChange ?? defaultOnChange;

  return (
    <div>
      <NumberInput
        placeholder="Add Price"
        min={0}
        required
        onChange={onChange}
      />
    </div>
  );
};

export default PriceNumber;
