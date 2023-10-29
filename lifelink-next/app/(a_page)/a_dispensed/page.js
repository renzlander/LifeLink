"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { laravelBaseUrl } from "@/app/variables";
import { SerialNumbers } from "./components/serialNumbers";
import { PatientRecord } from "./components/patientRecord";
import { ListOfDonors } from "./components/listOfDonors";
import { DispenseTable } from "./components/table";
import { useRouter } from "next/navigation";

export default function Home() {
  const [dispensedSerialNumbers, setDispensedSerialNumbers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [dispensedRecords, setDispensedRecords] = useState([]);
  const [donors, setDonors] = useState([]);
  const router = useRouter();

  const fetchSerialNumbers = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(`${laravelBaseUrl}/api/get-all-serial-no`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        setDispensedSerialNumbers(response.data.serialNumbers);
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching SerialNumbers:", error);
    }
  };

  const fetchDispenseRecords = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }


      const data = {
        serialNo: searchQuery,
        serialNumbers: serialNumbersArray,
    };

      const response = await axios.post(`${laravelBaseUrl}/api/dispensed-list`, data,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (response.data.status === "success") {
        setDispensedRecords(response.data.dipensedList);
        setDonors(response.data.donors); 
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching SerialNumbers:", error);
    }
  }

  const serialNumbersArray = dispensedRecords.map((record) =>
    record.serial_numbers.split(',').map((serial) => serial.trim())
  ).flat();

  useEffect(() => {
    fetchSerialNumbers();
    
  }, []);

  // Function to update the search query
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      // Only make the API call when searchQuery is not empty
      fetchDispenseRecords();
    }
  }, [searchQuery]);

  return (
    <div className="bg-gray-200 flex min-h-screen flex-col items-center justify-between p-12">
      <DispenseTable />
      {/* <SerialNumbers
        dispensedSerialNumbers={dispensedSerialNumbers}
        onSearch={handleSearch}
      />
        <PatientRecord dispensedRecords={dispensedRecords} donors={donors}/> */}
    </div>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
