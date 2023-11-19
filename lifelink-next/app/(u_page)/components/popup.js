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
        <>  
          <div className="relative h-80 w-full">
              <div className="fixed bottom-5 right-5">
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
        </>
    );
  }