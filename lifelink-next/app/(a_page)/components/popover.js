import {
    Popover,
    PopoverHandler,
    PopoverContent,
    Avatar,
    Button,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
  } from "@material-tailwind/react";
  import {
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    ChevronDownIcon,
  } from "@heroicons/react/24/outline";
  import Link from "next/link";
  import Router from "next/navigation";
   
  export default function UserPopover() {
    return (
      <Popover placement="bottom">
        <PopoverHandler>
          <Button className="bg-red-900 text-white rounded-full flex justify-center items-center gap-2">
            Username
            <ChevronDownIcon className="h-5 w-5" />
          </Button>
        </PopoverHandler>
        <PopoverContent className="w-72 z-[9999]">
          <div className="mb-4 flex items-center gap-4 border-b border-blue-gray-50 pb-4">
            <Avatar src="./next.svg" />
            <div>
              <Typography variant="h6" color="blue-gray">
                Username
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                Administrator
              </Typography>
            </div>
          </div>
          <List className="p-0">
            <Link href="#" className="text-initial">
              <ListItem>
                <ListItemPrefix>
                  <Cog6ToothIcon className="h-5 w-5" />
                </ListItemPrefix>
                Settings
              </ListItem>
            </Link>
            <Link href="#" className="text-initial">
              <ListItem>
                <ListItemPrefix>
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </ListItemPrefix>
                Log Out
              </ListItem>
            </Link>
          </List>
        </PopoverContent>
      </Popover>
    );
  }