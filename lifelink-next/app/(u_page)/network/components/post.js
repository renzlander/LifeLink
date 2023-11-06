import { useState } from "react";
import { Card, CardHeader, CardBody, Checkbox, Typography, List, ListItem, ListItemPrefix, Avatar, Chip, Button } from "@material-tailwind/react";

export function PostCard() {
    const chipColor = [
        { color: "green", value: "Approved", text: "Approved" },
        { color: "red", value: "Disapproved", text: "Disapproved" },
        { color: "gray", value: "Pending", text: "Pending" },
    ];

    return (
        <Card shadow={false} className="p-4 w-full shadow-md">
            <CardHeader color="transparent" floated={false} shadow={false} className="mx-0 flex items-center gap-4 pt-0 pb-8">
                <Avatar size="lg" variant="circular" src="/next.svg" />
                <div className="flex w-full justify-between gap-0.5">
                    <div className="flex flex-col">
                        <Typography variant="h5" color="blue-gray">
                            Valenzuela City Philippine Red Cross
                        </Typography>
                        <Typography color="blue-gray">April 08, 2023 - 10:23 PM</Typography>
                    </div>
                    <div className="flex flex-col">
                        <Typography color="blue-gray">Donation Date: November 16, 2023</Typography>
                        <Typography color="blue-gray">Venue : Alert Center Valenzuela City</Typography>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="mb-2 p-0">
                <Typography>
                    "We are currently seeking donations of <span className="font-bold">O+ and A+</span> blood because it's not available at our facility. The blood donation event will take place at Alert Center Valenzuela City on November
                    16, 2023. Your generous donation can help save lives in our community. We kindly request donors to come forward and support this important cause. Your contribution can make a significant difference in the lives of those
                    in need. We appreciate your willingness to help."
                </Typography>

                <Button color="green" variant="gradient" className="w-1/8 mt-4">
                    <span>I'm Interested</span>
                </Button>
            </CardBody>
        </Card>
    );
}

export function FilterCheckBox() {
    const filters = ["Approved", "Pending", "Disapproved"];
    const [checkedStatus, setCheckedStatus] = useState(filters.map(() => true));

    return (
        <Card className="w-full max-w-md">
            <Typography variant="h5" color="blue-gray" className="ml-4 mt-4">
                Filters
            </Typography>
            <List className="flex-row">
                {filters.map((filters, index) => (
                    <ListItem className="p-0" key={filters}>
                        <label htmlFor={`horizontal-list-${filters.toLowerCase()}`} className="flex w-full cursor-pointer items-center px-3 py-2">
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
