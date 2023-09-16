import React from "react";
import {
    Card,
    Input,
    Checkbox,
    Typography,
  } from "@material-tailwind/react";

export function RegF1() {
    return (
        // <div className="h-full w-full flex justify-center my-10">
  
            <Card className='mt-6 flex justify-center items-center' color="transparent" shadow={false}>
                <Typography variant="h4" className="mt-2" color="blue-gray">
                    Enter your details for logging in
                </Typography>
  
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-4 flex flex-col gap-6">
                      <Input size="lg" label="Email" />
                      <Input type="password" size="lg" label="Password" />
                      <Input type="password" size="lg" label="Confirm Password" />
                    </div>
                    <Checkbox
                      label={
                          <Typography
                            variant="small"
                            color="gray"
                            className="flex items-center font-normal"
                          >
                          I agree the
                          <a
                            href="#"
                            className="font-medium transition-colors text-red-600 hover:text-red-800"
                          >
                              &nbsp;Terms and Conditions
                          </a>
                          </Typography>
                      }
                      containerProps={{ className: "-ml-2.5" }}
                    />
                    <Typography color="gray" className="mt-4 text-center font-normal">
                      Already have an account?{" "}
                      <a href='/login' className="font-medium text-gray-900">
                          Sign In
                      </a>
                    </Typography>
                </form>
  
            </Card>
  
        // </div>
    );
  }