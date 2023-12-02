import {
  Avatar,
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
export function PostsCard({ recentPost }) {
  if (!recentPost) {
    return (
      <Card className="mt-6 w-full bg-gray-100">
        <CardHeader
          color="gray"
          variant="gradient"
          className="h-16 flex items-center mb-2"
        >
          <Typography variant="h5" color="white" className="ml-4">
            Recent Posts
          </Typography>
        </CardHeader>
        <CardBody className="w-full flex flex-col items-center gap-4">
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-center"
          >
            Valenzuela City Philippine Red Cross available has no recent posts .
          </Typography>
        </CardBody>
        <CardFooter className="border-t-2 flex flex-col justify-center items-center p-2">
          <Link href="./network">
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-center"
            >
              View All {">"}
            </Typography>
          </Link>
        </CardFooter>
      </Card>
    );
  }
  return (
    <Card className="mt-6 w-full bg-gray-100">
      <CardHeader
        color="gray"
        variant="gradient"
        className="h-16 flex items-center mb-2"
      >
        <Typography variant="h5" color="white" className="ml-4">
          Recent Posts
        </Typography>
      </CardHeader>
      <CardBody className="w-full flex flex-col items-center gap-4">
        <Card className="p-4 w-full shadow-md my-4">
          <CardHeader
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
                <Typography color="blue-gray" variant="small">
                  {formatDate(recentPost.created_at)}
                </Typography>
              </div>
            </div>
          </CardHeader>
          <CardBody className="mt-6 p-0">
            <div className="w-full flex flex-col 2xl:flex-row items-start justify-between">
              <Typography variant="h6" color="blue-gray">
                Blood Type Need : <span>{recentPost.blood_needs}</span>
              </Typography>
              <div className="flex flex-col items-start">
              <Typography
                color="blue-gray"
                variant="h6"
                className="text-base"
              >
                Donation Date: {formatDate(recentPost.donation_date)}
              </Typography>
              <Typography
                color="blue-gray"
                variant="h6"
                className="text-base"
              >
                Venue: {recentPost.venue}
              </Typography>
              </div>
            </div>
            <Typography color="blue-gray" className="mt-2">
              {recentPost.body}
            </Typography>
          </CardBody>
        </Card>
      </CardBody>
      <Link href="./network">
        <CardFooter className="border-t-2 flex flex-col justify-center items-center p-2 hover:bg-gray-50 hover:rounded-b-xl">
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-center"
          >
            View All {">"}
          </Typography>
        </CardFooter>
      </Link>
    </Card>
  );
}
