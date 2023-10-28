import React, { useState, useRef, useEffect } from "react";
import { Card, Input, Typography } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function InputSelectMBD({ label, options, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleOptionClick = (option) => {
    console.log("Selected option:", option.value);
    onSelect(option.value);
    setSearchTerm(option.label);
    setSelectedValue(option.value);
    setIsDropdownOpen(false);
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
  };

  const handleDocumentClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target) && 
        dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={inputRef}>
      <div className="relative flex items-center">
        <Input
          type="text"
          label={label}
          value={searchTerm}
          onClick={handleInputClick}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
          className="h-[60px]"
        />
      <div className={`absolute inset-y-0 right-2 flex items-center pointer-events-none transition-transform ${isDropdownOpen ? 'rotate-180' : ''} ${isDropdownOpen ? 'rotate-180' : ''}`}>
        <ChevronDownIcon className="h-3 w-3 text-gray-900" />
      </div>
      </div>
      {isDropdownOpen && (
        <Card ref={dropdownRef} className="z-[9999] p-3 absolute top-full mt-[.4rem] left-0 w-full bg-white border border-gray-300 rounded-md">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={`p-2 rounded-md cursor-pointer text-[#607d8b] hover:bg-gray-200 hover:text-gray-800 ${
                option.value === selectedValue ? "bg-gray-200 text-gray-800" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              <Typography className="font-medium text-sm">
                {option.label}
              </Typography>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

