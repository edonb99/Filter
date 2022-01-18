import React, { useState } from "react";
import "react-tagsinput/react-tagsinput.css";
import SearchTag from "./components/SearchTag";
import inputMapper from "./inputMapper";

const makeObj = (makerObj) => {
  const { name, rule = "is", search = [] } = makerObj;

  const id = `${name}${Math.round(Math.random() * 100)}`;
  const obj = {
    id,
    name,
    rule,
    search,
  };

  return obj;
};

const App = () => {
  const [searchNr, setSearchNr] = useState([]);
  const [match, setMatch] = useState("all");

  const incrementSearch = (makerObj) => {
    const { name, rule } = makerObj;
    const obj = makeObj({ name, rule });

    setSearchNr((old) => [...old, obj]);
  };

  return (
    <div className="h-screen px-4 py-6">
      <pre>{JSON.stringify({ [match]: searchNr }, null, 2)}</pre>
      <div className="flex flex-col">
        <label className="w-full pb-3 mt-3 text-xl font-medium text-gray-700 border-b border-gray-300">
          Create new product set
        </label>
        <label className="w-full mt-3 text-lg font-medium text-gray-700 ">
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

      <div className="mt-3 text-base ">
        <div className="flex items-center justify-start space-x-2">
          <p>Automatic updates</p>
          <input
            type="checkbox"
            className="block mt-1 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:border-2"
          ></input>
        </div>
      </div>

      {searchNr.map((obj) => (
        <SearchTag
          key={obj.id}
          self={obj}
          searchNr={searchNr}
          setSearchNr={setSearchNr}
        />
      ))}
      <div className="w-full">
        <select
          className="py-2 pl-3 pr-8 mt-5 text-xs font-bold text-gray-700 transition-all bg-gray-300 border border-gray-300 border-solid rounded-md focus:ring-primary focus:border-primary sm:text-base focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
          value=""
          onChange={(e) =>
            incrementSearch({
              name: e.target.value,
              rule: inputMapper[e.target.value].rules[0],
            })
          }
        >
          <option defaultValue value="KrijoFilter">
            Krijo Filter
          </option>
          <option value="Gender">Gender</option>
          <option value="Brand">Brand</option>
          <option value="Category">Category</option>
          <option value="Size All">Size All</option>
          <option value="Size In Stock">Size In Stock</option>
          <option value="Initial Price">Initial Price</option>
          <option value="Price">Price</option>
          <option value="Total Stock">Total Stock</option>
          <option value="On Sale">On Sale</option>
          <option value="Has Image">Has Image</option>
        </select>
      </div>

      <div className="flex flex-col mt-5">
        <div className="text-lg font-bold ">Products</div>
        <div className="flex flex-row w-full p-5 mt-3 overflow-x-scroll bg-gray-100">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map((item) => (
            <div
              key={item}
              className="bg-white min-w-[10rem] mr-5 shadow-md border border-gray-200 rounded-lg"
            >
              <img
                className="w-full"
                src="https://nesha.digitalflow.systems/1/1/68139-gallery-1.jpg"
                alt=""
              />
              <div className="p-2">
                <p className="font-normal text-gray-700">Betsy</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end m-3">
        <button className="px-5 py-2 mb-3 text-green-100 transition-all duration-300 bg-green-500 rounded hover:bg-green-700 hover:text-green-50">
          Krijo
        </button>
      </div>
    </div>
  );
};

export default App;
