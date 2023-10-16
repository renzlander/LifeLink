import React from "react";

function BloodDropletIcon({ width, height, topOffset }) {
  // Generate a unique ID for the gradient
  const gradientId = `grad-${topOffset}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      version="1.1"
      viewBox="0 0 264.564 264.564"
      xmlSpace="preserve"
    >
      <defs>
        {/* Use the generated unique ID for the gradient */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset={`${topOffset}%`} style={{ stopColor: "#000000", stopOpacity: 1 }} />
          <stop offset='100%' style={{ stopColor: "#ef4444", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <path
        d="M132.281 264.564c51.24 0 92.931-41.681 92.931-92.918 0-50.18-87.094-164.069-90.803-168.891L132.281 0l-2.128 2.773c-3.704 4.813-90.802 118.71-90.802 168.882.001 51.228 41.691 92.909 92.93 92.909z"
        // Use the generated unique ID for the fill
        fill={`url(#${gradientId})`}
      />
    </svg>
  );
}

export default BloodDropletIcon;
