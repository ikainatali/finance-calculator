import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const InputSelect = () => {
  const [dummyData, setdummyData] = useState([]);
  const [resetInputValue, setResetInputValue] = useState("");
  const [inputValue, setInputValue] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [tagValue, setTagValue] = useState([]);

  useEffect(() => {
    const apiData = async () => {
      const response = await axios.get(
        "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
      );
      setdummyData(response.data);
    };
    apiData();
  }, []);

  const handleInputChange = (e: any) => {
    e.preventDefault();
    const iValue: string | any = e.target.value;

    setResetInputValue(iValue);
    setInputValue({ ...inputValue, iValue } as any);

    //suggestion on input
    let matches: object[] = [];
    const regexString = new RegExp(`${iValue}`, "i");
    const regexOperator = /[+\-*\/%()^]/;
    let operator: any;
    if (iValue.length > 0) {
      operator = regexOperator.test(iValue);
      matches = dummyData.filter(({ name }) => {
        if (operator) {
          console.log("operator matched");
        } else {
          return regexString.test(name);
        }
      });
    }
    setSuggestions(matches as any);
  };

  const handleSuggestion = (name: string, value: number | string) => {
    setTagValue([
      ...tagValue,
      {
        name: name,
        value: eval(value),
      },
    ] as any);

    setResetInputValue("");
    setSuggestions([]);
  };

  const deleteTag = (name: string) => {
    let remainingTags = tagValue.filter((tag) => tag.name !== name);
    setTagValue(remainingTags);
  };

  const deleteLastTag = (e: any) => {
    if (e.keyCode === 8) {
      let remainingTags = tagValue.slice(0, -1);
      setTagValue(remainingTags);
    }
    // console.log(e);
  };

  console.log("complete form data", tagValue);
  return (
    <>
      <div className="relative flex flex-wrap justify-center items-center gap-3 w-full pt-20">
        <div className="h-auto w-1/2 flex flex-wrap gap-4 items-center overflow-x-hidden overflow-y-auto p-2 border-[1px] border-gray-200 bg-white hover:ring-blue-400 hover:ring-1 rounded-md">
          <div className="tags flex flex-wrap gap-1">
            {tagValue &&
              tagValue.map(({ name }, i) => (
                <span
                  key={i}
                  className="tag flex gap-1 items-center p-1 rounded-md text-gray-800 bg-gray-200"
                >
                  {name}
                  <button onClick={() => deleteTag(name)}>
                    <MdClose size={13} />
                  </button>
                </span>
              ))}
          </div>
          <div className="flex justify-between items-center gap-4">
            <form className="">
              <input
                value={resetInputValue}
                onChange={handleInputChange}
                onKeyDown={deleteLastTag}
                type="text"
                className="flex-grow h-full outline-none border-none"
              />
            </form>
          </div>
        </div>
        <div
          className={clsx(
            suggestions.length > 0
              ? "absolute h-auto top-36 p-4 flex flex-row flex-wrap items-start overflow-x-hidden overflow-y-auto gap-2 rounded-lg w-2/5 -ml-28 bg-gray-100"
              : "hidden"
          )}
        >
          {suggestions &&
            suggestions.map(({ name, value }, i) => (
              <div
                onClick={() => handleSuggestion(name, value)}
                key={i}
                className="p-2 bg-white cursor-pointer rounded-lg hover:bg-blue-100"
              >
                {name}
              </div>
            ))}
        </div>
        <button className="bg-sky-600 p-3 px-10 rounded-full text-white">
          Enter
        </button>
      </div>
    </>
  );
};

export default InputSelect;
