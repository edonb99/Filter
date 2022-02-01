import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { handleProm } from "./helpers/promises";
import ElasticAppSearch from "./Services/ElasticAppSearch";
import ParserService from "./Services/ParserService";
import COMPONENT_MAPPER from "./mappers/componentMapper";
import RULE_MAPPER from "./mappers/rulesMapper";
import { getFacet } from "./helpers/utils";

const App = () => {
  ElasticAppSearch.init();

  const [isLoading, setIsLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState([]);
  const [filters, setFilters] = useState([]);
  const [match, setMatch] = useState("all");
  const [facets, setFacets] = useState([]);

  const [products, setProducts] = useState([]);

  const incrementSearch = (event) => {
    const key = event.target.value;
    const fullObj = filters.filter((flt) => flt.key === key)[0];

    const constructedObj = {
      id: `${fullObj.name}-${Math.round(Math.random() * 1000)}`,
      es: fullObj.es_field,
      field: fullObj.key,
      name: fullObj.name,
      values: [],
      compare: RULE_MAPPER[fullObj.compareFields][0],
      fieldMap: fullObj.compareFields,
      type: fullObj.type,
    };

    setGlobalFilter((old) => [...old, constructedObj]);
  };

  useEffect(() => {
    async function runFirst() {
      // const [result, error] = await handleProm(IntegrohuClient.getFilters());

      // if (error) {
      //   console.log(error);
      //   return;
      // }
      setFilters([
        {
          key: "product.gender",
          name: "Gender",
          type: "string",
          compareFields: "standard",
          es_field: "gender",
        },
        {
          key: "product.brand",
          name: "Brand",
          type: "string",
          compareFields: "standard",
          es_field: "brand",
        },
        {
          key: "product.category",
          name: "Category",
          type: "string",
          compareFields: "standard",
          es_field: "category",
        },
        {
          key: "compiled_attributes.size_all[]",
          name: "Size All",
          type: "string",
          compareFields: "multi",
          es_field: "variants_all",
        },
        {
          key: "compiled_attributes.size_instock[]",
          name: "Size Instock",
          type: "string",
          compareFields: "multi",
          es_field: "variants_in_stock",
        },
        {
          key: "numeric:compiled_attributes.initial_price",
          name: "Initial Price",
          type: "numeric",
          compareFields: "checker",
          es_field: "initial_price",
        },
        {
          key: "numeric:compiled_attributes.price",
          name: "Price",
          type: "numeric",
          compareFields: "checker",
          es_field: "price",
        },
        {
          key: "numeric:compiled_attributes.total_stock",
          name: "Total Stock",
          type: "numeric",
          compareFields: "checker",
          es_field: "total_stock",
        },
        {
          key: "boolean:compiled_attributes.on_sale",
          name: "On Sale",
          type: "boolean",
          compareFields: "none",
          es_field: "on_sale",
        },
      ]);
      setIsLoading(false);
    }
    runFirst();
  }, []);

  useEffect(() => {
    if (globalFilter.length === 0) return;

    const parsedFilters = ParserService.parse({
      combination: match,
      filters: globalFilter,
    });

    console.log(parsedFilters);

    async function runAwait() {
      const [result, error] = await handleProm(
        ElasticAppSearch.query({ filters: parsedFilters, pageSize: 20 })
      );

      if (error) {
        console.log(error);
        return;
      }

      setFacets(result.facets);
      setProducts(result.products);
    }

    runAwait();
  }, [globalFilter, match]);

  if (isLoading)
    return (
      <div className="items-center justify-center w-screen h-screen">
        Loading...
      </div>
    );

  const handleRuleChange = (information) => {
    const { value, index } = information;

    setGlobalFilter((old) => [
      ...old.slice(0, index),
      {
        ...old[index],
        compare: value,
        values: [],
      },
      ...old.slice(index + 1),
    ]);
  };

  const handleFilterChange = (value, index) => {
    setGlobalFilter((old) => [
      ...old.slice(0, index),
      {
        ...old[index],
        values: value,
      },
      ...old.slice(index + 1),
    ]);
  };

  const removeField = (index) => {
    setGlobalFilter(globalFilter.filter((_, i) => i !== index));
  };

  return (
    <div className="h-screen px-4 py-6">
      <pre>{JSON.stringify({ [match]: globalFilter }, null, 2)}</pre>

      <Header match={match} setMatch={setMatch} />

      {globalFilter.map((filter, index) => {
        const type = filter.type;
        const compare =
          filter.compare in COMPONENT_MAPPER[type] ? filter.compare : "default";
        const CorrectInput = COMPONENT_MAPPER[type][compare];
        const rules = RULE_MAPPER[filter.fieldMap];

        return (
          <div key={filter.id} className="flex flex-row items-end mt-8">
            <div className="flex flex-col mr-5">
              <h2 className="font-bold">{filter.name}</h2>

              {rules.length > 0 && (
                <select
                  className="py-2 pl-3 pr-3 mt-2 text-xs text-gray-700 transition-all bg-gray-100 border border-gray-300 border-solid rounded-md cursor-pointer focus:ring-primary focus:border-primary sm:text-base focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
                  value={filter.compare}
                  onChange={(e) =>
                    handleRuleChange({ value: e.target.value, index })
                  }
                >
                  {rules.map((compare) => {
                    return <option key={compare}>{compare}</option>;
                  })}
                </select>
              )}
            </div>

            <div className="flex items-center justify-center flex-1">
              <div className="flex flex-col justify-center w-full mr-2">
                <CorrectInput
                  data={getFacet(facets, filter.es)}
                  value={filter.values}
                  callback={(value) => {
                    handleFilterChange(value, index);
                  }}
                />
              </div>

              <svg
                onClick={() => removeField(index)}
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="red"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          </div>
        );
      })}

      <div className="w-full">
        <select
          className="py-2 pl-3 pr-8 mt-5 text-xs font-bold text-gray-700 transition-all bg-gray-300 border border-gray-300 border-solid rounded-md focus:ring-primary focus:border-primary sm:text-base focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
          value=""
          onChange={incrementSearch}
        >
          <option defaultValue value="KrijoFilter">
            Krijo Filter
          </option>
          {filters.map((option) => (
            <option key={option.key} value={option.key}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mt-5">
        <div className="text-lg font-bold ">Products</div>
        <div className="flex flex-row w-full p-5 mt-3 overflow-x-scroll bg-gray-100">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 mr-5 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md w-52"
            >
              <img
                className="object-cover w-full aspect-square"
                src={item.image_sm}
                alt=""
              />
              <div className="p-2 border-t border-gray-200">
                <p className="font-normal text-gray-700">{item.name}</p>
                <p className="text-gray-700 ">{item.price}€</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-3">
        <button className="px-5 py-2 mb-3 font-medium text-green-100 transition-all duration-300 bg-green-500 rounded hover:bg-green-700 hover:text-green-50">
          Krijo
        </button>
      </div>
    </div>
  );
};

export default App;
