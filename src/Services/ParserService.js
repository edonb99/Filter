import { cloneDeep } from "lodash";

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
        between: (filter) => ParserService.schemaBetween(filter),
        "does not contain": (filter) =>
          ParserService.schemaDoesNotContain(filter),
      },
    };

    const cloned = cloneDeep(filters);

    cloned.forEach((filter) => {
      ParserService.applyTransform(transform, filter);
    });

    cloned.forEach((filter) => {
      if (filter.values.length < 1) return;
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

  static schemaBetween(filter) {
    const [min = 0, max = 1000] = filter.values;
    filter.values = { from: min, to: max };
    return filter;
  }

  static schemaIsNot(filter) {
    filter["innerBucket"] = "none";
    return filter;
  }

  static schemaDoesNotContain(filter) {
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
