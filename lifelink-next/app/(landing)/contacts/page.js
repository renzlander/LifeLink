'use client'
import { Card, Typography } from "@material-tailwind/react";
import { 
  HomeIcon, 
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

export default function ContactUs() {
  return (
    <main className="min-h-screen grid grid-cols-8">
      <Card className="w-full h-fit mt-8 col-start-2 col-end-8 p-8 gap-8">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Contact Us
        </Typography>
        <div className="grid grid-cols-2 gap-12">
          <div className="col-span-2 2xl:col-span-1 flex flex-col items-center gap-3">
            <HomeIcon className="h-10 w-10 text-orange-600" />
            <Typography variant="small" color="orange" className="font-light text-lg">
              BY GOING TO OUR ADDRESS
            </Typography>
            <Typography variant="small" color="blue-gray" className="text-center">
              2/F Red Cross Building, ALERT Center Compound, Brgy. Malinta, Valenzuela, Philippines
            </Typography>
          </div>
          <div className="col-span-2 2xl:col-span-1 flex flex-col items-center gap-3">
            <EnvelopeIcon className="h-10 w-10 text-blue-600" />
            <Typography variant="small" color="blue" className="font-light text-lg">
              BY SENDING US AN EMAIL
            </Typography>
            <div className="grid place-items-center gap-6">
              <Typography variant="small" color="blue-gray" className="text-md">
                valenzuela@redcross.org.ph
              </Typography>
              <Typography variant="small" color="blue-gray" className="text-md">
                redcrossyouthvalenzuela@gmail.com
              </Typography>
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}
