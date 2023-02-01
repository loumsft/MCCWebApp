import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function Graph(props) {
  const data = [
    // {
    //   "id": props.totalNumSessions.name,
    //   "color": "hsl(215, 70%, 50%)",
    //   "data": [
    //     {
    //       "x": "year1",
    //       "y": props.totalNumSessions.data[0] //should not have indexing issue since component wont mount unless outputdata is not empty.
    //     },
    //     {
    //       "x": "year2",
    //       "y": props.totalNumSessions.data[1]
    //     },
    //     {
    //       "x": "year3",
    //       "y": props.totalNumSessions.data[2]
    //     },
    //     {
    //       "x": "year4",
    //       "y": props.totalNumSessions.data[3]
    //     },
    //     {
    //       "x": "year5",
    //       "y": props.totalNumSessions.data[4]
    //     },
    //   ]
    // },
    {
      id: props.totalTraffic.name,
      color: "hsl(286, 70%, 50%)",
      data: [
        {
          x: "year1",
          y: props.totalTraffic.data[0],
        },
        {
          x: "year2",
          y: props.totalTraffic.data[1],
        },
        {
          x: "year3",
          y: props.totalTraffic.data[2],
        },
        {
          x: "year4",
          y: props.totalTraffic.data[3],
        },
        {
          x: "year5",
          y: props.totalTraffic.data[4],
        },
      ],
    },
    {
      id: props.totalvCPUCPM.name,
      color: "hsl(280, 70%, 50%)",
      data: [
        {
          x: "year1",
          y: props.totalvCPUCPM.data[0],
        },
        {
          x: "year2",
          y: props.totalvCPUCPM.data[1],
        },
        {
          x: "year3",
          y: props.totalvCPUCPM.data[2],
        },
        {
          x: "year4",
          y: props.totalvCPUCPM.data[3],
        },
        {
          x: "year5",
          y: props.totalvCPUCPM.data[4],
        },
      ],
    },
    {
      id: props.totalvCPUISM.name,
      color: "hsl(305, 70%, 50%)",
      data: [
        {
          x: "year1",
          y: props.totalvCPUISM.data[0],
        },
        {
          x: "year2",
          y: props.totalvCPUISM.data[1],
        },
        {
          x: "year3",
          y: props.totalvCPUISM.data[2],
        },
        {
          x: "year4",
          y: props.totalvCPUISM.data[3],
        },
        {
          x: "year5",
          y: props.totalvCPUISM.data[4],
        },
      ],
    },
    {
      id: props.totalvCPUMCM.name,
      color: "hsl(335, 70%, 50%)",
      data: [
        {
          x: "year1",
          y: props.totalvCPUMCM.data[0],
        },
        {
          x: "year2",
          y: props.totalvCPUMCM.data[1],
        },
        {
          x: "year3",
          y: props.totalvCPUMCM.data[2],
        },
        {
          x: "year4",
          y: props.totalvCPUMCM.data[3],
        },
        {
          x: "year5",
          y: props.totalvCPUMCM.data[4],
        },
      ],
    },
  ];

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
        title: {
          text: "Total Number of Sessions",
        },
      },
      {
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
