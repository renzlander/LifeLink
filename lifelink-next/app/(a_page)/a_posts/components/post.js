import { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Checkbox,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Avatar,
    Chip,
  } from "@material-tailwind/react";
import { ApprovePost, DisapprovePost } from "./popup";
   
export function PostCard() {
  const chipColor = [
    { color: "green", value: "Approved", text: "Approved" },
    { color: "red", value: "Pending", text: "Pending" },
    { color: "gray", value: "Disapproved", text: "Disapproved" },
  ];

  return (
    <div className="flex items-start">
      <Card shadow={false} className="p-4 w-full shadow-md relative rounded-tr-none">
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="mx-0 flex items-center gap-4 pt-0 pb-8"
        >
          <Avatar size="lg" variant="circular" src="/next.svg" />
          <div className="flex w-full justify-between gap-0.5">
            <div className="flex flex-col">
              <Typography variant="h5" color="blue-gray">
                Tania Andrew
              </Typography>
              <Typography color="blue-gray">April 08, 2023 - 10:23 PM</Typography>
            </div>
            <div className="flex flex-col">
              <Chip
                variant="ghost"
                color={chipColor[0].color}
                value={chipColor[0].text}
              >
                {chipColor[0].text}
              </Chip>
              <Typography color="blue-gray">No. of Donations : 2</Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="mb-6 p-0">
          <Typography>
            &quot;I found solution to all my design needs from Creative Tim. I use
            them as a freelancer in my hobby projects for fun! And its really
            affordable, very humble guys !!!&quot;
          </Typography>
        </CardBody>
      </Card>
      <div className="flex flex-col items-start gap-5">
        <ApprovePost />
        <DisapprovePost />
      </div>
    </div>
  );
}

export function FilterCheckBox() {
  const filters = ["Approved", "Pending", "Disapproved"];
  const [checkedStatus, setCheckedStatus] = useState(filters.map(() => true));

  return (
    <Card className="w-full max-w-md">
      <Typography variant="h5" color="blue-gray" className="ml-4 mt-4">Filters</Typography>
      <List className="flex-row">
        {filters.map((filters, index) => (
          <ListItem className="p-0" key={filters}>
            <label
              htmlFor={`horizontal-list-${filters.toLowerCase()}`}
              className="flex w-full cursor-pointer items-center px-3 py-2"
            >
              <ListItemPrefix className="mr-3">
                <Checkbox
                  id={`horizontal-list-${filters.toLowerCase()}`}
                  ripple={false}
                  className="hover:before:opacity-0"
                  containerProps={{
                    className: "p-0",
                  }}
                  checked={checkedStatus[index]}
                  onChange={(event) => {
                    const updatedCheckedStatus = [...checkedStatus];
                    updatedCheckedStatus[index] = event.target.checked;
                    setCheckedStatus(updatedCheckedStatus);
                  }}
                />
              </ListItemPrefix>
              <Typography color="blue-gray" className="font-medium">
                {filters}
              </Typography>
            </label>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}