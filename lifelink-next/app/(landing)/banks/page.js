"use client";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { BankAccordion } from "./components/Accordion";

export default function BloodBanks() {
  return (
    <main className="min-h-screen grid grid-cols-8 py-8">
      <Card className="col-start-2 col-end-8">
        <CardHeader
          color="gray"
          variant="gradient"
          className="h-16 flex items-center mb-4"
        >
          <Typography variant="h4" color="white" className="ml-4">
            Blood Banks List
          </Typography>
        </CardHeader>
        <CardBody>
          <BankAccordion />
        </CardBody>
      </Card>
    </main>
  );
}
