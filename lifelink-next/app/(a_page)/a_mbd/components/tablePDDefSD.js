import React from "react";
import { Card, Typography } from "@material-tailwind/react";
 
export function PDDeferralSexTable() {
  const TABLE_HEAD = ["Sex Distribution", "History", "Low HGB", "Others"];
  const TABLE_ROWS = [
    { sex: "MALE", sexCount: 25, historyCount: 12, lowHGBCount: 3, othersCount: 3 },
    { sex: "FEMALE", sexCount: 25, historyCount: 12, lowHGBCount: 3, othersCount: 3 },
  ];

  const totals = TABLE_ROWS.reduce(
    (acc, { sexCount, historyCount, lowHGBCount, othersCount }) => {
      acc.totalSexCount += sexCount;
      acc.totalHistoryCount += historyCount;
      acc.totalHGBCount += lowHGBCount;
      acc.totalOthersCount += othersCount;
      return acc;
    },
    { totalSexCount: 0, totalHistoryCount: 0, totalHGBCount: 0, totalOthersCount: 0 }
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
          {TABLE_ROWS.map(({ sex, sexCount, historyCount, lowHGBCount, othersCount }, index) => (
            <tr key={sex}>
              {[sex, sexCount, historyCount, lowHGBCount, othersCount].map((value, idx) => (
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

export function PDDefSexCountTable() {
  const TABLE_HEAD = ["TEMPORARY", "PERMANENT"];
  const TABLE_ROWS_MALE = [
    {
      maleTemp: 23,
      malePerm: 25,
    },
  ];
  const TABLE_ROWS_FEMALE = [
    {
      femaleTemp: 23,
      femalePerm: 25,
    },
  ];
  const totalTemp = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.maleTemp), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.femaleTemp), 0);
  const totalPerm = TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row.malePerm), 0) + TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row.femalePerm), 0);

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
          {TABLE_ROWS_MALE.map(({ malePerm, maleTemp }, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";
 
            return (
              <tr>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {maleTemp}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {malePerm}
                  </Typography>
                </td>
              </tr>
            );
          })}
          {TABLE_ROWS_FEMALE.map(({ femalePerm, femaleTemp }, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";
 
            return (
              <tr>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {femaleTemp}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {femaleTemp}
                  </Typography>
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {totalTemp}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {totalPerm}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}