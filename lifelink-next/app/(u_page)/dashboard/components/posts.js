import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
} from "@material-tailwind/react";
import Image from "next/image";

export function PostsCard() {

return (
  <Card className="mt-6 w-full bg-gray-100">
    <CardHeader color='gray' variant='gradient' className="h-16 flex items-center mb-2">
      <Typography variant="h5" color="white" className="ml-4">
        Recent Posts
      </Typography>
    </CardHeader>
    <CardBody className='w-full flex flex-col items-center gap-4'>
      <Card className="w-full">
        <CardHeader floated={false} shadow={false} className="p-4 m-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image src="/prc_logo.png" alt="RedCross" width={50} height={50} />
              <div>
                <Typography variant="h5" color="blue-gray">
                  Valenzuela City Philippines Red Cross
                </Typography>
                <Typography variant="paragraph" color="blue-gray">
                  April 08, 2023 - 10:23 PM
                </Typography>
              </div>
            </div>
          <div>
            <Typography variant="paragraph" color="blue-gray">
              Valenzuela City Philippines Red Cross
            </Typography>
            <Typography variant="paragraph" color="blue-gray">
              April 08, 2023 - 10:23 PM
            </Typography>
          </div>
        </CardHeader>
        <CardBody>
          <Typography variant="small" color="blue-gray">
            "We are currently seeking donations of O+ and A+ blood because it's not available at our facility. The blood donation event will take place at Alert Center Valenzuela City on November 16, 2023. Your generous donation can help save lives in our community. We kindly request donors to come forward and support this important cause. Your contribution can make a significant difference in the lives of those in need. We appreciate your willingness to help."
          </Typography>
        </CardBody>
      </Card>
    </CardBody>
    <CardFooter className="border-t-2 flex flex-col justify-center items-center p-2">
      <Typography variant="paragraph" color="blue-gray" className="text-center">
        View All {">"}
      </Typography>
    </CardFooter>
  </Card>
);
}