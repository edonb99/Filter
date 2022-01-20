import { useMemo } from "react";
import componentMapper from "../mappers/componentMapper";
import rulesMapper from "../mappers/rulesMapper";

const FilterField = (props) => {
  const { self, globalFilter, setGlobalFilter, facets } = props;

  const handleRuleChange = (values) => {
    const objIndex = globalFilter.findIndex((item) => item.id === self.id);

    setGlobalFilter((old) => [
      ...old.slice(0, objIndex),
      {
        ...self,
        values: [],
        compare: values,
      },
      ...old.slice(objIndex + 1),
    ]);
  };

  const removeTag = () => {
    setGlobalFilter(
      globalFilter.filter((obj) => {
        return obj.id !== self.id;
      })
    );
  };

  const CorrectInput = componentMapper[self.name];
  const correctRules = rulesMapper[self.type];
  const correctData = facets[self.es]
    ? facets[self.es][0].data.map((dt) => dt.value)
    : [];

  return (
    <div className="flex flex-row items-end mt-8">
      <div className="flex flex-col mr-5">
        <h2 className="font-bold">{self.name}</h2>

        {correctRules.length > 0 && (
          <select
            className="py-2 pl-3 pr-3 mt-2 text-xs text-gray-700 transition-all bg-gray-100 border border-gray-300 border-solid rounded-md cursor-pointer focus:ring-primary focus:border-primary sm:text-base focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
            value={self.compare}
            onChange={(e) => handleRuleChange(e.target.value)}
          >
            {correctRules.map((compare) => {
              return <option key={compare}>{compare}</option>;
            })}
          </select>
        )}
      </div>

      <div className="flex items-center justify-center flex-1">
        <div className="flex flex-col justify-center w-full mr-2">
          <CorrectInput
            key={self.id}
            self={self}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
            data={correctData}
            correctRules={correctRules}
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

export default FilterField;
