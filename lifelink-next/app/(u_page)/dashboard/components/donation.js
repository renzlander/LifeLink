import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Chip,
} from "@material-tailwind/react";
import GoldBadge from "@/public/Badges/GoldBadge";

export function DonationCard() {

return (
  <Card className="mt-6 w-full bg-gray-100">
    <CardHeader color='gray' variant='gradient' className="h-16 flex items-center mb-2">
      <Typography variant="h5" color="white" className="ml-4">
        Donation Summary
      </Typography>
    </CardHeader>
    <CardBody className='w-full flex flex-col items-center gap-2'>
      <GoldBadge width={200} height={200} />
      <Chip value="Gold Badge" color="yellow" variant="gradient" className="text-white"/>
    </CardBody>
    <CardFooter className="bg-white rounded-lg m-4 shadow-md flex flex-col justify-center items-center">
      <Typography variant="paragraph" color="blue-gray" className="text-center">
        Total Donations: 0
      </Typography>
      
      <Typography variant="paragraph" color="blue-gray" className="mt-4 text-center">
        Next badge in 4 more Donations
      </Typography>
      
      <Typography variant="paragraph" color="blue-gray" className="mt-4 text-center">
        Dispensed Bloods: 0
      </Typography>
    </CardFooter>
  </Card>
);
}