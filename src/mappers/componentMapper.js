import Generaltag from "../components/inputTypes/generalTag";
import PriceNumber from "../components/inputTypes/PriceNumber";
import Radioinput from "../components/inputTypes/radioInput";

const componentMapper = {
  string: {
    default: Generaltag,
    is: "",
    "is not": "",
  },
  number: Generaltag,
  boolean: Generaltag,
  "Size All": Generaltag,
  "Size In Stock": Generaltag,
  Price: PriceNumber,
  "Initial Price": PriceNumber,
  "Total Stock": PriceNumber,
  "On Sale": Radioinput,
  "Has Images": Radioinput,
};

export default componentMapper;
