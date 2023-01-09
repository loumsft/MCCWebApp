import React, {useState} from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function PacketSwitchMenuComponent(props) {
  const [PST, setPST] = useState();

  const handlePSTChange = (e, rowIndex, columnIndex) => {
    setPST(e.target.value);
    props.onChange(e, rowIndex, columnIndex);
  };

  return (
    <FormControl fullWidth variant='standard' key={props.colIndex}>
      <Select
        value={PST ? PST : props.element}
        onChange={(e) => handlePSTChange(e, props.rowIndex, props.colIndex)}
      >
        <MenuItem value={"SRIOV"} key={0}>
          SRIOV
        </MenuItem>
        <MenuItem value={"NVDS"} key={1}>
          NVDS
        </MenuItem>
        <MenuItem value={"vSwitch"} key={2}>
          vSwitch
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default PacketSwitchMenuComponent;
