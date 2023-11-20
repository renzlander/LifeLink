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
            <CardBody className="px-0">
                <TabStock />
            </CardBody>
        </Card>
    );
}
