import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';

export default function LineChart({ data }) {
  const redCrossRed = "rgb(206, 17, 38)";
  const hoverRed = "rgb(255, 0, 0)";

  const LineGraph = {
    type: "line",
    data: {
      labels: Object.keys(data),
      datasets: [
        {
          label: "Blood Bags",
          data: Object.values(data),
          fill: true,
          lineTension: 0.4,
          // backgroundColor: "rgba(206, 17, 38, 0.2)",
          borderColor: redCrossRed,
          borderWidth: 2,
          pointRadius: 6,
          pointBackgroundColor: "#fff",
          pointBorderColor: redCrossRed,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: hoverRed,
          pointHoverBorderColor: "#fff",
          backgroundColor: (context) => {
            const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, context.chart.height);
            gradient.addColorStop(0, "rgba(206, 17, 38, 0.7)");
            gradient.addColorStop(0.5, "rgba(206, 17, 38, 0.3)");
            gradient.addColorStop(1, "rgba(255, 255, 2555, 0)");
            return gradient;
          },
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Monthly Blood Bag Data",
          font: {
            size: 20,
            weight: "bold",
            color: redCrossRed,
          },
        },
        legend: {
          display: true,
          position: "top",
          labels: {
            font: {
              size: 16,
              color: redCrossRed,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: redCrossRed,
            stepSize: 1,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.2)", // Increased grid line opacity
          },
        },
        x: {
          ticks: {
            color: redCrossRed,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.2)", // Increased grid line opacity
          },
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      elements: {
        point: {
          radius: 6,
          hoverRadius: 8,
        },
      },
      tooltips: {
        enabled: true,
        mode: "index",
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.yLabel + " Bags";
          },
        },
      },
      hover: {
        mode: "nearest",
        intersect: false,
      },
      animation: {
        duration: 800,
        easing: "easeInOutQuart",
      },
    },
  };

  return <Line data={LineGraph.data} options={LineGraph.options} />;
}
