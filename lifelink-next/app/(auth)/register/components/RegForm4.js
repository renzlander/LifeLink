import { Button, Card, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function RegF4() {
  const router = useRouter();

  const handleNextClick = () => {
    router.push("./login");
  };

  return (
    <div className=" flex justify-center items-center">
      <Card className="w-full sm:w-96 mt-6" color="transparent" shadow={false}>
        <div className="p-8 text-center">
          <Typography variant="h4" className="mb-6" color="blue-gray">
            You're Done!
          </Typography>
          <Image src="/shakehands.svg" alt="Shake Hands" width={320} height={320} />
          <Button
            type="button"
            variant="contained"
            onClick={handleNextClick}
            className="w-full mt-8"
          >
            Please Login to continue
          </Button>
        </div>
      </Card>
    </div>
  );
}
