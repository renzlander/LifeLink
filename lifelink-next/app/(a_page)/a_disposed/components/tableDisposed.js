import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, Checkbox, Input, Typography, Button, CardBody, Chip, CardFooter, IconButton, Spinner, Select, Option } from "@material-tailwind/react";
import { laravelBaseUrl } from "@/app/variables";


const classes = "p-4";

function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}

export function TabStock() {


    return (
        <Card className="h-full w-full -mb-6">
           
        </Card>
    );
}

