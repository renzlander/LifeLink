import {
  Card,
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";

export function FilterCheckBox() {
  const filters = ["Accomodated", "Pending", "Declined"];
  const [checkedStatus, setCheckedStatus] = useState(filters.map(() => true));

  return (
    <Card className="sticky z-10 top-0 w-full max-w-xl ml-6">
      <List className="flex-row items-center">
        <Typography variant="h5" color="blue-gray" className="ml-4">
          Filters:
        </Typography>
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
