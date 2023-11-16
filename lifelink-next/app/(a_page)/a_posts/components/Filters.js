import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Checkbox, Typography, List, ListItem, ListItemPrefix, Avatar, Chip, Accordion, AccordionHeader, AccordionBody, Textarea, Input, Button, Select, Option } from "@material-tailwind/react";

export function FilterCheckBox() {
  const filters = ["Accomodated", "Pending", "Declined"];
  const [checkedStatus, setCheckedStatus] = useState(filters.map(() => true));

  return (
      <Card className="w-full max-w-xl">
          <List className="flex-row items-center">
            <Typography variant="h5" color="blue-gray" className="ml-4">
                Filters:
            </Typography>
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