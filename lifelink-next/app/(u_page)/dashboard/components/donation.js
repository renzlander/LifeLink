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
                            ? "black"
                            : donationSummary.badge === "bronze"
                            ? "brown" 
                            : donationSummary.badge === "silver"
                            ? "silver" 
                            : donationSummary.badge === "gold"
                            ? "yellow"
                            : ""
                    }
                    variant="gradient"
                    className="text-white"
                />
            </CardBody>
            <CardFooter className="bg-white rounded-lg m-4 shadow-md flex flex-col justify-center items-center">
                <Typography variant="paragraph" color="blue-gray" className="mt-4 text-center flex items-center">
                    Need <span className="font-bold mx-1">{donationSummary.donationsNeeded}</span> more Donation/s to unlock
                    <Chip
                        value={donationSummary.nextBadge}
                        color={donationSummary.nextBadge === "bronze" ? "brown" : donationSummary.nextBadge === "silver" ? "silver" : donationSummary.nextBadge === "gold" ? "yellow" : ""}
                        variant="gradient"
                        className="text-white mx-2"
                    />{" "}
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
