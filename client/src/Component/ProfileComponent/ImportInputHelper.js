import { utils } from 'xlsx';


export default function ImportInputHelper(wb, sheets) {
    //parse input table
    const IOIndex = sheets.findIndex((element) => element === "Input & Output"); 
    const inputRows = utils.sheet_to_json(wb.Sheets[sheets[IOIndex]], {header: 1});
    const inputTableArr = inputRows.filter((inputRowArr, index) => {//get input data from import excel
      return index <= 10 && 
        (inputRowArr[0] === "Total number of sessions" || 
        inputRowArr[0] === "Total traffic (Gbps)" || 
        inputRowArr[0] === "Number of sites (For Integrated MCC)" ||
        inputRowArr[0] === "Number of C-plane sites" || 
        inputRowArr[0] === "Number of U-plane sites") && 
        inputRowArr[0] !== undefined && 
        inputRowArr[0] !== 'Sessions per site' && 
        inputRowArr[0] !== 'Throughput per site (Gbps)' //TODO: replace hard coding way of parsing data
    })
    const inputTable = {}
    inputTableArr.forEach((row, index) => {
      while(row.length < 6){
        inputTableArr[index].push('')
      }
    })
    inputTableArr.forEach((row, index) => {
        inputTable[row[0]] = row.splice(1)
    })

    return inputTable
}