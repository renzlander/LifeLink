import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
  } from "@material-tailwind/react";

  export function BloodListCard() {
    return (
      <Card className="mt-6 w-60 h-full">
        <div className="flex mb-5">
        <CardHeader color="red" className="relative flex justify-center items-center h-20 w-20">
            <Typography variant="h2" color="white" className="mb-2">
                A+
            </Typography>
        </CardHeader>
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    Available
                </Typography>
            </CardBody>
        </div>
            <CardFooter className="border-t flex justify-center items-center">
                <Typography variant="p" color="blue-gray" className="">
                    Low
                </Typography>
            </CardFooter>
      </Card>
    );
  }