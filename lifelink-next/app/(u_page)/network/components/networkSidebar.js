import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography, Chip } from "@material-tailwind/react";

function formatDateTime(dateTimeString) {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" };
    const formattedDateTime = new Date(dateTimeString).toLocaleDateString(undefined, options);
    return formattedDateTime;
}

export function RecentRequest({ latestBloodRequest }) {

    const chipColor = [
        {color: "green", value: "Granted ", text: "Granted "},
        {color: "red", value: "Declined ", text: "Declined "},
        {color: "gray", value: "Pending", text: "Pending"},
      ];
    return (
        <Card className="w-full">
          <CardBody className="px-6 py-4">
            {latestBloodRequest ? (
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col items-start justify-between w-4/6 gap-3">
                  <Typography variant="h6">
                    No. of units: 
                    <spam className="font-normal ml-3">{latestBloodRequest.blood_units}</spam>
                  </Typography>
                  <Typography variant="h6">
                      Blood Component: 
                      <spam className="font-normal ml-3">{latestBloodRequest.blood_component_desc}</spam>
                  </Typography>
                  <Typography variant="h6">
                    Hospital: 
                    <spam className="font-normal ml-3">{latestBloodRequest.hospital}</spam>
                  </Typography>
                  <Typography variant="h6">
                    Diagnosis: 
                    <spam className="font-normal ml-3">{latestBloodRequest.diagnosis}</spam>
                  </Typography>
                  <Typography variant="h6">
                    Schedule of Transfusion/Operation: 
                    <spam className="font-normal ml-3">{formatDateTime(latestBloodRequest.schedule)}</spam>
                  </Typography>
                </div>
                <div className="flex flex-col items-end w-1/3 gap-3">
                  <Typography variant="small" color="blue-gray" className="text-md">
                    Requested on 11/11/2023 at 20:00:00
                  </Typography>
                  <Chip
                    variant="ghost"
                    size="lg"
                    color={
                      latestBloodRequest.isAccommodated === 0
                        ? chipColor[2].color
                        : latestBloodRequest.isAccommodated === 1
                        ? chipColor[0].color
                        : chipColor[1].color
                    }
                    value={
                      latestBloodRequest.isAccommodated === 0
                        ? chipColor[2].text
                        : latestBloodRequest.isAccommodated === 1
                        ? chipColor[0].text
                        : chipColor[1].text
                    }
                  />
                </div>
              </div>
            ) : (
              <Typography>No Ongoing Request</Typography>
            )}
          </CardBody>
        </Card>
    );
}
