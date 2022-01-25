import React, { useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import FilterField from "./components/FilterField";
import Header from "./components/Header";
import { handleProm } from "./helpers/promises";
import rulesMapper from "./mappers/rulesMapper";
import ElasticAppSearch from "./Services/ElasticAppSearch";
import ParserService from "./Services/ParserService";

const App = () => {
  ElasticAppSearch.init();

  const [isLoading, setIsLoading] = useState(true);
  const recentlyCreated = useRef(false);
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
      compare: rulesMapper[fullObj.type][0],
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
          type: "standard",
          es_field: "gender",
        },
        {
          key: "product.brand",
          name: "Brand",
          type: "standard",
          es_field: "brand",
        },
        {
          key: "product.category",
          name: "Category",
          type: "standard",
          es_field: "category",
        },
        {
          key: "compiled_attributes.size_all[]",
          name: "Size All",
          type: "array",
          es_field: "variants_all",
        },
        {
          key: "compiled_attributes.size_instock[]",
          name: "Size Instock",
          type: "array",
          es_field: "variants_in_stock",
        },
        {
          key: "numeric:compiled_attributes.initial_price",
          name: "Initial Price",
          type: "numeric",
          es_field: "initial_price",
        },
        {
          key: "numeric:compiled_attributes.price",
          name: "Price",
          type: "numeric",
          es_field: "price",
        },
        {
          key: "numeric:compiled_attributes.total_stock",
          name: "Total Stock",
          type: "numeric",
          es_field: "total_stock",
        },
        {
          key: "boolean:compiled_attributes.on_sale",
          name: "On Sale",
          type: "boolean",
          es_field: "on_sale",
        },
        {
          key: "images:images.has_images",
          name: "Has Images",
          type: "images",
          es_field: "images",
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

    console.log(Math.random());

    async function runAwait() {
      const [result, error] = await handleProm(
        ElasticAppSearch.query({ filters: parsedFilters, pageSize: 20 })
      );

      if (error) {
        console.log(error);
        //return;
      }

      console.log(JSON.stringify(parsedFilters, "", 4));
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

  return (
    <div className="h-screen px-4 py-6">
      <pre>{JSON.stringify({ [match]: globalFilter }, null, 2)}</pre>

      <Header match={match} setMatch={setMatch} />

      {globalFilter.map((obj) => (
        <FilterField
          key={obj.id}
          self={obj}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          facets={facets}
        />
      ))}

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
                className="w-full aspect-square"
                src={item.image_sm}
                alt=""
              />
              <div className="p-2 border-t border-gray-200">
                <p className="font-normal text-gray-700">{item.name}</p>
                <p className="mt-1 text-gray-700">{item.price}</p>
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
