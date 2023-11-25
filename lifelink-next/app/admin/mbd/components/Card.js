import InputSelectMBD from "@/app/components/InputSelectMBD";
import { laravelBaseUrl } from "@/app/variables";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Input,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AgeCountTable, AgeDistributionTable } from "./TableAD";
import { BloodCollectionTable } from "./TableBC";
import { DefSexCountTable, DeferralSexTable } from "./TableDefSD";
import { ManPowerTable } from "./TableMP";
import { NumbersTable } from "./TableNumbers";
import { PDDefSexCountTable, PDDeferralSexTable } from "./TablePDDefSD";
import { PDSexDistributionTable } from "./TablePDSD";
import { SexCountTable, SexDistributionTable } from "./TableSD";

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(dateString).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
}

export function MBDCard() {
  const router = useRouter();
  const [venueOptions, setVenueOptions] = useState([]);
  const [venue, setVenue] = useState("Pamantasan Ng Lungsod Ng Valenzuela");
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [manPowerCount, setManPowerCount] = useState(0);
  const [manPowerList, setManPowerList] = useState([]);
  const [bloodCollection, setBloodCollection] = useState([]);
  const [totalMaleAndFemale, setTotalMaleAndFemale] = useState([]);
  const [totalDonorTypes, setTotalDonorTypes] = useState([]);
  const [donateFrequency, setDonateFrequency] = useState([]);
  const [ageDistributionLeft, setAgeDistributionLeft] = useState([]);
  const [ageDistributionRight, setAgeDistributionRight] = useState([]);
  const [tempCategoriesDeferral, setTempCategoriesDeferral] = useState([]);
  const [countDeferral, setCountDeferral] = useState([]);
  const [totalUnitsCollected, setTotalUnitsCollected] = useState("0");
  const [totalDeferred, setTotalDeferred] = useState("0");
  const [tempCategoriesDeferralPD, setTempCategoriesDeferralPD] = useState([]);
  const [countDeferralPD, setCountDeferralPD] = useState([]);
  const [bloodCollectionPD, setBloodCollectionPD] = useState([]);
  const [totalUnit, setTotalUnit] = useState("");
  const [expiry, setExpiry] = useState("");

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleVenueSelect = (selectedValue) => {
    setVenue(selectedValue);
  };

  const dynamicVenueOptions = venueOptions.map((item) => ({
    label: item.venues_desc,
    value: item.venues_desc,
  }));

  useEffect(() => {
    if (venue && startDate && endDate) {
      fetchBledByAndVenueLists();
      fetchBloodTypeFilteredData(venue, startDate, endDate);
    }
  }, [venue, startDate, endDate]);

  const fetchBledByAndVenueLists = async () => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        `${laravelBaseUrl}/api/get-bledby-and-venue`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setVenueOptions(response.data.venue);
      } else {
        console.error("Oops! Something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching bled_by and venues lists:", error);
    }
  };

  const fetchBloodTypeFilteredData = async (venue, startDate, endDate) => {
    try {
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${laravelBaseUrl}/api/mbd`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            venue: venue,
            startDate: startDate,
            endDate: endDate,
          },
        }
      );

      if (response.data.status === "success") {
        setManPowerCount(response.data.manPowerCount);
        setManPowerList(response.data.manPowerList);
        setBloodCollection(response.data.bloodCollection);
        setTotalMaleAndFemale(response.data.totalMaleAndFemale);
        setTotalDonorTypes(response.data.totalDonorTypes);
        setDonateFrequency(response.data.donateFrequency);
        setAgeDistributionLeft(response.data.getAgeDistributionLeft);
        setAgeDistributionRight(response.data.getAgeDistributionRight);
        setTempCategoriesDeferral(response.data.getTempCategoriesDeferral);
        setCountDeferral(response.data.countDeferral);
        setTotalUnitsCollected(response.data.numberOfUnitsCollected);
        setTotalDeferred(response.data.countDeferredDonors);
        setTempCategoriesDeferralPD(response.data.getTempCategoriesDeferralPD);
        setCountDeferralPD(response.data.countDeferralPD);
        setBloodCollectionPD(response.data.bloodCollectionPD);
        setTotalUnit(response.data.totalUnit);
        setExpiry(response.data.expiredDate);
      } else {
        console.error("Error fetching data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log("mbd:", expiry);

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
            {/* I adjusted the height because when exporting it the field is putol */}
            <InputSelectMBD
              label="Venue"
              value={venue}
              onSelect={handleVenueSelect}
              options={dynamicVenueOptions}
              isSearchable
              required
              placeholder="Venue"
            />
            <div className="flex items-center gap-2 w-full mt-2">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setStartDate(newStartDate);
                  fetchBloodTypeFilteredData(venue, newStartDate, endDate);
                }}
                className="h-[60px]"
              />
              <ArrowRightIcon className="h-5 w-5 text-blue-gray-700" />
              <Input
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => {
                  const newEndDate = e.target.value;
                  setEndDate(newEndDate);
                  fetchBloodTypeFilteredData(venue, startDate, newEndDate);
                }}
                className="h-[60px]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end justify-center w-1/2">
            <Chip
              value={`Expiry : ${formatDate(expiry)}`}
              variant="gradient"
              color="gray"
              size="lg"
            />
            <Chip
              value={`Total Unit : ${totalUnit}`}
              variant="gradient"
              color="gray"
              size="lg"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="col-start-1 col-span-2">
            <ManPowerTable
              manPowerCount={manPowerCount}
              manPowerList={manPowerList}
            />
          </div>
          <div className="col-start-3 col-span-5">
            <BloodCollectionTable bloodCollection={bloodCollection} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-start-1 col-span-4">
            <SexDistributionTable
              totalMaleAndFemale={totalMaleAndFemale}
              totalDonorTypes={totalDonorTypes}
            />
          </div>
          <div className="col-start-5 col-span-7">
            <SexCountTable donateFrequency={donateFrequency} />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-start-1 col-span-4">
            <AgeDistributionTable ageDistributionLeft={ageDistributionLeft} />
          </div>
          <div className="col-start-5 col-span-7">
            <AgeCountTable ageDistributionRight={ageDistributionRight} />
          </div>
        </div>
        <Chip
          variant="gradient"
          color="gray"
          size="lg"
          value="DEFERRAL"
          className="flex justify-center items-center text-sm"
        />
        <div className="grid grid-cols-6 gap-3">
          <div className="col-start-1 col-span-4">
            <DeferralSexTable tempCategoriesDeferral={tempCategoriesDeferral} />
          </div>
          <div className="col-start-5 col-span-7">
            <DefSexCountTable countDeferral={countDeferral} />
          </div>
        </div>
        <div className="w-full">
          <NumbersTable
            totalUnitsCollected={totalUnitsCollected}
            totalDeferred={totalDeferred}
          />
        </div>
        <Chip
          variant="gradient"
          color="blue-gray"
          size="lg"
          value="PATIENT DIRECTED"
          className="flex justify-center items-center p-4 text-lg"
        />
        <div className="w-full">
          <PDSexDistributionTable bloodCollectionPD={bloodCollectionPD} />
        </div>
        <Chip
          variant="gradient"
          color="gray"
          size="lg"
          value="DEFERRAL"
          className="flex justify-center items-center text-sm"
        />
        <div className="grid grid-cols-6 gap-3">
          <div className="col-start-1 col-span-4">
            <PDDeferralSexTable
              tempCategoriesDeferralPD={tempCategoriesDeferralPD}
            />
          </div>
          <div className="col-start-5 col-span-7">
            <PDDefSexCountTable countDeferralPD={countDeferralPD} />
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex items-center pt-0">
        <Chip
          value="TEAM LEADER :"
          size="sm"
          className="h-full rounded-r-none"
        />
        <input
          placeholder="Full name here..."
          className="rounded-l-none rounded-r-md bg-gradient-to-r from-gray-900 to-gray-800 text-white"
        />
      </CardFooter>
    </Card>
  );
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}
