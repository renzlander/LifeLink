import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
 
const TABLE_HEAD = [
  { label: "Log Id", key: "audit_trails_id" },
  { label: "User Id", key: "user_id" },
  { label: "Module", key: "module" },
  { label: "Action", key: "action" },
  { label: "Status", key: "status" },
  { label: "IP Address", key: "ip_address" },
  { label: "Date", key: "created_at" },
  { label: "Time", key: "created_at" },
];

const classes = "p-4";
 
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

function formatTime(dateTimeString) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true, // Use 24-hour format
  };
  const formattedTime = new Date(dateTimeString).toLocaleTimeString(
    undefined,
    options
  );
  return formattedTime;
}

 
export function LogsTable({ activityLogs }) {
  console.log('aaaaa',activityLogs);
  return (
    <Card className="h-full w-full mt-4">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Activity Logs
        </Typography>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head.key}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 sticky top-0"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head.label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activityLogs && activityLogs.length > 0 ? (
              activityLogs.map((logs, index) => (
                <tr>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Typography
                        variant="small"
                        className="font-bold"
                      >
                        {logs.audit_trails_id}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.user_id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.module}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.action}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.status}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.ip_address}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {formatDate(logs.created_at)}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {formatTime(logs.created_at)}
                    </Typography>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center">
                  No activity logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
