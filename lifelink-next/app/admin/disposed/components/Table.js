import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { TabStock } from "./TableDisposed";

export function InventoryTable() {
  return (
    <Card className="h-full w-full">
      <CardHeader color="red" className="relative h-16 flex items-center">
        <Typography variant="h4" color="white" className="ml-4">
          Disposed Blood Bags
        </Typography>
      </CardHeader>
      <CardBody className="px-0">
        <TabStock />
      </CardBody>
    </Card>
  );
}
