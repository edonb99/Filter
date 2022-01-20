import React from "react";

const Header = (props) => {
  const { match, setMatch } = props;

  return (
    <div>
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
    </div>
  );
};

export default Header;
