import React from "react";
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Blood Bags',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(255,255,255,1)',
        borderColor: 'rgba(255,255,255,1)',
        borderWidth: 2,
        data: [65, 59, 80, 81, 56]
      }
    ]
  }

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
				labels: {
					color: 'rgba(255,255,255,1)',
				}
      },
			options: {
				scales: {
					y: {
						grid: {
							color: 'rgb(236, 240, 241)',
						},
						beginAtZero: true,
						ticks: {
							color: 'rgb(236, 240, 241)',
						},
					},
					x: {
						grid: {
							color: 'rgb(236, 240, 241)',
						},
						beginAtZero: true,
						ticks: {
							color: 'rgb(236, 240, 241)',
						},
					}
				},
			},
    },
  };

export default function LineChart() {
    return (
          <Line
            data={data}
            options={config}
          />
      );
};