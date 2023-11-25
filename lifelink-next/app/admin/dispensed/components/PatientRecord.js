import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

function calculateAge(dob) {
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
        <div className="mb-6">
          <div className="mb-4">
            <table className="w-full table-auto">
              <tbody>
                <tr>
                  <td className="pr-2 py-2">
                    <strong>Patient Name:</strong>
                  </td>
                  <td className="pl-2 py-2">
                    {`${firstRecord?.first_name} ${firstRecord?.middle_name} ${firstRecord?.last_name}`}
                  </td>
                  <td className="pr-2 py-2 pl-12">
                    <strong>Blood Type:</strong>
                  </td>
                  <td className="pl-2 py-2">{firstRecord?.blood_type}</td>
                </tr>
                <tr>
                  <td className="pr-2 py-2">
                    <strong>Date of Birth:</strong>
                  </td>
                  <td className="pl-2 py-2">{formatDate(firstRecord?.dob)}</td>
                  <td className="pr-2 py-2 pl-12">
                    <strong>Age:</strong>
                  </td>
                  <td className="pl-2 py-2">{age}</td>
                </tr>
                <tr>
                  <td className="pr-2 py-2">
                    <strong>Sex:</strong>
                  </td>
                  <td className="pl-2 py-2">{firstRecord?.sex}</td>
                  <td className="pr-2 py-2 ml-8"></td>
                  <td className="pl-2 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <hr className="border-b border-gray-400 my-6" />

          <div className="mb-6 flex flex-row justify-between">
            <div>
              <strong>Serial Numbers Received:</strong>
              <ul className="list-disc ml-4">
                {serialNumbers.map((serial, index) => (
                  <li key={index}>{serial}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Hospital:</strong>
              <p>{firstRecord?.hospital}</p>
            </div>
            <div>
              <strong>Date Received:</strong>
              <p>{formatDate(firstRecord?.created_at)}</p>
            </div>
            <div>
              <strong>Payment:</strong>
              <p>{firstRecord?.payment}</p>
            </div>
          </div>

          <hr className="border-b border-gray-400 my-6" />
          {donors && donors.length > 0 && (
            <>
              <hr className="border-b border-gray-400 my-6" />
              <div className="mb-6">
                <strong>Donors:</strong>
                <table className="table-auto">
                  <thead>
                    <tr>
                      <th className="pr-2 py-2">Serial Number</th>
                      <th className="pr-2 py-2">Donor Name</th>
                      <th className="pr-2 py-2">Blood Type</th>
                      <th className="pr-2 py-2">Date Donated</th>
                      <th className="pr-2 py-2">Venue</th>
                      <th className="pr-2 py-2">Bled By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donorData, index) => {
                      const donor = donorData[0]; // Assuming you want the first entry in each donorData array
                      const dob = donor?.dob ? new Date(donor?.dob) : null;

                      return (
                        <tr key={index}>
                          <td className="pr-2 py-2">{donor?.serial_no}</td>
                          <td className="pr-2 py-2">
                            {`${donor?.first_name} ${donor?.middle_name} ${donor?.last_name}`}
                          </td>
                          <td className="pr-2 py-2">{donor?.blood_type}</td>
                          <td className="pr-2 py-2">
                            {formatDate(donor?.date_donated)}
                          </td>
                          <td className="pr-2 py-2">{donor?.venue}</td>
                          <td className="pr-2 py-2">{donor?.bled_by}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
