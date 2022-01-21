class ParserService {
  static parse(filterConfig) {
    const { combination, filters } = filterConfig;

    const finalQuery = {
      [combination]: [{}],
    };

    const transform = {
      type: {
        numeric: (filter) => ParserService.parseNumeric(filter),
      },

      compare: {
        "is not": (filter) => ParserService.schemaIsNot(filter),
      },
    };

    filters.forEach((filter) => {
      const transformed = ParserService.applyTransform(transform, filter);
      const bucket = transformed.bucket ?? "all";

      transformed.bucket && delete transformed.bucket;

      finalQuery[combination][0] = {
        ...finalQuery[combination][0],
        [bucket]: {
          ...finalQuery[combination][0][bucket],
          ...transformed.transformed,
        },
      };
    });

    return finalQuery;
  }

  static getEs(key, value) {
    return { [key]: value };
  }

  static parseNumeric(values) {
    return values.map((val) => parseFloat(val));
  }

  static schemaBetween(values) {
    return {
      from: values[0],
      to: values[1],
    };
  }

  static schemaIsNot(filter) {
    const transformed = ParserService.getEs(filter.es, filter.values);
    return { transformed: transformed, bucket: "none" };
  }

  // execution
  static applyTransform(transform, filter) {
    let finalForm;

    Object.entries(transform).forEach(([tsKey, transform]) => {
      const execution =
        transform[filter[tsKey]] ?? ParserService.defaultTransform;
      finalForm = execution(filter);
    });

    return finalForm;
  }

  static defaultTransform(filter) {
    return { transformed: ParserService.getEs(filter.es, filter.values) };
  }
}

export default ParserService;
