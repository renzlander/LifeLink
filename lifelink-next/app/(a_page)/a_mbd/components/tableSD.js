import React from "react";
import { Card, Typography } from "@material-tailwind/react";
 
export function SexDistributionTable() {
  const TABLE_HEAD = ["Sex Distribution", "First Time", "Lapsed", "Regular"];
  const TABLE_ROWS = [
    { sex: "MALE", sexCount: 25, ftCount: 12, lapseCount: 3, regCount: 3 },
    { sex: "FEMALE", sexCount: 25, ftCount: 12, lapseCount: 3, regCount: 3 },
  ];

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

export function SexCountTable() {
  const TABLE_HEAD1 = ["1x", "2x", "3x", "4x", "5x", ">6x"];
  const TABLE_ROWS_MALE = [
    {
      Male1x: 23,
      Male2x: 25,
      Male3x: 25,
      Male4x: 12,
      Male5x: 3,
      Male6x: 3,
    },
  ];
  const TABLE_ROWS_FEMALE = [
    {
      Female1x: 23,
      Female2x: 25,
      Female3x: 12,
      Female4x: 3,
      Female5x: 3,
      Female6x: 3,
    },
  ];
  const total1xCount = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.Male1x), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.Female1x), 0);
  const total2xCount = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.Male2x), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.Female2x), 0);
  const total3xCount = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.Male3x), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.Female3x), 0);
  const total4xCount = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.Male4x), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.Female4x), 0);
  const total5xCount = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.Male5x), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.Female5x), 0);
  const total6xCount = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.Male6x), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.Female6x), 0);

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD1.map((head) => (
              <th
                key={head}
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
          {TABLE_ROWS_MALE.map(({ Male1x, Male2x, Male3x, Male4x, Male5x, Male6x }, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";
 
            return (
              <tr>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Male1x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Male2x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Male3x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Male4x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Male5x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Male6x}
                  </Typography>
                </td>
              </tr>
            );
          })}
          {TABLE_ROWS_FEMALE.map(({ Female1x, Female2x, Female3x, Female4x, Female5x, Female6x }, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";
 
            return (
              <tr>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Female1x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Female2x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Female3x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Female4x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Female5x}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Female6x}
                  </Typography>
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total1xCount}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total2xCount}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total3xCount}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total4xCount}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total5xCount}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total6xCount}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}