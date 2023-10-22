import { Card, Typography } from "@material-tailwind/react";
 
const TABLE_HEAD = ["Blood Type", "Successful", "Spoilage"];
 
const TABLE_ROWS = [
  {
    bTypes: "O",
    successCount: 12,
    spoilCount: 3,
  },
  {
    bTypes: "A",
    successCount: 5,
    spoilCount: 1,
  },
  {
    bTypes: "B",
    successCount: 7,
    spoilCount: 2,
  },
  {
    bTypes: "AB",
    successCount: 3,
    spoilCount: 0,
  },
];
 
export function BloodCollectionTable() {
  const totalSuccessCount = TABLE_ROWS.reduce((sum, row) => sum + parseInt(row.successCount), 0);
  const totalSpoilCount = TABLE_ROWS.reduce((sum, row) => sum + parseInt(row.spoilCount), 0);

  return (
    <Card className="h-full w-full">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
              <th
                colSpan={3}
                className="rounded-t-xl border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70 text-center"
                >
                  BLOOD COLLECTION
                </Typography>
              </th>
          </tr>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-r border-blue-gray-100 bg-gray-50 p-4"
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
          {TABLE_ROWS.map(({ bTypes, successCount, spoilCount }, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";
 
            return (
              <tr key={bTypes}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {bTypes}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {successCount}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {spoilCount}
                  </Typography>
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                TOTAL:
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {totalSuccessCount}
              </Typography>
            </td>
            <td className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                {totalSpoilCount}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}