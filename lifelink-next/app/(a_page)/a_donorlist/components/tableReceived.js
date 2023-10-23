import { Card, Typography } from "@material-tailwind/react";
 
const TABLE_HEAD = ["Serial No.", "Date Received"];
 
const TABLE_ROWS = [
  {
    serial: "xxxx-xxxxxx-x",
    date: "23/04/18",
  },
];
 
export function TableReceived() {
  return (
    <Card className="h-56 w-full overflow-y-auto">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
          {TABLE_ROWS.map(({ serial, date }, index) => (
            <tr key={serial} className="even:bg-blue-gray-50/50">
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {serial}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                  {date}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}