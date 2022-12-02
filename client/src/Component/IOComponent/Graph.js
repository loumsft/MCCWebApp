import React, {useState} from 'react';
import { ResponsiveLine } from "@nivo/line";



export default function Graph(props){
  const data = [
    {
      "id": props.totalNumSessions.name,
      "color": "hsl(215, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": props.totalNumSessions.data[0] //should not have indexing issue since component wont mount unless outputdata is not empty.
        },
        {
          "x": "helicopter",
          "y": props.totalNumSessions.data[1]
        },
        {
          "x": "boat",
          "y": props.totalNumSessions.data[2]
        },
        {
          "x": "train",
          "y": props.totalNumSessions.data[3]
        },
        {
          "x": "subway",
          "y": props.totalNumSessions.data[4]
        },
      ]
    },
    {
      "id": props.totalTraffic.name,
      "color": "hsl(286, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": props.totalTraffic.data[0]
        },
        {
          "x": "helicopter",
          "y": props.totalTraffic.data[1]
        },
        {
          "x": "boat",
          "y": props.totalTraffic.data[2]
        },
        {
          "x": "train",
          "y": props.totalTraffic.data[3]
        },
        {
          "x": "subway",
          "y": props.totalTraffic.data[4]
        },
      ]
    },
    {
      "id": "us",
      "color": "hsl(280, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 133
        },
        {
          "x": "helicopter",
          "y": 160
        },
        {
          "x": "boat",
          "y": 239
        },
        {
          "x": "train",
          "y": 63
        },
        {
          "x": "subway",
          "y": 254
        },
      ]
    },
    {
      "id": "germany",
      "color": "hsl(305, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 207
        },
        {
          "x": "helicopter",
          "y": 44
        },
        {
          "x": "boat",
          "y": 115
        },
        {
          "x": "train",
          "y": 153
        },
        {
          "x": "subway",
          "y": 264
        },
      ]
    },
    {
      "id": "norway",
      "color": "hsl(335, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 67
        },
        {
          "x": "helicopter",
          "y": 243
        },
        {
          "x": "boat",
          "y": 100
        },
        {
          "x": "train",
          "y": 87
        },
        {
          "x": "subway",
          "y": 203
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
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
  )
}
