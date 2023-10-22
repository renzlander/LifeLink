import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Chip,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { ManPowerTable } from "./tableMP";
import { BloodCollectionTable } from "./tableBC";
import { SexDistributionTable, SexCountTable } from "./tableSD";
import { AgeDistributionTable, AgeCountTable } from "./tableAD";
import { DeferralSexTable, DefSexCountTable } from "./tableDefSD";
import { NumbersTable } from "./tableNumbers";
import { PDSexDistributionTable } from "./tablePDSD";
import { PDDeferralSexTable, PDDefSexCountTable } from "./tablePDDefSD";
 
export function MBDCard() {
  return (
    <Card className="w-full">
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-4 pl-6 h-16 flex justify-start items-center"
      >
        <Typography variant="h3" color="white">
          In House Donation Report
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-6">
        <div className="flex items-center gap-2 w-full">
          <div className="flex flex-col items-start justify-center gap-2 w-1/2">
            <div className="flex items-center gap-2 w-full">
              <Input label="Start Date" type="date" />
              <ArrowRightIcon className="h-5 w-5 text-blue-gray-700" />
              <Input label="End Date" type="date" />
            </div>
            <Select label="Venue">
              <Option>PLV</Option>
              <Option>PPark</Option>
              <Option>FamPark</Option>
              <Option>VGC</Option>
            </Select>
          </div>
          <div className="flex flex-col gap-2 items-end justify-center w-1/2">
            <Chip value={`Expiry : `} variant="gradient" color="gray" size="lg" />
            <Chip value={`Total Unit : `} variant="gradient" color="gray" size="lg" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="col-start-1 col-span-2">
            <ManPowerTable />
          </div>
          <div className="col-start-3 col-span-5">
            <BloodCollectionTable />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-start-1 col-span-4">
            <SexDistributionTable />
          </div>
          <div className="col-start-5 col-span-7">
            <SexCountTable />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-start-1 col-span-4">
            <AgeDistributionTable />
          </div>
          <div className="col-start-5 col-span-7">
            <AgeCountTable />
          </div>
        </div>
        <Chip variant="gradient" color="gray" size="lg" value="DEFERRAL" className="flex justify-center items-center text-sm" />
        <div className="grid grid-cols-6 gap-3">
          <div className="col-start-1 col-span-4">
            <DeferralSexTable />
          </div>
          <div className="col-start-5 col-span-7">
            <DefSexCountTable />
          </div>
        </div>
        <div className="w-full">
          <NumbersTable />
        </div>
        <Chip variant="gradient" color="blue-gray" size="lg" value="PATIENT DIRECTED" className="flex justify-center items-center p-4 text-lg" />
        <div className="w-full">
          <PDSexDistributionTable />
        </div>
        <Chip variant="gradient" color="gray" size="lg" value="DEFERRAL" className="flex justify-center items-center text-sm" />
        <div className="grid grid-cols-6 gap-3">
          <div className="col-start-1 col-span-4">
            <PDDeferralSexTable />
          </div>
          <div className="col-start-5 col-span-7">
            <PDDefSexCountTable />
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Chip variant="gradient" color="gray" size="lg" value="TEAM LEADER:" className="w-1/5" />
      </CardFooter>
    </Card>
  );
}