import React from "react";
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const LineGraph = {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: ' Blood Bags',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(255,255,255,1)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 5,
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
        color: 'rgba(255,255,255,1)',
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'white',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'transparent',
        },
      },
    },
  },
};

export default function LineChart() {
  return (
      <Line data={LineGraph.data} options={LineGraph.options} />
  );
};
