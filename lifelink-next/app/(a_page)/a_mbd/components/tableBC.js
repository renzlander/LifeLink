import { Card, Typography } from "@material-tailwind/react";
 
const TABLE_HEAD = ["Blood Type", "Successful", "Spoilage"];
 
const TABLE_ROWS = [
  {
    bTypes: "O",
    successCount: 0,
    spoilCount: 0,
  },
  {
    bTypes: "A",
    successCount:0,
    spoilCount: 0,
  },
  {
    bTypes: "B",
    successCount: 0,
    spoilCount: 0,
  },
  {
    bTypes: "AB",
    successCount: 0,
    spoilCount: 0,
  },
];


export function BloodCollectionTable({ bloodCollection }) {
  const totalSuccessCount = bloodCollection.reduce((sum, row) => sum + parseInt(row.Count), 0);
  const totalSpoilCount = bloodCollection.reduce((sum, row) => sum, 0); // You should update this according to your business logic

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
            <th
              className="border-b border-r border-blue-gray-100 bg-gray-50 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Blood Type
              </Typography>
            </th>
            <th
              className="border-b border-r border-blue-gray-100 bg-gray-50 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Successful
              </Typography>
            </th>
            <th
              className="border-b border-r border-blue-gray-50 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                Spoilage
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {bloodCollection.map(({ blood_type, Count }, index) => {
            const classes = "p-4 border-b border-r border-blue-gray-50";
 
            return (
              <tr key={blood_type}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {blood_type}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {Count}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {0} {/* You should update this to display spoilage based on your business logic */}
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