import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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

    // Ito ay ang pagtawag sa onSearch function ng parent component
    onSearch(searchQuery);
  }, [searchQuery, dispensedSerialNumbers, onSearch]);

  return (
    <Card className="w-auto mt-4 flex flex-start mx-8 my-12">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
            Dispensed Blood Finder
        </Typography>
      </CardHeader>

      <CardBody className="overflow-y-auto px-4">
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
        <div className="ml-4">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Serial Number</th>
                <th className="px-4 py-2">Dispensed Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSerialNumbers.map((serial) => (
                <tr key={serial.id}>
                  <td className="border px-4 py-2">{serial.serial_no}</td>
                  <td className="border px-4 py-2">{formatDate(serial.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
