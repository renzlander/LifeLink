import { Typography } from "@material-tailwind/react";

export function DeferralSexTable({ tempCategoriesDeferral }) {
  const TABLE_HEAD = ["Sex Distribution", "History", "Low HGB", "Others"];

  // Create an array for the table rows based on the response data
  const TABLE_ROWS = tempCategoriesDeferral.map((row) => ({
    sex: row.sex,
    sexCount: row.count,
    historyCount: row.history,
    lowHGBCount: row.low_hgb,
    othersCount: row.others,
  }));

  // Calculate the totals for each category
  const totals = TABLE_ROWS.reduce(
    (acc, { sexCount, historyCount, lowHGBCount, othersCount }) => {
      acc.totalSexCount += parseInt(sexCount, 10);
      acc.totalHistoryCount += parseInt(historyCount, 10);
      acc.totalHGBCount += parseInt(lowHGBCount, 10);
      acc.totalOthersCount += parseInt(othersCount, 10);
      return acc;
    },
    {
      totalSexCount: 0,
      totalHistoryCount: 0,
      totalHGBCount: 0,
      totalOthersCount: 0,
    }
  );

  return (
    <div className="h-full w-full">
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
              { sex, sexCount, historyCount, lowHGBCount, othersCount },
              index
            ) => (
              <tr key={sex}>
                {[sex, sexCount, historyCount, lowHGBCount, othersCount].map(
                  (value, idx) => (
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
                  )
                )}
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
    </div>
  );
}

export function DefSexCountTable({ countDeferral }) {
  const TABLE_HEAD = ["TEMPORARY", "PERMANENT"];

  // Create an array for male and female rows separately based on the response
  const TABLE_ROWS_MALE = countDeferral.filter((row) => row.sex === "Female");
  const TABLE_ROWS_FEMALE = countDeferral.filter((row) => row.sex === "Male");

  // Calculate the totals for each category, checking if the array is empty
  const totalTempMale =
    TABLE_ROWS_MALE.length > 0
      ? TABLE_ROWS_MALE.reduce(
          (sum, row) => sum + parseInt(row.temporary, 10),
          0
        )
      : 0;
  const totalPermMale =
    TABLE_ROWS_MALE.length > 0
      ? TABLE_ROWS_MALE.reduce(
          (sum, row) => sum + parseInt(row.permanent, 10),
          0
        )
      : 0;
  const totalTempFemale =
    TABLE_ROWS_FEMALE.length > 0
      ? TABLE_ROWS_FEMALE.reduce(
          (sum, row) => sum + parseInt(row.temporary, 10),
          0
        )
      : 0;
  const totalPermFemale =
    TABLE_ROWS_FEMALE.length > 0
      ? TABLE_ROWS_FEMALE.reduce(
          (sum, row) => sum + parseInt(row.permanent, 10),
          0
        )
      : 0;

  return (
    <div className="h-full w-full">
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
                {TABLE_HEAD.map((category) => (
                  <td className={classes} key={category}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row[category.toLowerCase()]}
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
                {TABLE_HEAD.map((category) => (
                  <td className={classes} key={category}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row[category.toLowerCase()]}
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
                {totalTempMale + totalTempFemale}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                {totalPermMale + totalPermFemale}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
