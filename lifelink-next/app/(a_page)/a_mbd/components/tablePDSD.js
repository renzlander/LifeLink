import React from "react";
import { Card, Typography } from "@material-tailwind/react";

export function PDSexDistributionTable({ bloodCollectionPD }) {
  // Female
  const femaleData = bloodCollectionPD.find((data) => data.Gender === "Female");
  const oValueForFemale = femaleData ? femaleData.O : "0";
  const aValueForFemale = femaleData ? femaleData.A : "0";
  const bValueForFemale = femaleData ? femaleData.B : "0";
  const abValueForFemale = femaleData ? femaleData.AB : "0";
  const minAgeFemale = femaleData ? femaleData.MinAge : "0";
  const maxAgeFemale = femaleData ? femaleData.MaxAge : "0";
  const firstTimeFemale = femaleData ? femaleData.first_time : "0";
  const regularFemale = femaleData ? femaleData.regular : "0";
  const lapsedFemale = femaleData ? femaleData.lapsed : "0";


  // Male
  const maleData = bloodCollectionPD.find((data) => data.Gender === "Male");
  const oValueForMale = maleData ? maleData.O : "0";
  const aValueForMale = maleData ? maleData.A : "0";
  const bValueForMale = maleData ? maleData.B : "0";
  const abValueForMale = maleData ? maleData.AB : "0";
  const minAgeMale = maleData ? maleData.MinAge : "0";
  const maxAgeMale = maleData ? maleData.MaxAge : "0";
  const firstTimeMale = maleData ? maleData.first_time : "0";
  const regularMale = maleData ? maleData.regular : "0";
  const lapsedMale = maleData ? maleData.lapsed : "0";

  const TABLE_HEAD = ["Sex Distribution", "O", "A", "B", "AB", "Age", "FT", "RR", "RL", ""];
  const TABLE_ROWS = [
    {
      sex: "MALE",
      sexCount: parseInt(oValueForMale) + parseInt(aValueForMale) + parseInt(bValueForMale) + parseInt(abValueForMale),
      O: oValueForMale,
      A: aValueForMale,
      B: bValueForMale,
      AB: abValueForMale,
      age: minAgeMale + "-" + maxAgeMale,
      ftCount: firstTimeFemale,
      rrCount: regularFemale,
      rlCount: lapsedFemale,
    },
    {
      sex: "FEMALE",
      sexCount: parseInt(oValueForFemale) + parseInt(aValueForFemale) + parseInt(bValueForFemale) + parseInt(abValueForFemale),
      O: oValueForFemale,
      A: aValueForFemale,
      B: bValueForFemale,
      AB: abValueForFemale,
      age: minAgeFemale + "-" + maxAgeFemale,
      ftCount: firstTimeMale,
      rrCount: regularMale,
      rlCount: lapsedMale,
    },
  ];



  // Calculate the total age range
  const totalMinAgeMale = parseInt(minAgeMale, 10);
  const totalMaxAgeMale = parseInt(maxAgeMale, 10);
  const totalMinAgeFemale = parseInt(minAgeFemale, 10);
  const totalMaxAgeFemale = parseInt(maxAgeFemale, 10);
  const totalMinAge = Math.min(totalMinAgeMale, totalMinAgeFemale);
  const totalMaxAge = Math.max(totalMaxAgeMale, totalMaxAgeFemale);
  const totalAgeRange = `${totalMinAge}-${totalMaxAge}`;

  // Calculate the totals
    const totals = TABLE_ROWS.reduce(
    (acc, { sexCount, O, A, B, AB, age, ftCount, rrCount, rlCount }) => {
      acc.totalSexCount += sexCount;
      acc.totalOCount += parseInt(O, 10);
      acc.totalACount += parseInt(A, 10);
      acc.totalBCount += parseInt(B, 10);
      acc.totalABCount += parseInt(AB, 10);
      acc.totalAgeCount = totalAgeRange; // Please make sure you calculate the age range here.
      acc.totalFtCount += parseInt(ftCount, 10); // Convert to number and add
      acc.totalRrCount += parseInt(rrCount, 10); // Convert to number and add
      acc.totalRlCount += parseInt(rlCount, 10); // Convert to number and add
      return acc;
    },
    {
      totalSexCount: 0,
      totalOCount: 0,
      totalACount: 0,
      totalBCount: 0,
      totalABCount: 0,
      totalAgeCount: "",
      totalFtCount: 0,
      totalRrCount: 0,
      totalRlCount: 0,
    }
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
