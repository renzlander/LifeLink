import React from "react";
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

export default function LineChart({ data }) {
  const LineGraph = {
    type: "line",
    data: {
      labels: Object.keys(data), // Use the keys (months) from the API data
      datasets: [
        {
          label: "Blood Bags",
          fill: false,
          lineTension: 0,
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderColor: "rgba(255, 255, 255, 1)",
          borderWidth: 5,
          data: Object.values(data), // Use the values (counts) from the API data
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        labels: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      scales: {
        y: {
          ticks: {
            color: "white",
          },
          grid: {
            color: "white",
          },
        },
        x: {
          ticks: {
            color: "white",
          },
          grid: {
            color: "transparent",
          },
        },
      },
    },
  };

  return <Line data={LineGraph.data} options={LineGraph.options} />;
}