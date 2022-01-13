import React, { useEffect, useState } from "react";
import TagsInput from "react-tagsinput";
import data from "../data";
import "react-tagsinput/react-tagsinput.css"; // If using WebPack and style-loader.

const SearchTag = (props) => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState([]);
  const [output, setOutput] = useState([]);

  const { self, searchNr, setSearchNr, setChanges } = props;
  const { name, initialRule } = self;

  const [rule, setRule] = useState(0);

  const handleChangeInput = (e) => {
    setInput(e);
  };

  useEffect(() => {
    if (rule === initialRule) return;
    const objIndex = searchNr.findIndex((item) => item.id === self.id);

    setSearchNr((old) => [
      ...old.slice(0, objIndex),
      {
        ...self,
        rule: rule,
      },
      ...old.slice(objIndex + 1),
    ]);
  }, [rule]);

  useEffect(() => {
    setChanges((old) => old + 1);
  }, [self.rule, self.search]);

  useEffect(() => {
    if (input === "") return;
    const outputItem = data.filter((dataItem) =>
      dataItem.toLowerCase().includes(input.toLowerCase())
    );
    setOutput(outputItem);
  }, [input]);

  useEffect(() => {
    if (self.search === tags) return;
    self.search = tags;
  }, [tags]);

  function handlePres(emrin) {
    setTags((perpara) => [...perpara, emrin]);
    setInput("");
    setOutput([]);
  }

  const removeTag = () => {
    setSearchNr(
      searchNr.filter((obj) => {
        return obj.id !== self.id;
      })
    );
  };

  const handleRuleChange = (prek) => {
    setRule(prek);
  };

  const handleTagInput = (evt) => {
    const unwantedRules = ["is", "isnot"];
    if (unwantedRules.includes(self.rule)) return;

    setTags(evt);
  };

  const renderCorrectInput = (name) => {
    const numberNames = ["Price"];
    if (numberNames.includes(name)) return <input type="number" min="0" />;
    return (
      <TagsInput
        value={tags}
        inputValue={input}
        onChange={(e) => handleTagInput(e)}
        onChangeInput={handleChangeInput}
        className="w-full py-2 px-x focus:border-none focus:outline-none"
      />
    );
  };

  return (
    <div className="flex flex-row items-end mt-2 space-x-4">
      <div className="flex flex-col max-w-full">
        <h2 className="font-bold">{name}</h2>
        <select
          className="py-2 pl-3 pr-3 mt-1 text-xs text-gray-700 transition-all bg-gray-100 border border-gray-300 border-solid rounded-md cursor-pointer focus:ring-primary focus:border-primary sm:text-base focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
          value={rule}
          onChange={(e) => handleRuleChange(e.target.value)}
        >
          <option defaultValue>{name}</option>
          <option value="is">is</option>
          <option value="isnot">is not</option>
          <option value="startswith">starts with</option>
          <option value="endswith">ends with</option>
          <option value="contains">contains</option>
          <option value="doesnotcontain">does not contain</option>
        </select>
      </div>

      <div className="flex items-center flex-1 ">
        <div className="flex flex-col justify-start flex-1">
          {/* {self.name === "Price" ? (
            <input type="number" />
          ) : (
            <TagsInput
              value={tags}
              inputValue={input}
              onChange={(e) => handleTagInput(e)}
              onChangeInput={handleChangeInput}
              className="w-full py-2 px-x focus:border-none focus:outline-none"
            />
          )} */}
          {renderCorrectInput(self.name)}

          <div className="overflow-y-scroll cursor-pointer resize-none max-h-20 ">
            <div className="flex flex-col border border-gray-200">
              {output.map((item) => (
                <span
                  onClick={() => handlePres(item)}
                  key={item}
                  className="px-4 py-2 border-b border-gray-200 hover:bg-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <svg
            onClick={() => removeTag()}
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="red"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchTag;
