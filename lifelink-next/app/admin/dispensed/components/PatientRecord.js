import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

function formatDate(dateString) {
  if (!dateString) {
    return ""; 
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

function calculateAge(dob) {
  if (!dob) {
    return ""; 
  }


  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

const TABLE_HEAD = [
  "Serial Number",
  "Donor Name",
  "Blood Type",
  "Date Donated",
  "Venue",
  "Bled By",
];

const TABLES_HEAD = [
  "Serial Numbers Received",
  "Hospital",
  "Date Received",
  "Payment",
];

export function PatientRecord({ dispensedRecords, donors }) {
  const firstRecord = dispensedRecords[0];

  const serialNumbers = firstRecord?.serial_numbers
    ? firstRecord?.serial_numbers.split(",").map((serial) => serial.trim())
    : [];

  const age = calculateAge(firstRecord?.dob);

  return (
    <Card className="w-full">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="mx-4">
          Dispensed Blood Record
        </Typography>
      </CardHeader>
      <CardBody>
        <Card className="h-full w-full" shadow={false}>
          <table className="w-full min-w-max table-auto text-left">
            <tbody>
              <tr>
                <td className="rounded-tl-lg border-r border-b border-blue-gray-100 bg-blue-gray-50 p-2">
                  <strong>Patient Name:</strong>
                </td>
                <td className="p-2 border-b border-blue-gray-50 bg-gray-50">
                  {`${firstRecord?.first_name ?? ""} ${
                    firstRecord?.middle_name ?? ""
                  } ${firstRecord?.last_name ?? ""}`}
                </td>

                <td className="border-r border-b border-blue-gray-100 bg-blue-gray-50 p-2">
                  <strong>Blood Type:</strong>
                </td>
                <td className="p-2 border-b rounded-tr-lg border-blue-gray-50 bg-gray-50">
                  {firstRecord?.blood_type}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b border-blue-gray-100 bg-blue-gray-50 p-2">
                  <strong>Sex:</strong>
                </td>
                <td className="p-2 border-b border-blue-gray-50 bg-gray-50">
                  {firstRecord?.sex}
                </td>
                <td className="border-r border-b border-blue-gray-100 bg-blue-gray-50 p-2">
                  <strong>Age:</strong>
                </td>
                <td className="p-2 border-b border-blue-gray-50 bg-gray-50">
                  {age}
                </td>
              </tr>
              <tr>
                <td className="p-2 rounded-bl-lg border-r border-blue-gray-100 bg-blue-gray-50 ">
                  <strong>Date of Birth:</strong>
                </td>
                <td className="p-2 border-b rounded-br-lg border-blue-gray-50 bg-gray-50">
                  {formatDate(firstRecord?.dob)}
                </td>
                <td className="p-2 border-b rounded-br-lg border-blue-gray-50 bg-gray-50"></td>
                <td className="p-2 rounded-br-lg border-blue-gray-50 bg-gray-50"></td>
              </tr>
            </tbody>
          </table>
        </Card>
        <hr className="fading_divider_gray my-6" />
        <div className="py-6 flex items-center justify-between">
          <div>
            <Typography variant="h6" color="gray">
              Serial Numbers Received:
            </Typography>
            <ul className="list-disc ml-6">
              {serialNumbers.map((serial, index) => (
                <li key={index}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-md font-semibold"
                  >
                    {serial}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Typography variant="h6" color="gray">
              Hospital:
            </Typography>

            <Typography variant="small" color="blue-gray" className="text-md">
              {firstRecord?.hospital_desc}
            </Typography>
          </div>
          <div>
            <Typography variant="h6" color="gray">
              Date Received:
            </Typography>
            <Typography variant="small" color="blue-gray" className="text-md">
              {formatDate(firstRecord?.created_at)}
            </Typography>
          </div>
          <div>
            <Typography variant="h6" color="gray">
              Payment:
            </Typography>
            <Typography variant="small" color="blue-gray" className="text-md">
              {firstRecord?.payment}
            </Typography>
          </div>
        </div>
        <hr className="fading_divider_gray my-6" />
        {donors && donors.length > 0 && (
          <>
            <Typography variant="h5" color="gray">
              Donors:
            </Typography>
            <Card className="h-full w-full">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head, index) => (
                      <th
                        key={head}
                        className={`border-b border-blue-gray-100 bg-blue-gray-50 p-4 ${
                          index === 0
                            ? "rounded-tl-lg"
                            : index === 5
                            ? "rounded-tr-lg"
                            : ""
                        }`}
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
                  {donors.map((donorData, index) => {
                    const donor = donorData[0];
                    return (
                      <tr key={index}>
                        <td className="p-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {donor?.serial_no}
                          </Typography>
                        </td>
                        <td className="p-2">
                          <Typography variant="small" color="blue-gray">
                            {`${donor?.first_name} ${donor?.middle_name} ${donor?.last_name}`}
                          </Typography>
                        </td>
                        <td className="p-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="text-center"
                          >
                            {donor?.blood_type}
                          </Typography>
                        </td>
                        <td className="p-2">
                          <Typography variant="small" color="blue-gray">
                            {formatDate(donor?.date_donated)}
                          </Typography>
                        </td>
                        <td className="p-2">
                          <Typography variant="small" color="blue-gray">
                            {donor?.venues_desc}
                          </Typography>
                        </td>
                        <td className="p-2">
                          <Typography variant="small" color="blue-gray">
                            {donor?.blb_first_name} {donor?.blb_middle_name}{" "}
                            {donor?.blb_last_name}
                          </Typography>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </>
        )}
      </CardBody>
    </Card>
  );
}
