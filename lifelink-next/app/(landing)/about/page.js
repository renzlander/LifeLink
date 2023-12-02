"use client";
import { Card, Typography } from "@material-tailwind/react";
import Image from "next/image";

export default function About() {
  return (
    <main className="min-h-screen grid grid-cols-8">
      <Card className="w-full my-8 col-start-2 col-end-8 p-8 gap-8">
        <Typography variant="h4" color="blue-gray" className="text-center">
          About Us
        </Typography>
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/prc_logo.png"
            alt="logo"
            width={40}
            height={40}
            className="mx-auto"
          />
          <Typography variant="h6" color="blue-gray">
            The Philippine Red Cross
          </Typography>
          <Typography variant="paragraph" color="gray" className="font-medium text-justify">
            &emsp;&emsp;&emsp; Philippine Red Cross (PRC): The Philippine Red
            Cross is a non-profit organization dedicated to delivering
            humanitarian services in times of crisis and in meeting the health
            needs of vulnerable communities. It operates under the principles of
            humanity, impartiality, neutrality, independence, voluntary service,
            unity, and universality. The organization is involved in disaster
            response and management, health services, blood donation programs,
            safety services, and community resilience initiatives.
          </Typography>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo_lifelink.png"
            alt="logo"
            width={120}
            height={40}
            className="mx-auto"
          />
          <Typography variant="paragraph" color="gray" className="font-medium text-justify">
            &emsp;&emsp;&emsp; LifeLink is a group of developers from Pamantasan
            ng Lungsod ng Valenzuela, dedicated on advancing healthcare through
            innovative and technological systems. LifeLink specializes on
            development and implemention of cutting-edge systems in the field of
            blood services. With a vision to create an interconnected and
            healthy community, Lifelink aims on pioneering initiatives that will
            address issues and needs for a safe, sufficient, and readily
            available blood supply.
          </Typography>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Typography variant="h6" color="blue-gray">
            Team
          </Typography>
          <div className="w-full grid grid-cols-4 place-items-center gap-4">
            <Typography className="col-span-4 2xl:col-span-1">
              Ryan Antonio
            </Typography>
            <Typography className="col-span-4 2xl:col-span-1">
              Renz De Ocampo
            </Typography>
            <Typography className="col-span-4 2xl:col-span-1">
              Ray Reyes
            </Typography>
            <Typography className="col-span-4 2xl:col-span-1">
              James Robles
            </Typography>
          </div>
        </div>
      </Card>
    </main>
  );
}
