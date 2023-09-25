import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
  } from "@material-tailwind/react";
   
  export function PostCard() {
    return (
      <Card shadow={false} className="p-4 w-full shadow-md">
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="mx-0 flex items-center gap-4 pt-0 pb-8"
        >
          <Avatar
            size="lg"
            variant="circular"
            src="/next.svg"
          />
        <div className="flex w-full justify-between gap-0.5">
            <div className="flex flex-col">
                <Typography variant="h5" color="blue-gray">
                    Tania Andrew
                </Typography>
                <Typography color="blue-gray">April 08, 2023 - 10:23 PM</Typography>
            </div>
            <Typography color="blue-gray">No. of Donations : 2</Typography>
        </div>
        </CardHeader>
        <CardBody className="mb-6 p-0">
          <Typography>
            &quot;I found solution to all my design needs from Creative Tim. I use
            them as a freelancer in my hobby projects for fun! And its really
            affordable, very humble guys !!!&quot;
          </Typography>
        </CardBody>
      </Card>
    );
  }