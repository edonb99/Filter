class ParserService {
  static whiteList = [""];

  static parse(filterConfig) {
    const { combination: bucket, filters } = filterConfig;

    const finalQuery = {
      [bucket]: [],
    };

    const transform = {
      type: {
        numeric: (filter) => ParserService.parseNumeric(filter),
      },

      compare: {
        "is not": (filter) => ParserService.schemaIsNot(filter),
        between: (filter) => {
          const [min = 0, max = 1000] = filter.values;
          filter.values = {
            from: min,
            to: max,
          };
          return filter;
        },
      },
    };

    filters.forEach((filter) => {
      ParserService.applyTransform(transform, filter);
    });

    debugger;

    filters.forEach((filter) => {
      let esFilter = { [filter.es]: filter.values };
      if (filter.innerBucket) {
        esFilter = { [filter.innerBucket]: [esFilter] };
      }
      finalQuery[bucket].push(esFilter);
    });

    return finalQuery;
  }

  static getEs(key, value) {
    return { [key]: value };
  }

  static parseNumeric(filter) {
    return filter.values.map((val) => parseFloat(val));
  }

  static schemaBetween(values) {
    return {
      from: values[0],
      to: values[1],
    };
  }

  static schemaIsNot(filter) {
    filter["compare"] = "is";
    filter["innerBucket"] = "none";
    return filter;
  }

  // execution
  static applyTransform(transform, filter) {
    let finalForm;

    Object.entries(transform).forEach(([transformation_key, transform]) => {
      (
        transform[filter[transformation_key]] ??
        transform["default"] ??
        ((filter) => filter)
      )(filter);
    });

    return finalForm;
  }

  static defaultTransform(filter) {
    return ParserService.getEs(filter.es, filter.values);
  }
}

export default ParserService;
