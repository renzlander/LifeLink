import { Card, CardHeader, CardBody, Input, Button, Typography } from "@material-tailwind/react";
 
export function SecurityPin() {
  return (
    <Card id="security">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h5" color="blue-gray">
          Change Security Pin
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Change the security pin for the Deferral List
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Input label="Old security pin" />
        <Input label="New security pin" />
        <Input label="Confirm new security pin" />

        <Button>Change</Button>
      </CardBody>
    </Card>
  );
}