import React from "react";
import { Card, Typography } from "@material-tailwind/react";
 
export function AgeDistributionTable() {
  const TABLE_HEAD = ["Age Distribution", "16-17", "18-20", "21-30", "31-40", "41-50", "51-60", "61-65", ">65"];
  const TABLE_ROWS = [
    { sex: "MALE", sexCount: 50, count16_17: 25, count18_20: 12, count21_30: 3, count31_40: 3, count41_50: 3, count51_60: 3, count61_65: 3, count65: 3 },
    { sex: "FEMALE", sexCount: 50, count16_17: 25, count18_20: 12, count21_30: 3, count31_40: 3, count41_50: 3, count51_60: 3, count61_65: 3, count65: 3 },
  ];

  const totals = TABLE_ROWS.reduce(
    (acc, { sexCount, count16_17, count18_20, count21_30, count31_40, count41_50, count51_60, count61_65, count65 }) => {
      acc.totalSexCount += sexCount;
      acc.total16_17Count += count16_17;
      acc.total18_20Count += count18_20;
      acc.total21_30Count += count21_30;
      acc.total31_40Count += count31_40;
      acc.total41_50Count += count41_50;
      acc.total51_60Count += count51_60;
      acc.total61_65Count += count61_65;
      acc.total65Count += count65;
      return acc;
    },
    { totalSexCount: 0, total16_17Count: 0, total18_20Count: 0, total21_30Count: 0, total31_40Count: 0, total41_50Count: 0, total51_60Count: 0, total61_65Count: 0, total65Count: 0 }
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
          {TABLE_ROWS.map(({ sex, sexCount, count16_17, count18_20, count21_30, count31_40, count41_50, count51_60, count61_65, count65 }, index) => (
            <tr key={sex}>
              {[sex, sexCount, count16_17, count18_20, count21_30, count31_40, count41_50, count51_60, count61_65, count65].map((value, idx) => (
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

export function AgeCountTable() {
  const TABLE_HEAD = ["18-24", "24-44", "45-64", "≥65"];
  const TABLE_ROWS_MALE = [
    {
      male18_24: 23,
      male24_44: 25,
      male45_64: 25,
      male65: 12,
    },
  ];
  const TABLE_ROWS_FEMALE = [
    {
      female18_24: 23,
      female24_44: 25,
      female45_64: 25,
      female65: 12,
    },
  ];
  const total18Count = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.male18_24), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.female18_24), 0);
  const total24Count = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.male24_44), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.female24_44), 0);
  const total45Count = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.male45_64), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.female45_64), 0);
  const total65Count = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.male65), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.female65), 0);

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
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
          {TABLE_ROWS_MALE.map(({ male18_24, male24_44, male45_64, male65 }, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";
 
            return (
              <tr>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {male18_24}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {male24_44}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {male45_64}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {male65}
                  </Typography>
                </td>
              </tr>
            );
          })}
          {TABLE_ROWS_FEMALE.map(({ female18_24, female24_44, female45_64, female65 }, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";
 
            return (
              <tr>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {female18_24}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {female24_44}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {female45_64}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {female65}
                  </Typography>
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total18Count}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total24Count}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total45Count}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {total65Count}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}