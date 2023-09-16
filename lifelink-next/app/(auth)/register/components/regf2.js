import React from "react";
import {
    Card,
    Input,
    Select,
    Option,
    Typography,
  } from "@material-tailwind/react";

export function RegF2() {
    return (
        // <div className="h-full flex justify-center my-10">
  
            <Card className='mt-6 flex justify-center items-center' color="transparent" shadow={false}>
                <Typography variant="h4" className="mt-2" color="blue-gray">
                    Enter your personal details
                </Typography>
                <Typography variant="paragraph" className="mt-2" color="blue-gray">
                    Some details will not be displayed in your profile.
                </Typography>
  
                <form className="mt-8 mb-2 max-w-screen-lg sm:w-full">
                    <div className="mb-4 flex gap-6 lg:flex-row sm:flex-col">
                      <Input size="lg" label="First Name" />
                      <Input size="lg" label="Middle Name" />
                      <Input size="lg" label="Last Name" />
                    </div>
                    <div className="mb-4 flex grow gap-6">
                      <Select label="Sex">
                        <Option>Male</Option>
                        <Option>Female</Option>
                      </Select>
                      <Select label="Blood Type">
                        <Option>AB+</Option>
                        <Option>AB-</Option>
                        <Option>A+</Option>
                        <Option>A-</Option>
                        <Option>B+</Option>
                        <Option>B-</Option>
                        <Option>O+</Option>
                        <Option>O-</Option>
                      </Select>
                    </div>
                    <div className="mb-4 flex flex-row gap-6">
                      {/* <TelDropdown /> */}
                    </div>
                    <div className="mb-4 w-full flex flex-wrap gap-6">
                      <Select className="grow" label="City">
                        <Option>Valenzuela</Option>
                      </Select>
                      <Select label="Barangay">
                        <Option>Parada</Option>
                      </Select>
                      <Select label="Street">
                        <Option>Tandang Manang</Option>
                      </Select>
                    </div>
                </form>
  
            </Card>
  
        // </div>
    );
  }