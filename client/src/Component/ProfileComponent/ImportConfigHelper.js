import { utils } from 'xlsx';


export default function ImportInputHelper(wb, sheets) {
    //parse config table
    const configTable = {}
    const configIndex = sheets.findIndex((element) => element === "Control & Summary")
    const configRows = utils.sheet_to_json(wb.Sheets[sheets[configIndex]], {header: 1});

    const masterControlArr = configRows.slice(3, 19)
    configTable["masterControl"] = masterControlArr.map((element, index) => {
        let data = ""
        if (element[1]){
             data = element[1]
        }
        return {//this mastercontrol is missing the id, not important since we are just importing to excel and then updating webapp using python.
            "name": element[0],
            "data": data
        }
    })
    
    const paramArr = configRows.slice(20) //need to split uprelated params and defined params table.

    configTable["UPClusterRelatedParams"] = paramArr.map((element,index) => {
        return {
            'name': element[0],
            'data': element[1]
        }
    })
    configTable["defaultCustomizedParams"] = paramArr.map((element,index) => {
        const data = element.slice(5)
        if (data.length < 6){
            for (let i = data.length; i < 6; ++i){
                data.push('')
            }
        }
        return {
            'name': element[4],
            'data': data
        }
    })
    return configTable
}