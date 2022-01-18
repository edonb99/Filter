import { NumberInput } from "@mantine/core";
import React from "react";
import { useEffect } from "react/cjs/react.development";

const PriceNumber = (props) => {
  const { searchNr, setSearchNr, externalOnChange, self } = props;

  const defaultOnChange = (values) => {
    if (!values) return;

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

  const betweenChange = (value, index) => {
    const theindex = searchNr.findIndex((obj) => obj.id === self.id);

    setSearchNr((old) => [
      ...old.slice(0, theindex),
      {
        ...old[theindex],
        search: [
          ...(old[theindex]?.search?.slice(0, index) ?? []),
          value,
          ...(old[theindex]?.search?.slice(index + 1) ?? []),
        ],
      },
      ...old.slice(theindex + 1),
    ]);
  };

  const getInputValue = (index) => {
    const theindex = searchNr.findIndex((obj) => obj.id === self.id);
    if (index) {
      return searchNr[theindex].search[index];
    }
    return searchNr[theindex].search;
  };

  const onChange = externalOnChange ?? defaultOnChange;

  return (
    <div>
      {self.rule === "between" ? (
        <div className="flex justify-between">
          <NumberInput
            className="w-1/2 mr-2"
            placeholder="Add Price"
            min={0}
            required
            value={getInputValue(0)}
            onChange={(val) => betweenChange(val, 0)}
          />
          <NumberInput
            className="w-1/2"
            placeholder="Add Price"
            min={0}
            required
            value={getInputValue(1)}
            onChange={(val) => betweenChange(val, 1)}
          />
        </div>
      ) : (
        <NumberInput
          placeholder="Add Price"
          min={0}
          required
          value={getInputValue()}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default PriceNumber;
