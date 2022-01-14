import React, { useEffect, useState } from "react";
import inputMapper from "../inputMapper";

const SearchTag = (props) => {
  const { self, searchNr, setSearchNr } = props;
  const { name } = self;

  const handleRuleChange = (value) => {
    const objIndex = searchNr.findIndex((item) => item.id === self.id);

    setSearchNr((old) => [
      ...old.slice(0, objIndex),
      {
        ...self,
        rule: value,
      },
      ...old.slice(objIndex + 1),
    ]);
  };

  const removeTag = () => {
    setSearchNr(
      searchNr.filter((obj) => {
        return obj.id !== self.id;
      })
    );
  };

  const CorrectInput = inputMapper[self.name].component;
  const correctData = inputMapper[self.name]?.data;
  const correctRules = inputMapper[self.name]?.rules;

  return (
    <div className="flex flex-row items-end mt-2 space-x-4">
      <div className="flex flex-col max-w-full">
        <h2 className="font-bold">{name}</h2>
        <select
          className="py-2 pl-3 pr-3 mt-1 text-xs text-gray-700 transition-all bg-gray-100 border border-gray-300 border-solid rounded-md cursor-pointer focus:ring-primary focus:border-primary sm:text-base focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
          value={self.rule}
          onChange={(e) => handleRuleChange(e.target.value)}
        >
          {correctRules.map((rule) => {
            return <option key={rule}>{rule}</option>;
          })}
        </select>
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="flex flex-col justify-center w-full">
          <CorrectInput
            self={self}
            setSearchNr={setSearchNr}
            searchNr={searchNr}
            data={correctData}
          />
        </div>

        <svg
          onClick={() => removeTag()}
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
};

export default SearchTag;
