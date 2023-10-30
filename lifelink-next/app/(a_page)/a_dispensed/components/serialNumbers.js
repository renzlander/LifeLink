import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input, Typography } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
  return formattedDate;
}

export function SerialNumbers({ dispensedSerialNumbers, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSerialNumbers, setFilteredSerialNumbers] = useState([]);

  useEffect(() => {
    const filtered = dispensedSerialNumbers.filter((serial) => {
      const serialNumber = serial.serial_no.toLowerCase();
      const query = searchQuery.toLowerCase();
      return serialNumber.includes(query);
    });
    setFilteredSerialNumbers(filtered);

    // Ito ay ang pagtawag sa onSearch function ng parent component
    onSearch(searchQuery);
  }, [searchQuery, dispensedSerialNumbers, onSearch]);

  return (
    <div>
      <div className="mb-4 ml-4 mr-4 flex justify-end items-center">
        <div className="flex w-full md:w-max">
          <div className="w-full md:w-72">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search serial number"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>
      <div>
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="lead"
                  color="blue-gray"
                  className="font-semibold text-md leading-none"
                >
                  Serial Number
                </Typography>
              </th>
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="lead"
                  color="blue-gray"
                  className="font-semibold text-md leading-none"
                >
                  Dispensed Date
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSerialNumbers.map((serial) => (
              <tr key={serial.id}>
                <td className="border px-4 py-2">
                  
                <Typography
                  variant="lead"
                  color="gray"
                  className="font-medium text-md leading-none"
                >
                  {serial.serial_no}
                </Typography>
                </td>
                <td className="border px-4 py-2">{formatDate(serial.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
