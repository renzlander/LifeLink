import React from "react";
import { Card, Typography } from "@material-tailwind/react";
 
export function PDSexDistributionTable({bloodCollectionPD}) {
  const TABLE_HEAD = ["Sex Distribution", "O", "A", "B", "AB", "Age", "FT", "RR", "RL", ""];
  const TABLE_ROWS = [
    { sex: "MALE", sexCount: 25, O: 235, A: 34, B: 46, AB: 23, age: 25, ftCount: 12, rrCount: 3, rlCount: 3 },
    { sex: "FEMALE", sexCount: 25, O: 235, A: 34, B: 46, AB: 23, age: 25, ftCount: 12, rrCount: 3, rlCount: 3 },
  ];

  const totals = TABLE_ROWS.reduce(
    (acc, { sexCount, O, A, B, AB, age, ftCount, rrCount, rlCount }) => {
      acc.totalSexCount += sexCount;
      acc.totalOCount += O;
      acc.totalACount += A;
      acc.totalBCount += B;
      acc.totalABCount += AB;
      acc.totalAgeCount += age;
      acc.totalFtCount += ftCount;
      acc.totalRrCount += rrCount;
      acc.totalRlCount += rlCount;
      return acc;
    },
    { totalSexCount: 0, totalOCount: 0, totalACount: 0, totalBCount: 0, totalABCount: 0, totalAgeCount: 0, totalFtCount: 0, totalRrCount: 0, totalRlCount: 0 }
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
          {TABLE_ROWS.map(({ sex, sexCount, O, A, B, AB, age, ftCount, rrCount, rlCount }, index) => (
            <tr key={sex}>
              {[sex, sexCount, O, A, B, AB, age, ftCount, rrCount, rlCount].map((value, idx) => (
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