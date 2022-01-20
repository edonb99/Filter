class ParserService {
  static parse(filterConfig) {
    const { combination, filters } = filterConfig;
    const finalQuery = {
      all: [],
      none: [],
      any: [],
    };

    const filter = {
      id: "Gender-984",
      es: "gender",
      field: "product.gender",
      name: "Gender",
      values: ["FEMRA"],
      compare: "is",
      type: "standard",
    };

    ParserService.applyTransform(
      {
        type: {
          numeric: (fto) => ParserService.parseNumeric(fto),
        },
      },
      filter
    );

    const parseMapper = {
      numeric: (fto) => ParserService.parseNumeric(fto),
    };

    const schemaMapper = {
      "is not": (schema) => ParserService.schemaIsNot(schema),
      between: (schema) => ParserService.schemaBetween(schema),
    };

    filters.forEach((fto, index) => {
      if (fto.values.length === 0 && index !== 0) return;

      const typeInMapper = fto.type in parseMapper ? fto.type : "default";
      const compareInMapper =
        fto.compare in schemaMapper ? fto.compare : "default";

      const parsed = parseMapper[typeInMapper](fto.values);
      const result = schemaMapper[compareInMapper](parsed);

      finalQuery = {
        ...finalQuery,
        [combination]: [...finalQuery[combination], { [fto.es]: result }],
      };
    });

    console.log(finalArr);
    return { [combination]: finalQuery };
  }

  static parseNumeric(fto) {
    return {
      ...fto,
      values: fto.values.map((val) => parseFloat(val)),
    };
  }

  static schemaBetween(values) {
    return {
      from: values[0],
      to: values[1],
    };
  }

  static schemaIsNot(values) {}

  static applyTransform(transform, filter) {
    Object.entries(transform).forEach((transformation_key, typeOfTranform) => {
      (typeOfTranform ?? transform["default"] ?? ((filter) => filter))(filter);
    });
  }
}

export default ParserService;
