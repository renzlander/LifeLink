import React from "react";
import {
    Card,
    Input,
    Typography,
  } from "@material-tailwind/react";

export function RegF3() {
    return (
      <div className="h-full flex justify-center my-10">
  
          <Card className='mt-6' color="transparent" shadow={false}>
              <Typography variant="h4" className="mt-2" color="blue-gray">
                  You're Done!
              </Typography>
          </Card>
  
      </div>
    );
  }