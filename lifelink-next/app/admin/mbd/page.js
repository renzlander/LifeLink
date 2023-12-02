"use client";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { Button, Spinner } from "@material-tailwind/react";
import domToImage from "dom-to-image";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import { MBDCard } from "./components/Card";

export default function Home() {
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); // New state for tracking PDF generation

  const screenshotRef = useRef();

  const handleScreenshot = () => {
    const node = screenshotRef.current;

    setIsGenerating(true); // Set isGenerating to true when starting PDF generation

    domToImage
      .toPng(node)
      .then((dataUrl) => {
        setScreenshotUrl(dataUrl);
        generatePDF(dataUrl);
        console.log("Screenshot captured:", dataUrl);
      })
      .catch((error) => {
        console.error("Error capturing screenshot:", error);
      })
      .finally(() => {
        setIsGenerating(false); // Set isGenerating to false when generation is complete (or encounters an error)
      });
  };

  const generatePDF = (screenshot) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [210, 297], // A4 page size
    });

    // Add image to the PDF using data URL
    doc.addImage(screenshot, "JPEG", 0, 0, 210, 297);

    // Save the PDF
    doc.save("mbd_report.pdf");
  };

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "PrintScreen" ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I")
      ) {
        alert("Inspect element is not allowed.");
        e.preventDefault();
      }
    });

    return () => {
      document.removeEventListener("keydown", (e) => {
        if (
          e.key === "PrintScreen" ||
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I")
        ) {
          alert("Inspect element is not allowed.");
          e.preventDefault();
        }
      });
    };
  }, []);

  return (
    <div className="bg-gray-200 w-full min-h-screen flex flex-col items-center justify-between p-12">
      <Button
        variant="gradient"
        color="gray"
        onClick={handleScreenshot}
        className="rounded-full flex items-center gap-3 mb-2"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Spinner className="w-4 h-4" />
            Generating PDF...
          </>
        ) : (
          <>
            <DocumentArrowDownIcon className="h-4 w-4" />
            Export to PDF
          </>
        )}
      </Button>
      <div ref={screenshotRef} className="py-8">
        <MBDCard />
      </div>
    </div>
  );
}
