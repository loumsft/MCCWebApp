import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

function AdvancedAnalysisComponent(props) {

  const [series, setSeries] = useState([
    {
      name: "ISM Tput capacity usage %",
      data: props.data.ISMThroughputUsage,
    },
    {
      name: "ISM Session capacity usage %",
      data: props.data.ISMSessionUsage,
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      id: "columnChart",
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      },
      
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + "%";
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Year 1",
        "Year 2",
        "Year 3",
        "Year 4",
        "Year 5"
      ],
    },
    yaxis: {
      decimalsInFloat: 0,
      title: {
        // text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  });
  
  return (
    <ReactApexChart options={options} series={series} type='bar' height={350} /> 
  )
}

export default AdvancedAnalysisComponent;
