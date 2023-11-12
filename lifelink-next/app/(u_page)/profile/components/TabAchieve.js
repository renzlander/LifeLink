import React, { useState, useEffect} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
  Avatar,
  Chip,
  IconButton,
} from "@material-tailwind/react";
 import NoneBadge from "@/public/Badges/NoBadge";
 import BronzeBadge from "@/public/Badges/BronzeBadge";
 import SilverBadge from "@/public/Badges/SilverBadge";
 import GoldBadge from "@/public/Badges/GoldBadge";

export function TabAchieve({ userDetails, donationSummary }) {

  return (
    <Card>
      <CardBody className="grid grid-cols-1 gap-4 gap-y-4">
          <div className="col-span-1 px-2 pb-4 gap-4">
            <Typography variant="h6" className="font-sans text-lg text-blue-gray-700 mb-6">
              Badge Collections
            </Typography>
            <div className="flex items-center gap-4 overflow-x-auto pb-6">
              <Card className="bg-gray-100">
                <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
                  <BronzeBadge width={200} height={200} />
                  <Chip
                      value="Bronze Badge"
                      color="brown" 
                      variant="gradient"
                      className="text-white"
                  />
                </CardBody>
                <CardFooter className="border-t-2 p-4">
                  <Typography>
                    Date Achieved: November 11, 2022
                  </Typography>
                </CardFooter>
              </Card>
              <Card className="bg-gray-100">
                <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
                  <BronzeBadge width={200} height={200} />
                  <Chip
                      value="Bronze Badge"
                      color="brown" 
                      variant="gradient"
                      className="text-white"
                  />
                </CardBody>
                <CardFooter className="border-t-2 p-4">
                  <Typography>
                    Date Achieved: November 11, 2022
                  </Typography>
                </CardFooter>
              </Card>
              <Card className="bg-gray-100">
                <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
                  <BronzeBadge width={200} height={200} />
                  <Chip
                      value="Bronze Badge"
                      color="brown" 
                      variant="gradient"
                      className="text-white"
                  />
                </CardBody>
                <CardFooter className="border-t-2 p-4">
                  <Typography>
                    Date Achieved: November 11, 2022
                  </Typography>
                </CardFooter>
              </Card>
              <Card className="bg-gray-100">
                <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
                  <BronzeBadge width={200} height={200} />
                  <Chip
                      value="Bronze Badge"
                      color="brown" 
                      variant="gradient"
                      className="text-white"
                  />
                </CardBody>
                <CardFooter className="border-t-2 p-4">
                  <Typography>
                    Date Achieved: November 11, 2022
                  </Typography>
                </CardFooter>
              </Card>
              <Card className="bg-gray-100">
                <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
                  <BronzeBadge width={200} height={200} />
                  <Chip
                      value="Bronze Badge"
                      color="brown" 
                      variant="gradient"
                      className="text-white"
                  />
                </CardBody>
                <CardFooter className="border-t-2 p-4">
                  <Typography>
                    Date Achieved: November 11, 2022
                  </Typography>
                </CardFooter>
              </Card>
              <Card className="bg-gray-100">
                <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
                  <BronzeBadge width={200} height={200} />
                  <Chip
                      value="Bronze Badge"
                      color="brown" 
                      variant="gradient"
                      className="text-white"
                  />
                </CardBody>
                <CardFooter className="border-t-2 p-4">
                  <Typography>
                    Date Achieved: November 11, 2022
                  </Typography>
                </CardFooter>
              </Card>
              <Card className="bg-gray-100">
                <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
                  <BronzeBadge width={200} height={200} />
                  <Chip
                      value="Bronze Badge"
                      color="brown" 
                      variant="gradient"
                      className="text-white"
                  />
                </CardBody>
                <CardFooter className="border-t-2 p-4">
                  <Typography>
                    Date Achieved: November 11, 2022
                  </Typography>
                </CardFooter>
              </Card>
            </div>
          </div>
      </CardBody>
    </Card>
  );
}