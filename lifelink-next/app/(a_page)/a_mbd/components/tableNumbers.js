import React from "react";
import { Card, Typography } from "@material-tailwind/react";

export function NumbersTable() {
  const TABLE_HEAD1 = ["No. of blood units collected", "No. of donors bled", "No. of unsuccessful donation", "No. of deferred donors"];
  const TABLE_HEAD2 = ["No. of bags used", "No. of spoiled bags", "No. of defective bags", "No. of donors with adverse reaction"];
  const TABLE_COL1 = [1,2,3,4];
  const TABLE_COL2 = [1,2,3,4];

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <tbody>
          {TABLE_HEAD1.map((head, index) => (
            <tr key={head}>
              <th className="border-b border-r border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
              <td className="border-b border-r border-blue-gray-100 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal text-center leading-none opacity-70"
                >
                  {TABLE_COL1[index]}
                </Typography>
              </td>
              <td className="border-b border-r border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {TABLE_HEAD2[index]}
                </Typography>
              </td>
              <td className="border-b border-r border-blue-gray-100 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal text-center leading-none opacity-70"
                >
                  {TABLE_COL2[index]}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
