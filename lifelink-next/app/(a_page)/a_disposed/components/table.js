import React, { useState } from "react";
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, Input, Typography, Button, CardBody, CardFooter, Tabs, Tab, TabsHeader, Tooltip, Select, Option } from "@material-tailwind/react";
import { TabStock } from "./tableDisposed";

export function InventoryTable() {
    return (
        <Card className="h-full w-full">
            <CardHeader color="red" className="relative h-16 flex items-center">
                <Typography variant="h4" color="white" className="ml-4">
                    Diposed Blood Bags
                </Typography>
            </CardHeader>
            <CardHeader floated={false} shadow={false} className="rounded-none mt-6 -mb-6">
                <div className="flex items-center justify-end gap-3">
                    <div className="flex items-center gap-3 w-full md:w-72">
                        <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
                    </div>
                    <Button className="flex items-center gap-3">
                        <DocumentArrowDownIcon className="h-4 w-4" /> Export to PDF
                    </Button>
                </div>
            </CardHeader>
            <CardBody className="px-0">
                <TabStock />
            </CardBody>
        </Card>
    );
}
