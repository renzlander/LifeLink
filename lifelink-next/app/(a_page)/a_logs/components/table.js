import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  DocumentArrowDownIcon,
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
  Select,
  Option,
} from "@material-tailwind/react";
 
const TABLE_HEAD = [
  { label: "Log Id", key: "audit_trails_id" },
  { label: "User Id", key: "user_id" },
  { label: "Module", key: "module" },
  { label: "Action", key: "action" },
  { label: "Status", key: "status" },
  { label: "Region", key: "ip_address" },
  { label: "IP Address", key: "ip_address" },
  { label: "Region", key: "region" },
  { label: "City", key: "city" },
  { label: "Postal", key: "postal" },
  { label: "Latitude", key: "latitude" },
  { label: "Longitude", key: "longitude" },
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
  const modules = ["All Module","Collected Blood Bags", "Inventory", "User List", "Donor List", "Deferral List", "Dispensed Blood", "Donor Post", "MBD Report"];

  return (
    <Card className="h-full w-full mt-4">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Activity Logs
        </Typography>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
      <div className="flex items-center justify-between px-4 mb-4">
                <div>
                <Select  label="Select Module" >
                  {modules.map((module) => (
                    <Option key={module} value={module}>
                      {module}
                    </Option>
                  ))}
                </Select>
                </div>
                <div>
                  <Typography variant="subtitle1" className="mb-2 flex justify-center font-bold text-red-800">Date Filter</Typography>
                  <div className="flex items-center gap-4">
                    <Input
                      type="date"
                      label="Start Date"
                      className=""
                    />
                    <Typography> to </Typography>
                    <Input
                      type="date"
                      label="End Date"
                      className=""
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="flex items-center gap-3">
                    <DocumentArrowDownIcon className="h-4 w-4" /> Export to PDF
                  </Button>
                </div>
              </div>
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
                      {logs.region}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.city}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.postal}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.latitude}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      className="font-normal"
                    >
                      {logs.longitude}
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
                <td colSpan={14} className="p-4 text-center">
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
