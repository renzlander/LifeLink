import React from "react";
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

export default function BarChart({ data }) {
  const redCrossRed = "rgb(206, 17, 38)";

  const BarGraph = {
    type: "bar",
    data: {
      labels: data.map((item) => item.barangay),
      datasets: [
        {
          label: "Donors",
          backgroundColor: "rgba(206, 17, 38, 0.6)",
          barThickness: 8,
          borderColor: redCrossRed,
          borderWidth: 2,
          borderRadius: 5,
          data: data.map((item) => item.donor_count),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Donors by Barangay",
          font: {
            size: 18,
            color: redCrossRed,
          },
        },
        legend: {
          display: false,
        },
        labels: {
          color: redCrossRed,
        },
      },
      interaction: {
        intersect: false, // Allow only one bar to be highlighted
      },
      scales: {
        y: {
          ticks: {
            color: redCrossRed,
            stepSize: 1,
            font: {
              size: 12,
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          ticks: {
            color: redCrossRed,
            font: {
              size: 12,
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  };

  return <Bar data={BarGraph.data} options={BarGraph.options} />;
}