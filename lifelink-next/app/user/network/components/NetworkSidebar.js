import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";

function formatDateTime(dateTimeString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDateTime = new Date(dateTimeString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDateTime;
}

function hideMiddleCharacters(text) {
  if (text && text.length && text.length > 2) {
    const hiddenPart = "*".repeat(text.length - 2);
    return text[0] + hiddenPart + text.slice(-1);
  } else {
    return text;
  }
}
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function RecentRequest({ bloodRequestHistory }) {
  const chipColor = [
    { color: "green", value: "Granted", text: "Granted" },
    { color: "orange", value: "Referred", text: "Referred" },
    { color: "gray", value: "Pending", text: "Pending" },
    { color: "red", value: "Cancelled", text: "Cancelled" },
  ];

  return (
    <div className="w-full">
      {bloodRequestHistory && bloodRequestHistory.length > 0 ? (
        bloodRequestHistory.map((request, index) => (
          <Card key={index} className="w-full mb-4 shadow-lg">
            <CardBody className="px-6 py-4 w-full">
              <div className="flex flex-col w-full">
                <div className="flex flex-col justify-between lg:flex-row sm:flex-row items-center w-full">
                  <Chip
                    variant="ghost"
                    size="lg"
                    className="w-auto"
                    color={
                      request.isAccommodated === 0
                        ? chipColor[2].color
                        : request.isAccommodated === 1
                        ? chipColor[0].color
                        : request.isAccommodated === 2
                        ? chipColor[1].color
                        : chipColor[3].color
                    }
                    value={
                      request.isAccommodated === 0
                        ? chipColor[2].text
                        : request.isAccommodated === 1
                        ? chipColor[0].text
                        : request.isAccommodated === 2
                        ? chipColor[1].text
                        : chipColor[3].text
                    }
                  />
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-md mt-2"
                  >
                    Requested on {formatDateTime(request.created_at)}
                  </Typography>
                </div>
                <hr className="my-4"></hr>
                <div className="flex flex-col items-start w-full mb-3">
                  <Typography variant="h6" className="text-black font-bold">
                    No. of Units:
                    <span className="font-normal ml-3 text-gray-700">
                      {request.blood_units}
                    </span>
                  </Typography>
                  <Typography variant="h6" className="text-black font-bold">
                    Blood Component:
                    <span className="font-normal ml-3 text-gray-700">
                      {request.blood_component_desc}
                    </span>
                  </Typography>
                  <Typography variant="h6" className="text-black font-bold">
                    Hospital:
                    <span className="font-normal ml-3 text-gray-700">
                      {request.hospital}
                    </span>
                  </Typography>
                  <Typography variant="h6" className="text-black font-bold">
                    Diagnosis:
                    <span className="font-normal ml-3 text-gray-700">
                      {request.diagnosis}
                    </span>
                  </Typography>
                  <Typography variant="h6" className="text-black font-bold">
                    Schedule of Transfusion/Operation:
                    <span className="font-normal ml-3 text-gray-700">
                      {formatDate(request.schedule)}
                    </span>
                  </Typography>
                  {request.isAccommodated === 3 && (
                    <Typography className="text-black font-bold my-4">
                      Reason: {request.cancel_reason}
                    </Typography>
                  )}
                  {request.isAccommodated === 2 && (
                    <Typography className="text-black font-bold my-4">
                      Remarks: {request.remarks}
                    </Typography>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      ) : (
        <Typography className="text-gray-700 text-xl font-semibold text-center">
          No Ongoing Requests
        </Typography>
      )}
    </div>
  );
}
