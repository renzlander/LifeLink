import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";

export function PostCreated() {
  return (
    <Card shadow={false} className="p-4 w-full shadow-md my-4">
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="w-full m-0 flex 2xl:flex-row flex-col items-center justify-between"
      >
        <div className="flex gap-4">
          <Avatar size="md" variant="circular" src="/prc_logo.png" />
          <div className="flex flex-col items-start">
            <Typography variant="h5" color="blue-gray">
              Philippine Red Cross Valenzuela City Chapter
            </Typography>
            <Typography color="blue-gray" variant="small"></Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="mt-6 p-0">
        <div className="w-full flex flex-col 2xl:flex-row items-start justify-between">
          <Typography variant="h6" color="blue-gray">
            Blood Type Need : <span></span>
          </Typography>
          <div className="flex flex-col items-start">
            <Typography color="blue-gray" variant="h6" className="text-base">
              Donation Date:
              <span className="font-medium"> </span>
            </Typography>
            <Typography color="blue-gray" variant="h6" className="text-base">
              Venue : <span className="font-medium"> </span>
            </Typography>
          </div>
        </div>
        <Typography color="blue-gray" className="mt-2">
        </Typography>
      </CardBody>
    </Card>
  );
}
