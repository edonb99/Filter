import { createClient } from "@elastic/app-search-javascript";
import { cloneDeep, merge, keyBy } from "lodash";
const renderNumber = (number) => {
  return parseFloat(number).toFixed(2);
};

class ElasticAppSearch {
  static client;
  static cache = {};
  static image_base = "https://image.dflow.al/";

  static resultFields = [
    "name",
    "id",
    "link",
    "on_sale",
    "initial_price",
    "price",
    "in_stock",
    "variants",
    "variants_in_stock",
    "related_group",
    "recommended_products",
    "variants_all",
    "images",
    "skus",
    "brand",
    "category",
    "color",
    "gender",
    "name",
    "heel_height",
    "sizes",
    "specific_color",
    "style",
    "sub_season",
    "usage",
    "width",
    "material",
    "season",
    "collection",
    "product_sets",
    "season",
  ];

  static async query(obj, onlyInStock = true) {
    const {
      query = "",
      search_fields = {},
      filters = {},
      page = 1,
      pageSize = 20,
      withFacets = [
        "brand",
        "gender",
        "variants_all",
        "variants_in_stock",
        "category",
        "initial_price",
        "total_stock",
        "price",
      ],
      sort = {},
    } = obj;

    const result_fields = {};
    ElasticAppSearch.resultFields.forEach((field) => {
      result_fields[field] = {
        raw: {},
      };
    });

    let sortObj = sort;
    if (Object.keys(sort).length === 0) {
      sortObj = {
        order: "asc",
      };
    }

    const allFilters = filters;

    const searchOptions = {
      result_fields,
      filters: allFilters,
      page: {
        current: page,
        size: pageSize,
      },
      sort: sortObj,
    };

    if (search_fields.length > 0) {
      searchOptions.search_fields = search_fields;
    }

    if (withFacets.length) {
      const facetsObj = {};
      withFacets.forEach(
        (facet) => (facetsObj[facet] = [{ type: "value", size: 100 }])
      );

      searchOptions.facets = facetsObj;
      searchOptions.disjunctiveFacets = withFacets;
    }

    const resp = await ElasticAppSearch.client
      .search(query, searchOptions)
      .catch((err) => {
        console.log("ElasticAppSearch Error", err.message);
        return err;
      });

    const { info, results } = resp;
    const products = results.map((r) => ElasticAppSearch.flattenProduct(r));

    return {
      products,
      facets: info.facets || {},
      currentPage: info.meta.page.current,
      maxPage: info.meta.page.total_pages,
    };
  }

  static async findBySku(sku) {
    return ElasticAppSearch.findBy("skus", sku);
  }

  static async findById(id, cached = false) {
    return ElasticAppSearch.findBy("id", id, cached);
  }

  static async findBy(field, value, cached = false) {
    if (!Array.isArray(value)) {
      value = [value];
    }
    let toBeReturned = value.filter((v) => v !== null).map((v) => v.toString());
    let toBeFetched = cloneDeep(toBeReturned);

    if (cached) {
      if (ElasticAppSearch.cache.length > 30) {
        ElasticAppSearch.cache = {};
      }
      const cachedIds = Object.keys(ElasticAppSearch.cache);
      toBeFetched = toBeFetched.filter((id) => !cachedIds.includes(id));
    }

    let products = [];
    if (toBeFetched.length > 0) {
      const tempObj = {
        query: "",
        search_fields: {},

        filters: {
          [field]: toBeFetched,
        },
        page: 1,
        pageSize: toBeFetched.length,
        withFacets: [],
      };

      const res = await ElasticAppSearch.query(tempObj, false);
      products = res.products;
    }

    if (cached) {
      merge(ElasticAppSearch.cache, keyBy(products, "id"));
      return Object.values(ElasticAppSearch.cache).filter((p) =>
        toBeReturned.includes(p.id)
      );
    }
    return products;
  }

