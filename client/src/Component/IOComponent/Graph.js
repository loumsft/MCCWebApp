import React from 'react';
import { ResponsiveLine } from "@nivo/line";



export default function Graph(props){
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
      "id": props.totalTraffic.name,
      "color": "hsl(286, 70%, 50%)",
      "data": [
        {
          "x": "year1",
          "y": props.totalTraffic.data[0]
        },
        {
          "x": "year2",
          "y": props.totalTraffic.data[1]
        },
        {
          "x": "year3",
          "y": props.totalTraffic.data[2]
        },
        {
          "x": "year4",
          "y": props.totalTraffic.data[3]
        },
        {
          "x": "year5",
          "y": props.totalTraffic.data[4]
        },
      ]
    },
    {
      "id": props.totalvCPUCPM.name,
      "color": "hsl(280, 70%, 50%)",
      "data": [
        {
          "x": "year1",
          "y": props.totalvCPUCPM.data[0]
        },
        {
          "x": "year2",
          "y": props.totalvCPUCPM.data[1] 
        },
        {
          "x": "year3",
          "y": props.totalvCPUCPM.data[2]
        },
        {
          "x": "year4",
          "y": props.totalvCPUCPM.data[3]
        },
        {
          "x": "year5",
          "y": props.totalvCPUCPM.data[4]
        },
      ]
    },
    {
      "id": props.totalvCPUISM.name,
      "color": "hsl(305, 70%, 50%)",
      "data": [
        {
          "x": "year1",
          "y": props.totalvCPUISM.data[0]
        },
        {
          "x": "year2",
          "y": props.totalvCPUISM.data[1]
        },
        {
          "x": "year3",
          "y": props.totalvCPUISM.data[2]
        },
        {
          "x": "year4",
          "y": props.totalvCPUISM.data[3]
        },
        {
          "x": "year5",
          "y": props.totalvCPUISM.data[4]
        },
      ]
    },
    {
      "id": props.totalvCPUMCM.name,
      "color": "hsl(335, 70%, 50%)",
      "data": [
        {
          "x": "year1",
          "y": props.totalvCPUMCM.data[0]
        },
        {
          "x": "year2",
          "y": props.totalvCPUMCM.data[1]
        },
        {
          "x": "year3",
          "y": props.totalvCPUMCM.data[2]
        },
        {
          "x": "year4",
          "y": props.totalvCPUMCM.data[3]
        },
        {
          "x": "year5",
          "y": props.totalvCPUMCM.data[4]
        },
      ]
    }
  ]

  return (
    <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            // legend: 'transportation',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'unit',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        // legends={[
        //     {
        //         anchor: 'bottom-right',
        //         direction: 'column',
        //         justify: false,
        //         translateX: 100,
        //         translateY: 0,
        //         itemsSpacing: 0,
        //         itemDirection: 'left-to-right',
        //         itemWidth: 80,
        //         itemHeight: 20,
        //         itemOpacity: 0.75,
        //         symbolSize: 12,
        //         symbolShape: 'circle',
        //         symbolBorderColor: 'rgba(0, 0, 0, .5)',
        //         effects: [
        //             {
        //                 on: 'hover',
        //                 style: {
        //                     itemBackground: 'rgba(0, 0, 0, .03)',
        //                     itemOpacity: 1
        //                 }
        //             }
        //         ]
        //     }
        // ]}
    />
  )
}
