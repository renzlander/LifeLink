import { Card, CardHeader, CardBody, CardFooter, Typography, Chip } from "@material-tailwind/react";
import GoldBadge from "@/public/Badges/GoldBadge";
import BronzeBadge from "@/public/Badges/BronzeBadge";
import SilverBadge from "@/public/Badges/SilverBadge";
import NoneBadge from "@/public/Badges/NoBadge";

export function DonationCard({ donationSummary }) {
    return (
        <Card className="mt-6 w-full bg-gray-100">
            <CardHeader color="gray" variant="gradient" className="h-16 flex items-center mb-2">
                <Typography variant="h5" color="white" className="ml-4">
                    Donation Summary
                </Typography>
            </CardHeader>
            <CardBody className="w-full flex flex-col items-center gap-2">
                {donationSummary.badge === "none" && <NoneBadge width={200} height={200} />}
                {donationSummary.badge === "bronze" && <BronzeBadge width={200} height={200} />}
                {donationSummary.badge === "silver" && <SilverBadge width={200} height={200} />}
                {donationSummary.badge === "gold" && <GoldBadge width={200} height={200} />}
                <Chip
                    value={donationSummary.badge === "none" ? "No Badge" : donationSummary.badge === "bronze" ? "Bronze Badge" : donationSummary.badge === "silver" ? "Silver Badge" : donationSummary.badge === "gold" ? "Gold Badge" : ""}
                    color={
                        donationSummary.badge === "none"
                      ? "gray"
                      : donationSummary.badge === "bronze"
                      ? "brown" 
                      : donationSummary.badge === "silver"
                      ? "blue-gray" 
                      : "yellow"
                    }
                    variant="gradient"
                    className="text-white"
                />
            </CardBody>
            <CardFooter className="bg-white rounded-lg m-4 shadow-md flex flex-col justify-center items-center">
                <Typography variant="paragraph" color="blue-gray" className="text-base text-center flex flex-col 3xl:flex-row 2xl:flex-col items-center">
                    <span className="font-bold mx-2">{donationSummary.donationsNeeded}</span> more {donationSummary.donationsNeeded === 1 ? "Donation" : "Donations"} to unlock
                    <Chip
                        value={`${donationSummary.nextBadge} Badge`}
                        color={donationSummary.nextBadge === "bronze" ? "brown" : donationSummary.nextBadge === "silver" ? "blue-gray" : "yellow"}
                        variant="gradient"
                        className="text-white mx-2"
                    />
                    badge
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="text-center mt-4">
                    Total Donations: {donationSummary.totalDonation}
                </Typography>

                <Typography variant="paragraph" color="blue-gray" className="mt-4 text-center">
                    Dispensed Bloods: {donationSummary.dispensedBlood}
                </Typography>

                <Typography variant="paragraph" color="blue-gray" className="mt-4 text-center">
                    Received Bloods: {donationSummary.receivedBlood}
                </Typography>
            </CardFooter>
        </Card>
    );
}
