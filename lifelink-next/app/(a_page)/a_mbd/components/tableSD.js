import React from "react";
import { Card, Typography } from "@material-tailwind/react";
 
export function SexDistributionTable({ totalMaleAndFemale, totalDonorTypes}) {

  const TABLE_HEAD = ["Sex Distribution","First Time", "Lapsed", "Regular"];
  const donorTypeMap = totalDonorTypes.reduce((acc, item) => {
    acc[item.sex] = item;
    return acc;
  }, {});

  const TABLE_ROWS = totalMaleAndFemale.map((data) => {
    const donorType = donorTypeMap[data.sex] || { "First Time": 0, "Lapsed": 0, "Regular": 0 };

    return {
      sex: data.sex,
      sexCount: data.total_count,
      ftCount: Number(donorType["First Time"]), 
      lapseCount: Number(donorType["Lapsed"]),   
      regCount: Number(donorType["Regular"]),     
    };
  });

  // Calculate totals based on the table rows
  const totals = TABLE_ROWS.reduce(
    (acc, { sexCount, ftCount, lapseCount, regCount }) => {
      acc.totalSexCount += sexCount;
      acc.totalFtCount += ftCount;
      acc.totalLapseCount += lapseCount;
      acc.totalRegCount += regCount;
      return acc;
    },
    { totalSexCount: 0, totalFtCount: 0, totalLapseCount: 0, totalRegCount: 0 }
  );

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                colSpan={head === TABLE_HEAD[0] ? 2 : 1}
                className="border-b border-r border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map(({ sex, sexCount, ftCount, lapseCount, regCount }, index) => (
            <tr key={sex}>
              {[sex, sexCount, ftCount, lapseCount, regCount].map((value, idx) => (
                <td key={idx} className="p-4 border-b border-r border-blue-gray-50">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {value}
                  </Typography>
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                TOTAL :
              </Typography>
            </td>
            {Object.values(totals).map((total, index) => (
              <td key={index} className="p-4 border-b border-r border-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {total}
                </Typography>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Card>
  );
}



export function SexCountTable({ donateFrequency }) {
  // Define the table headers
  const TABLE_HEAD = ["1x", "2x", "3x", "4x", "5x", ">=6x"];

  // Create rows for both Male and Female based on the API response
  const TABLE_ROWS = donateFrequency.map((data) => {
    return {
      sex: data.sex,
      ...data,
    };
  });

  // Calculate totals for each column
  const totals = TABLE_HEAD.map((column) =>
    TABLE_ROWS.reduce((sum, data) => sum + parseInt(data[column]), 0)
  );

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th
                key={index}
                className="border-b border-r border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((rowData, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";

            return (
              <tr key={index}>
                {TABLE_HEAD.map((column, columnIndex) => (
                  <td key={columnIndex} className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {rowData[column]}
                    </Typography>
                  </td>
                ))}
              </tr>
            );
          })}
          <tr>
            {totals.map((total, index) => (
              <td key={index} className="p-4 border-b border-r border-blue-gray-50">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {total}
                </Typography>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

