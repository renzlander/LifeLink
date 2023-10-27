"use client";
import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MBDCard } from "./components/card";

export default function Home() {
  const contentRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const captureScreenshot = () => {
    if (contentRef.current) {
      const contentElement = contentRef.current;
      const screenshotQuality = 4; // Increase quality

      setIsGenerating(true); // Show loading indicator

      setTimeout(() => {
        html2canvas(contentElement, { scale: screenshotQuality }).then((canvas) => {
          const screenshot = canvas.toDataURL("image/jpeg", 1.0); // Maximum quality
          generatePDF(screenshot);
        });
      }, 1000); // Adjust the timeout duration as needed
    }
  }

  const generatePDF = (screenshot) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [210, 297], // A4 page size
    });

    doc.addImage(screenshot, "JPEG", 0, 0, 210, 297);

    doc.save("mbd_report.pdf");
    setIsGenerating(false); // Hide loading indicator after download
  }

  useEffect(() => {
    // Prevent right-click
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Prevent key combinations
    document.addEventListener("keydown", (e) => {
      if ((e.key === "PrintScreen" || e.key === "F12") || (e.ctrlKey && e.shiftKey && e.key === "I")) {
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
        if ((e.key === "PrintScreen" || e.key === "F12") || (e.ctrlKey && e.shiftKey && e.key === "I")) {
          alert("Inspect element is not allowed.");
          e.preventDefault();
        }
      });
    };
  }, []); // Empty dependency array to run this effect only once when the component mounts

  return (
    <div className="bg-gray-200 w-full min-h-screen flex flex-col items-center justify-between p-12">
      <button
        onClick={captureScreenshot}
        className="bg-red-500 hover-bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-md mb-8"
        disabled={isGenerating} // Disable the button while generating
      >
        {isGenerating ? "Generating PDF..." : "Export to PDF"}
      </button>
      {isGenerating && <p>Generating PDF, please wait...</p>}
      <div ref={contentRef} className="mb-8">
        {/* Your website content here, including the MBDCard */}
        <MBDCard />
      </div>
    </div>
  );
}
