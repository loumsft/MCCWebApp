import React, {useState} from 'react'
import axios from 'axios'
import CircularProgress from "@mui/material/CircularProgress";
import ColumnChart from "./ColumnChart"
import PieChart from "./PieChart"

function AdvancedAnalysisComponent(props) {
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(true);
  const [advancedAnalysisData, setAdvancedAnalysisData] = useState({});

  React.useEffect(() => {
    if (props.currentFileName){
      axios("/api/analysis/" + props.currentFileName, {
        method: "get",
        headers: {
          Authorization: "Bearer " + props.token,
        },
      }).then((response) => {
        let newArr = []
        response.data.ISMThroughputUsage.forEach((val) => {
          newArr.push((val * 100).toFixed(2))
        })
        response.data.ISMThroughputUsage = newArr

        newArr = []
        response.data.ISMSessionUsage.forEach((val) => {
          newArr.push((val * 100).toFixed(2))
        })
        response.data.ISMSessionUsage = newArr

        setAdvancedAnalysisData(response.data)
        setIsAnalysisLoading(false)
      })
    }
  }, [props.currentFileName]);

  return (
    isAnalysisLoading ? (
      <>
        <CircularProgress/>
        <br/>
      </>
    ): (
      <>
        <ColumnChart data={advancedAnalysisData}/>
        <PieChart data={advancedAnalysisData}/>
      </>
    )
  )
}

export default AdvancedAnalysisComponent