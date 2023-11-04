import React, { useState } from "react";
import {
    Card,
    Checkbox,
    Button,
    IconButton,
    SpeedDial,
    SpeedDialHandler,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Textarea,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
  } from "@material-tailwind/react";
  import { PlusIcon } from "@heroicons/react/24/outline";
   
  export function CreatePost() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(!open);

    return (
        <div>  
            <div className="relative h-80 w-full">
                <div className="absolute bottom-0 right-0">
                    <SpeedDial>
                        <SpeedDialHandler>
                            <IconButton size="lg" className="rounded-full" onClick={handleOpen}>
                                <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
                            </IconButton>
                        </SpeedDialHandler>
                    </SpeedDial>
                </div>
            </div>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Create Post</DialogHeader>
                <DialogBody className="flex flex-col" divider>
                    <Textarea label="Write Something" />
                    <ContactCheckbox />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="gradient"
                        color="gray"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleOpen}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
  }

  
 export function ContactCheckbox() {
    const contactMode = ["Phone", "E-mail"];
  
    return (
      <Card className="w-full max-w-md">
        <Typography variant="h5" color="blue-gray" className="ml-4 mt-4">Mode of Contact</Typography>
        <List className="flex-row">
          {contactMode.map((contactMode) => (
            <ListItem className="p-0" key={contactMode}>
              <label
                htmlFor={`horizontal-list-${contactMode.toLowerCase()}`}
                className="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <ListItemPrefix className="mr-3">
                  <Checkbox
                    id={`horizontal-list-${contactMode.toLowerCase()}`}
                    ripple={false}
                    className="hover:before:opacity-0"
                    containerProps={{
                      className: "p-0",
                    }}
                  />
                </ListItemPrefix>
                <Typography color="blue-gray" className="font-medium">
                  {contactMode}
                </Typography>
              </label>
            </ListItem>
          ))}
        </List>
      </Card>
    );
  }