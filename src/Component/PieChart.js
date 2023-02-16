import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

function PieChart(props) {
  const [series, setSeries] = useState([props.data.IOnums[0], props.data.SHDnums[0]]);
  const [options, setOptions] = useState({
    chart: {
      id: "pieChart",
      width: 380,
      type: "pie",
    },
    labels: ["Number of IO", "Number of SHD"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  return (
    <ReactApexChart options={options} series={series} type='pie' width={350} />
  );
}

export default PieChart;
