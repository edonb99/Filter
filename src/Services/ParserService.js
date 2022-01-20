class ParserService {
  static parse(filterConfig) {
    const { combination, filters } = filterConfig;
    const finalQuery = {
      all: [],
      none: [],
      any: [],
    };

    const schemaMapper = {
      "is not": (schema) => ParserService.schemaIsNot(schema),
      between: (schema) => ParserService.schemaBetween(schema),
    };

    filters.forEach((filter, index) => {
      ParserService.applyTransform(
        {
          type: {
            numeric: (filter) => ParserService.parseNumeric(filter),
          },
          compare: {
            isNot: (filter) => {
              filter.bucket = "none";
              console.log("here");
              return filter;
            },
          },
        },
        filter
      );
      finalQuery[filter.bucket ?? combination] = (() => {
        delete filter.bucket;
        return filter;
      })();
    });

    return finalQuery;
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
    Object.entries(transform).forEach(([transformation_key, transform]) => {
      (
        transform[filter[transformation_key]] ??
        transform["default"] ??
        ((filter) => filter)
      )(filter);
    });
  }
}

export default ParserService;
