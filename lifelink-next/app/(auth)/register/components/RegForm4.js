import { Button, Card, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

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
          <img src="/shakehands.svg" alt="Shake Hands" className="w-80 h-80" />
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
