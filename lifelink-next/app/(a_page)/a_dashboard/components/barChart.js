import React from "react";
import { Bar } from 'react-chartjs-2';

export default function BarChart({ data }) {
  const BarGraph = {
    type: 'bar',
    data: {
      labels: data.map(item => item.barangay),
      datasets: [
        {
          label: 'Donors',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          barThickness: 8,
          borderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 1,
          borderRadius: 10,
          data: data.map(item => item.donor_count)
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

  return (
    <Bar data={BarGraph.data} options={BarGraph.options} />
  );
}

