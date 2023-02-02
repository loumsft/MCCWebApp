import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function Graph(props) {

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: [0, 4],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
    },
    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
    // xaxis: {
    //   type: 'datetime'
    // },
    yaxis: [
      {
        labels: {
          formatter: (value) => {
            return value.toLocaleString()
          }
        },
        title: {
          text: "Total Number of Sessions",
        },
      },
      {
        labels: {
          formatter: (value) => {
            return value.toLocaleString()
          }
        },
        opposite: true,
        title: {
          text: "Total Traffic (Gbps)",
        },
      },
    ],
  });

  const [series, setSeries] = useState([
    {
      name: "Total Number of Sessions",
      type: "column",
      data: props.totalNumSessions.data,
    },
    {
      name: "Total Traffic (Gbps)",
      type: "line",
      data: props.totalTraffic.data,
    },
  ]);

  return (
    <>
      <ReactApexChart
        options={options}
        series={series}
        type='line'
        height={350}
      />
    </>
  );
}
