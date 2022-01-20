import { MultiSelect, NumberInput } from "@mantine/core";
import React from "react";

const PriceNumber = (props) => {
  const { globalFilter, setGlobalFilter, self } = props;

  const onChange = (values) => {
    const last = values.slice(-1);
    const re = /^[0-9\b]+$/;

    if (values.length > 0 && !re.test(last)) return;

    const theindex = globalFilter.findIndex((obj) => obj.id === self.id);

    setGlobalFilter((old) => [
      ...old.slice(0, theindex),
      {
        ...old[theindex],
        values: values,
      },
      ...old.slice(theindex + 1),
    ]);
  };

  const betweenChange = (values, index) => {
    const theindex = globalFilter.findIndex((obj) => obj.id === self.id);

    setGlobalFilter((old) => [
      ...old.slice(0, theindex),
      {
        ...old[theindex],
        values: [
          ...(old[theindex]?.values?.slice(0, index) ?? []),
          values,
          ...(old[theindex]?.values?.slice(index + 1) ?? []),
        ],
      },
      ...old.slice(theindex + 1),
    ]);
  };

  return (
    <div>
      {self.compare === "between" ? (
        <div className="flex justify-between">
          <NumberInput
            className="w-1/2 mr-2"
            min={0}
            value={self.values[0]}
            onChange={(val) => betweenChange(val, 0)}
            stepHoldDelay={500}
            stepHoldInterval={100}
          />
          <NumberInput
            className="w-1/2"
            min={0}
            value={self.values[1]}
            onChange={(val) => betweenChange(val, 1)}
            stepHoldDelay={500}
            stepHoldInterval={100}
          />
        </div>
      ) : (
        <MultiSelect
          data={[]}
          value={self.values}
          searchable
          clearable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default PriceNumber;
