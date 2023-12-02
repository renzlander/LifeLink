"use client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { Button, Spinner } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { MBDCard } from "./components/Card";

export default function Home() {
  const contentRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const captureScreenshot = () => {
    if (contentRef.current) {
      const contentElement = contentRef.current;
      const screenshotQuality = 5; // Increase quality

      setIsGenerating(true); // Show loading indicator

      setTimeout(() => {
        html2canvas(contentElement, { scale: screenshotQuality }).then(
          (canvas) => {
            const screenshot = canvas.toDataURL("image/jpeg", 1.0); // Maximum quality
            generatePDF(screenshot);
          }
        );
      }, 1000); // Adjust the timeout duration as needed
    }
  };

  const generatePDF = (screenshot) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [210, 297], // A4 page size
    });

    doc.addImage(screenshot, "JPEG", 0, 0, 210, 297);

    doc.save("mbd_report.pdf");
    setIsGenerating(false); // Hide loading indicator after download
  };

  useEffect(() => {
    // document.addEventListener("contextmenu", (e) => {
    //   e.preventDefault();
    // });

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
      // Remove event listeners when the component unmounts
      document.removeEventListener("contextmenu", (e) => {
        e.preventDefault();
      });

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
  }, []); // Empty dependency array to run this effect only once when the component mounts

  return (
    <div className="bg-gray-200 w-full min-h-screen flex flex-col items-center justify-between p-12">
      <Button
        variant="gradient"
        color="gray"
        onClick={captureScreenshot}
        className="rounded-full flex items-center gap-3 mb-2"
        disabled={isGenerating} // Disable the button while generating
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
      <div ref={contentRef} className="py-8">
        <MBDCard />
      </div>
    </div>
  );
}
