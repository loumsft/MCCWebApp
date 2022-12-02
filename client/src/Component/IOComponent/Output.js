import React, {useState} from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import OutputTableTabs from "./OutputTableTabs";
import Session from "./Session";
import Graph from './Graph';

export default function Output(props) {
  const integratedRowsTotal = [
    {
      name: "Total number of sessions",
      data: props.outputData.totalNumSessionsIC
    },
    {
      name: "Total traffic (Gbps)",
      data: props.outputData.totalTrafficIC

    },
    {
      name: "Number of sites (For Integrated MCC)",
      data: props.outputData.numSitesIC

    },

    {
      name: "Number of CPM total all sites",
      data: props.outputData.numCPMTotalIC

    },
    {
      name: "Number of ISM total all sites",
      data: props.outputData.numISMTotalIC
    },
    {
      name: "Number of MCM total all sites",
      data: props.outputData.numMCMTotalIC
    },
    {
      name: "Number of CPM vCPUs total all sites",
      data: props.outputData.numvCPUCPMTotalIC
    },
    {
      name: "Number of ISM vCPUs total all sites",
      data: props.outputData.numISMvCPUTotalIC
    },
    {
      name: "Number of MCM vCPUs total all sites",
      data: props.outputData.numMCMvCPUTotalIC
    },
  ];

  const integratedRowsPerSite = [
    {
      name: "Sessions per site",
      data: props.outputData.sessionsPerSiteIC
    },
    {
      name: "Throughput per site (Gbps)",
      data: props.outputData.throughputPerSiteIC

    },
    {
      name: "Number of CPM per site",
      data: props.outputData.numCPMIC
    },
    {
      name: "Number of ISM/SSM per site",
      data: props.outputData.numISMIC

    },
    {
      name: "Number of MCM per site",
      data: props.outputData.numMCMIC

    },
    {
      name: "Number of CPM vCPUs per site",
      data: props.outputData.numvCPUCPMIC
    },
    {
      name: "Number of ISM/SSM vCPUs per site",
      data: props.outputData.numvCPUISMIC
    },
    {
      name: "Number of MCM vCPUs per site",
      data: props.outputData.numvCPUMCMIC
    },
  ];

  const cupsRowsCPTotal = [
    {
      name: "Total number of sessions (CUPS Case CP Site)",
      data: props.outputData.totalNumSessionsCCCP
    },
    {
      name: "Total Traffic (Gbps) (CUPS Case CP Site)",
      data: props.outputData.totalTrafficCCCP
    },
    {
      name: "Number of CPM total all sites (CUPS Case CP Site)",
      data: props.outputData.numCPMTotalCCCP
    },
    {
      name: "Number of SSM total all sites (CUPS Case CP Site)",
      data: props.outputData.numSSMTotalCCCP
    },
    {
      name: "Number of MCM total all sites (CUPS Case CP Site)",
      data: props.outputData.numMCMTotalCCCP
    },
    {
      name: "Number of CPM vCPUs total all sites (CUPS Case CP Site)",
      data: props.outputData.numCPMvCPUTotalCCCP
    },
    {
      name: "Number of SSM vCPUs total all sites (CUPS Case CP Site)",
      data: props.outputData.numSSMvCPUTotalCCCP
    },
    {
      name: "Number of MCM vCPUs total all sites (CUPS Case CP Site)",
      data: props.outputData.numMCMvCPUTotalCCCP
    },
  ];

  const cupsRowsCPPerSite = [
    {
      name: "Number of CPM per site (CUPS Case CP Site)",
      data: props.outputData.numCPMCCCP
    },
    {
      name: "Number of SSM per site (CUPS Case CP Site)",
      data: props.outputData.numSSMCCCP
    },
    {
      name: "Number of MCM per site (CUPS Case CP Site)",
      data: props.outputData.numMCMCCCP
    },
    {
      name: "Number of CPM vCPUs per site (CUPS Case CP Site)",
      data: props.outputData.numCPMvCPUCCCP
    },
    {
      name: "Number of SSM vCPUs per site (CUPS Case CP Site)",
      data: props.outputData.numSSMvCPUCCCP
    },
    {
      name: "Number of MCM vCPUs per site (CUPS Case CP Site)",
      data: props.outputData.numMCMvCPUCCCP
    },
  ];

  const cupsRowsUPTotal = [
    {
      name: "Total number of sessions (CUPS Case UP Site)",
      data: props.outputData.totalNumSessionsCCUP
    },
    {
      name: "Total Traffic (Gbps) (CUPS Case UP Site)",
      data: props.outputData.totalTrafficCCUP
    },
    {
      name: "Number of CPM total all sites (CUPS Case UP Site)",
      data: props.outputData.numCPMTotalCCUP
    },
    {
      name: "Number of ISM total all sites (CUPS Case UP Site)",
      data: props.outputData.numISMTotalCCUP
    },
    {
      name: "Number of MCM total all sites (CUPS Case UP Site)",
      data: props.outputData.numMCMTotalCCUP
    },
    {
      name: "Number of CPM vCPUs total all sites (CUPS Case UP Site)",
      data: props.outputData.numCPMvCPUTotalCCUP
    },
    {
      name: "Number of ISM vCPUs total all sites (CUPS Case UP Site)",
      data: props.outputData.numISMvCPUTotalCCUP
    },
    {
      name: "Number of MSM vCPUs total all sites (CUPS Case UP Site)",
      data: props.outputData.numMSMvCPUTotalCCUP
    },
  ];

  const cupsRowsUPPerSite = [
    {
      name: "Number of CPM per site (CUPS Case UP Site)",
      data: props.outputData.numCPMCCUP
    },
    {
      name: "Number of ISM per site (CUPS Case UP Site)",
      data: props.outputData.numISMCCUP
    },
    {
      name: "Number of MCM per site (CUPS Case UP Site)",
      data: props.outputData.numMCMCCUP
    },

    {
      name: "Number of CPM vCPUs per site (CUPS Case UP Site)",
      data: props.outputData.numCPMvCPUCCUP
    },
    {
      name: "Number of ISM vCPUs per site (CUPS Case UP Site)",
      data: props.outputData.numISMvCPUCCUP
    },
    {
      name: "Number of MSM vCPUs per site (CUPS Case UP Site)",
      data: props.outputData.numMSMvCPUCCUP
    },
  ];

  const [tableTab, setTableTab] = useState(0) //tab index of the output table tab

  return (
    <>
      <OutputTableTabs
        integratedRowsTotal={integratedRowsTotal}
        integratedRowsPerSite={integratedRowsPerSite}
        cupsRowsCPTotal={cupsRowsCPTotal}
        cupsRowsCPPerSite={cupsRowsCPPerSite}
        cupsRowsUPPerSite={cupsRowsUPPerSite}
        cupsRowsUPTotal={cupsRowsUPTotal}
        tableTab={tableTab}
        setTableTab={setTableTab}
      />

      <br />
      <div style={{ height: 600, margin: "auto" }}>
        <Graph totalNumSessions={integratedRowsTotal[0]} totalTraffic={integratedRowsTotal[1]} />
      </div>
      <br />

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          onClick={() => {
            axios("/download/" + props.currentFileName, {
              method: "GET",
              responseType: "blob", // important
            }).then((response) => {
              //Creates an <a> tag hyperlink that links the excel sheet Blob object to a url for downloading.
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              const date = new Date();
              const time = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getTime()
              link.setAttribute("download", `${props.username} MCC Sizing model ${time}.xlsx`); //set the attribute of the <a> link tag to be downloadable when clicked and name the sheet based on the date and time right now.
              document.body.appendChild(link);
              link.click(); //programmatically click the link so the user doesn't have to
              document.body.removeChild(link);
              URL.revokeObjectURL(url); //important for optimization and preventing memory leak even though link element has already been removed.
              //https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios?noredirect=1&lq=1
            });
          }}
          color="primary"
          variant="contained"
        >
          Download
        </Button>
        <Session {...props}/>
      </div>
    </>
  );
}
