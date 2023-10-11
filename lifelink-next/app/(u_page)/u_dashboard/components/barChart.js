import React from "react";
import { Bar } from 'react-chartjs-2';

const BarGraph = {
  type: 'bar', // Changed from 'line' to 'bar' to create a bar chart
  data: {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Blood Bags',
        backgroundColor: 'rgba(255, 255, 255, 1)', // Adjust background color and opacity
        barThickness: 8,
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
        borderRadius: 10, // Set border radius for the bars (rounded corners)
        data: [65, 59, 80, 81, 56]
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
        color: 'rgba(255, 255, 255, 1)',
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
    },
  },
};

export default function BarChart() {
  return (
    <Bar data={BarGraph.data} options={BarGraph.options} />
  );
};
