const rulesMapper = {
  standard: [
    "is",
    "is not",
    "starts with",
    "ends with",
    "contains",
    "does not contain",
  ],
  array: ["contains", "does not contain"],
  numeric: ["is", "is not", "between"],
  images: [],
  boolean: [],
};

export default rulesMapper;
