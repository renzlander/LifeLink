import { Card, Typography } from "@material-tailwind/react";

export function AgeDistributionTable({ ageDistributionLeft }) {
  const TABLE_HEAD = [
    "Age Distribution",
    "16-17",
    "18-20",
    "21-30",
    "31-40",
    "41-50",
    "51-60",
    "61-65",
    ">65",
  ];

  // Map the age distribution data to TABLE_ROWS
  const TABLE_ROWS = ageDistributionLeft.map((row) => ({
    sex: row.sex ? row.sex.toUpperCase() : "",
    sexCount: parseInt(row["count"]) || 0,
    count16_17: parseInt(row["16-17"]) || 0,
    count18_20: parseInt(row["18-20"]) || 0,
    count21_30: parseInt(row["21-30"]) || 0,
    count31_40: parseInt(row["31-40"]) || 0,
    count41_50: parseInt(row["41-50"]) || 0,
    count51_60: parseInt(row["51-60"]) || 0,
    count61_65: parseInt(row["61-65"]) || 0,
    count65: parseInt(row[">65"]) || 0,
  }));

  // Calculate totals dynamically based on the entire dataset
  const totals = TABLE_ROWS.reduce(
    (acc, row) => {
      acc.totalSexCount += row.sexCount;
      acc.total16_17Count += row.count16_17;
      acc.total18_20Count += row.count18_20;
      acc.total21_30Count += row.count21_30;
      acc.total31_40Count += row.count31_40;
      acc.total41_50Count += row.count41_50;
      acc.total51_60Count += row.count51_60;
      acc.total61_65Count += row.count61_65;
      acc.total65Count += row.count65;
      return acc;
    },
    {
      totalSexCount: 0,
      total16_17Count: 0,
      total18_20Count: 0,
      total21_30Count: 0,
      total31_40Count: 0,
      total41_50Count: 0,
      total51_60Count: 0,
      total61_65Count: 0,
      total65Count: 0,
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
          {TABLE_ROWS.map(
            (
              {
                sex,
                sexCount,
                count16_17,
                count18_20,
                count21_30,
                count31_40,
                count41_50,
                count51_60,
                count61_65,
                count65,
              },
              index
            ) => (
              <tr key={sex}>
                {[
                  sex,
                  sexCount,
                  count16_17,
                  count18_20,
                  count21_30,
                  count31_40,
                  count41_50,
                  count51_60,
                  count61_65,
                  count65,
                ].map((value, idx) => (
                  <td
                    key={idx}
                    className="p-4 border-b border-r border-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {value}
                    </Typography>
                  </td>
                ))}
              </tr>
            )
          )}
          <tr>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                TOTAL :
              </Typography>
            </td>
            {Object.values(totals).map((total, index) => (
              <td
                key={index}
                className="p-4 border-b border-r border-blue-gray-50"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
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

export function AgeCountTable({ ageDistributionRight }) {
  // Define the table head with dynamic column names
  const TABLE_HEAD = ["18-24", "25-44", "45-64", ">=65"];

  // Create an array for male and female rows separately based on the response
  const TABLE_ROWS_MALE = ageDistributionRight.filter(
    (row) => row.sex === "Male"
  );
  const TABLE_ROWS_FEMALE = ageDistributionRight.filter(
    (row) => row.sex === "Female"
  );

  // Calculate the totals for each age group
  const total18Count =
    TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row["18-24"]), 0) +
    TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row["18-24"]), 0);
  const total25Count =
    TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row["25-44"]), 0) +
    TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row["25-44"]), 0);
  const total45Count =
    TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row["45-64"]), 0) +
    TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row["45-64"]), 0);
  const total65Count =
    TABLE_ROWS_MALE.reduce((sum, row) => sum + parseInt(row[">=65"]), 0) +
    TABLE_ROWS_FEMALE.reduce((sum, row) => sum + parseInt(row[">=65"]), 0);

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
          {TABLE_ROWS_MALE.map((row, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";

            return (
              <tr key={row.sex + index}>
                {TABLE_HEAD.map((ageGroup) => (
                  <td className={classes} key={ageGroup}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row[ageGroup]}
                    </Typography>
                  </td>
                ))}
              </tr>
            );
          })}

          {TABLE_ROWS_FEMALE.map((row, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";

            return (
              <tr key={row.sex + index}>
                {TABLE_HEAD.map((ageGroup) => (
                  <td className={classes} key={ageGroup}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row[ageGroup]}
                    </Typography>
                  </td>
                ))}
              </tr>
            );
          })}

          <tr>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {total18Count}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {total25Count}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {total45Count}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {total65Count}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
