import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Typography, CardBody, Input } from "@material-tailwind/react";
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

    onSearch(searchQuery);
  }, [searchQuery, dispensedSerialNumbers, onSearch]);

  const onRowClick = (serialNumber) => {
    setSearchQuery(serialNumber);
    onSearch(serialNumber);
  };
  
  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Card className="w-auto flex flex-col">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h5" color="white" className="ml-4">
            Dispensed Blood Finder
        </Typography>
      </CardHeader>
      <div className=" mt-6 mx-4 flex justify-end items-center">
        <div className="flex w-full md:w-max">
          <div className="w-full md:w-72">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search serial number"
              icon={searchQuery === "" ? <MagnifyingGlassIcon className="h-5 w-5" /> : <XMarkIcon onClick={() => onClearSearch()} className="cursor-pointer h-5 w-5" />}
            />
          </div>
        </div>
      </div>
      <CardBody className="overflow-y-auto px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-y border-r border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer">Serial Number</th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 cursor-pointer">Dispensed Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredSerialNumbers.map((serial) => (
              <tr className="cursor-pointer" key={serial.id} onClick={() => onRowClick(serial.serial_no)}>
                <td className="border px-4 py-2">{serial.serial_no}</td>
                <td className="border px-4 py-2">{formatDate(serial.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
