"use client";
import { useRouter } from "next/navigation";
import { Button, Typography } from "@material-tailwind/react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen grid grid-cols-8">
      <div className="ml-16 col-start-1 col-end-6">
        <div className="flex flex-col w-full mx-auto mt-8">
          <Typography
            variant="h1"
            className="2xl:text-9xl text-5xl text-[#424242]"
          >
            DONATE
          </Typography>
          <Typography
            variant="h1"
            className="2xl:text-9xl text-5xl text-[#d1071b]"
          >
            Blood
          </Typography>
          <Typography
            variant="h1"
            className="2xl:text-9xl text-5xl text-[#424242]"
          >
            Save
            <span className="text-[#d1071b]">&nbsp;Lives.</span>
          </Typography>

          <div className="w-full flex flex-wrap justify-evenly my-8 font-light text-xl gap-6">
            <Button
              onClick={() => {
                router.push("/login");
              }}
              className="bg-[#d1071b] w-full 2xl:w-1/4 border rounded-full hover:bg-white hover:text-[#d1071b]"
            >
              Get Started
            </Button>
            <Button
              onClick={() => {
                router.push("/news");
              }}
              className="bg-transparent w-full 2xl:w-1/4 text-[#d1071b] border border-[#d1071b] rounded-full hover:bg-[#d1071b] hover:text-white"
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
