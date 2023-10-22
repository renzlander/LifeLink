import { Card, Typography } from "@material-tailwind/react";
 
const TABLE_ROWS = [
  {
    name: "John Michael",
  },
  {
    name: "Alexa Liras",
  },
  {
    name: "Laurent Perrier",
  },
  {
    name: "Michael Levi",
  },
  {
    name: "Richard Gran",
  },
  {
    name: "Renz Lander",
  },
  {
    name: "Ryan Antonio",
  },
  {
    name: "Ray Reyes",
  },
  {
    name: "James Robles",
  },
];
 
export function ManPowerTable() {
  const numberOfColumns = 3; // Define the number of columns in the table
  const chunkedNames = Array.from({ length: Math.ceil(TABLE_ROWS.length / numberOfColumns) }, (_, rowIndex) => {
    const rowNames = TABLE_ROWS.slice(rowIndex * numberOfColumns, (rowIndex + 1) * numberOfColumns).map(
      (item) => item.name || ""
    );

    // Add blank columns if there are 1 or 2 names in the row
    if (rowNames.length < numberOfColumns) {
      const blankColumns = Array.from({ length: numberOfColumns - rowNames.length }, (_, index) => "");
      rowNames.push(...blankColumns);
    }

    return rowNames;
  });

  return (
    <Card className="w-full rounded-t-md">
      <table className="w-full min-w-max table-auto text-left rounded-md">
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
                  MANPOWER
                </Typography>
              </th>
          </tr>
          <tr>
              <th
                colSpan={3}
                className="border-b border-blue-gray-100 bg-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  MO:
                </Typography>
              </th>
          </tr>
        </thead>
        <tbody>
          {chunkedNames.map((column, colIndex) => (
              <tr key={colIndex}>
                {column.map((name, rowIndex) => (
                  <td
                    key={rowIndex}
                    className="p-4 border-b border-r border-blue-gray-50"
                  >
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {name}
                    </Typography>
                  </td>
                ))}
              </tr>
            ))}
          {/* Row for "Number of Staff" */}
          <tr>
            <td colSpan={3} className="p-4 border-b border-r border-blue-gray-50">
              <Typography variant="small" color="blue-gray" className="font-normal">
                Number of Staff: {TABLE_ROWS.length}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}