  static init() {
    if (!ElasticAppSearch.client) {
      ElasticAppSearch.client = createClient({
        // searchKey: 'search-8ndqzbiiefi2xwh21groagqv',
        searchKey: "search-8ndqzbiiefi2xwh21groagqv",
        endpointBase: "https://es.integrohu.app",
        engineName: "gentli-shpk",
        // engineName: 'la-skuadra',
      });
    }

    return ElasticAppSearch.client;
  }

  static getGalleryImages(result) {
    try {
      const images = JSON.parse(result.images);
      const { groups, primary } = images;
      Object.entries(groups).forEach(([image_type, { path, count, ratio }]) => {
        result["images_" + image_type] = [...Array(count).keys()].map(
          (index) =>
            ElasticAppSearch.image_base +
            "medium/" +
            path.replace("%s", index + 1)
        );
        result["images_" + image_type + "_hd"] = [...Array(count).keys()].map(
          (index) =>
            ElasticAppSearch.image_base + "hd/" + path.replace("%s", index + 1)
        );
        result["images_" + image_type + "_ratio"] = ratio ?? null;
      });

      result.image_hd = ElasticAppSearch.image_base + primary.replace("%s", 1);
      result.image_md =
        ElasticAppSearch.image_base + "medium/" + primary.replace("%s", 1);
      result.image_sm =
        ElasticAppSearch.image_base + "small/" + primary.replace("%s", 1);
      result.image_thumb =
        ElasticAppSearch.image_base + "thumb/" + primary.replace("%s", 1);
    } catch (e) {
      result.image_sm = "https://integrohu.app/default.jpg";
    }
    return result;
  }

  static async getMulti(related_group, recommended_products) {
    const result_fields = {};
    ElasticAppSearch.resultFields.forEach((field) => {
      result_fields[field] = {
        raw: {},
      };
    });

    let relatedFilters = {
      all: [{ in_stock: "1" }],
    };

    if (related_group) {
      relatedFilters = {
        all: [{ related_group }, { in_stock: "1" }],
      };
    }

    const resp = await ElasticAppSearch.client
      .multiSearch([
        {
          query: "",
          options: {
            result_fields,
            filters: relatedFilters,
            page: {
              size: related_group != null && related_group != 0 ? 5 : 0,
            },
          },
        },
        {
          query: "",
          options: {
            result_fields,
            filters: {
              all: [{ id: recommended_products }, { in_stock: "1" }],
            },
            page: {
              size: recommended_products.length,
            },
          },
        },
      ])
      .catch((err) => {
        console.log("ElasticAppSearch Error", err.message);
        return err;
      });
    return resp.map((result_set) =>
      result_set.results.map((single_result) =>
        ElasticAppSearch.flattenProduct(single_result)
      )
    );
  }

  static flattenProduct(r) {
    let result = {};

    Object.keys(r.data).forEach((key) => {
      if (key === "variants") {
        result[key] = JSON.parse(r.getRaw(key));
        return;
      }
      result[key] = r.getRaw(key);
    });

    result = ElasticAppSearch.getGalleryImages(result);
    result.rendered_initial_price = renderNumber(result.initial_price) + " €";
    result.rendered_price = renderNumber(result.price) + " €";
    return result;
  }

  static async executeFilter(state) {
    const combination = Object.keys(state)[0];
    let queryObj = {
      filters: {
        [combination]: [],
      },
      page: {
        size: 5,
      },
    };
    const needed = Object.values(state)[0];
    needed.map(
      (filter) =>
        (queryObj.filters[combination] = { [filter.es]: filter.values })
    );

    return await ElasticAppSearch.client.search("", queryObj);
  }

  static async getFields(state) {
    let queryObj = {
      facets: {},
    };
    const needed = Object.values(state)[0];
    needed.map(
      (filter) => (queryObj.facets[filter.es] = { type: "value", size: 100 })
    );

    return await ElasticAppSearch.client.search("", queryObj);
  }
}

export default ElasticAppSearch;
