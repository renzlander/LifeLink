import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";

const formatDate = (donationDate) => {
  const formattedDate = new Date(donationDate).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
  });

  return formattedDate;
};
export function PostsCard({recentPost}) {

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
                  Posted on:{formatDate(recentPost.created_at)}
                </Typography>
              </div>
            </div>
          <div>
            <Typography variant="paragraph" color="blue-gray">
              Donation Date: {formatDate(recentPost.donation_date)}
            </Typography>
            <Typography variant="paragraph" color="blue-gray">
              Venue: {recentPost.venue}
            </Typography>
          </div>
        </CardHeader>
        <CardBody>
          <Typography color="blue-gray">Blood Type Need : <span>{recentPost.blood_needs}</span></Typography>
          <Typography variant="small" color="blue-gray" className="mt-2">
            {recentPost.body}
          </Typography>
        </CardBody>
      </Card>
    </CardBody>
    <CardFooter className="border-t-2 flex flex-col justify-center items-center p-2">
      <Link href="./network">
        <Typography variant="paragraph" color="blue-gray" className="text-center">
          View All {">"}
        </Typography>
      </Link>
    </CardFooter>
  </Card>
);
}