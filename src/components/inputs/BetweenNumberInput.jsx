import React, { useEffect, useState } from "react";
import { NumberInput } from "@mantine/core";

const BetweenNumberInput = (props) => {
  const { value = "", callback } = props;
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);

  useEffect(() => {
    callback([min, max]);
  }, [min, max]);

  return (
    <div className="flex justify-between">
      <NumberInput
        className="w-1/2 mr-2"
        min={0}
        value={min}
        onChange={(val) => setMin(val)}
        stepHoldDelay={500}
        stepHoldInterval={100}
      />
      <NumberInput
        className="w-1/2"
        min={0}
        value={max}
        onChange={(val) => setMax(val)}
        stepHoldDelay={500}
        stepHoldInterval={100}
      />
    </div>
  );
};

export default BetweenNumberInput;
