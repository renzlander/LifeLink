"use client";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  CardFooter,
} from "@material-tailwind/react";

export default function News() {
  return (
    <main className="min-h-screen grid grid-cols-8 p-8">
      <Card className="col-span-8">
        <CardHeader
          color="gray"
          variant="gradient"
          className="h-16 flex items-center mb-4"
        >
          <Typography variant="h4" color="white" className="ml-4">
            News and Announcements
          </Typography>
        </CardHeader>
        <CardBody className="w-full flex flex-col 2xl:flex-row items-start 2xl:items-center justify-center gap-20 overflow-x-auto">
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FPRCValenzuelaCityChapter&show_posts=true&width=500&height=750&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
            width="500"
            height="750"
            style={{ border: "none", overflow: "hidden" }}
            allowFullScreen="true"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FRedCrossYouthValenzuela&show_posts=true&width=500&height=750&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
            width="500"
            height="750"
            style={{ border: "none", overflow: "hidden" }}
            allowFullScreen="true"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          ></iframe>
        </CardBody>
        <CardFooter>
          <Typography variant="small" color="gray" className="font-normal">
            © PRC Valenzuela City Chapter. All rights reserved.
          </Typography>
        </CardFooter>
      </Card>
    </main>
  );
}
