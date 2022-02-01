import CreatableMultiSelect from "../components/inputs/CreatableMultiSelect";
import BetweenNumberInput from "../components/inputs/BetweenNumberInput";
import RadioInput from "../components/inputs/RadioInput";
import NumberInput from "../components/inputs/NumberInput";
import MultiSelection from "../components/inputs/MultiSelection";

const COMPONENT_MAPPER = {
  string: {
    default: CreatableMultiSelect,
    is: MultiSelection,
    "is not": MultiSelection,
  },
  numeric: {
    default: NumberInput,
    between: BetweenNumberInput,
  },
  boolean: {
    default: RadioInput,
  },
};

export default COMPONENT_MAPPER;
