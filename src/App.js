import React, { useEffect, useState } from "react";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.
import SearchTag from "./components/SearchTag";

const makeObj = (name, rule) => {
  const id = `${name}${Math.round(Math.random() * 100)}`;
  console.log(id);
  const obj = {
    id,
    name,
    rule,
    search: "",
  };
  return obj;
};

const makeQuery = (global, items) => {
  return {
    [global]: [
      ...items.map((item) => ({ values: item.search, field: item.name })),
    ],
  };
};

const App = () => {
  const [searchNr, setSearchNr] = useState([]);
  const [changes, setChanges] = useState(0);
  const [match, setMatch] = useState("all");

  const incrementSearch = (item) => {
    const obj = makeObj(item, "is");
    setSearchNr((old) => [...old, obj]);
  };

  console.log(searchNr);

  return (
    <div className="h-screen px-4 py-6">
      <div className="flex flex-col">
        <label className="w-full text-lg font-medium text-gray-700">
          Product Set Name
        </label>
        <input
          className="px-2 py-2 mt-3 text-gray-700 border rounded-lg shadow-sm focus:outline-red-500"
          id="productSetName"
          type="text"
        />
      </div>

      <div className="py-5 mt-3 text-base border-t border-b border-gray-300">
        <div className="flex items-center">
          <p>Match items for: </p>
          <select
            className="py-2 pl-3 mx-2 text-xs font-normal text-gray-700 transition-all bg-gray-100 border border-gray-300 border-solid rounded-md focus:ring-primary focus:border-primary sm:text-base focus:text-gray-700 focus:bg-white focus:border-red-500 focus:outline-none"
            value={match}
            onChange={(e) => setMatch(e.target.value)}
          >
            <option value="all">all</option>
            <option value="or">at least one</option>
          </select>
          <span> of the following rules: </span>
        </div>
      </div>

      {searchNr.map((obj) => (
        <SearchTag
          key={obj.id}
          self={obj}
          searchNr={searchNr}
          setSearchNr={setSearchNr}
          setChanges={setChanges}
        />
      ))}
      <div className="w-full">
        <select
          className="py-2 pl-3 pr-8 mt-5 text-xs font-bold text-gray-700 transition-all bg-gray-300 border border-gray-300 border-solid rounded-md focus:ring-primary focus:border-primary sm:text-base focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
          value=""
          onChange={(e) => incrementSearch(e.target.value)}
        >
          <option defaultValue value="KrijoFilter">
            Krijo Filter
          </option>
          <option value="Gender">Gender</option>
          <option value="Brand">Brand</option>
          <option value="Size All">Size All</option>
          <option value="Size In Stock">Size In Stock</option>
          <option value="Initial Price">Initial Price</option>
          <option value="Price">Price</option>
          <option value="Total Stock">Total Stock</option>
          <option value="On Sale">On Sale</option>
          <option value="Has Image">Has Image</option>
        </select>
      </div>
    </div>
  );
};

export default App;
