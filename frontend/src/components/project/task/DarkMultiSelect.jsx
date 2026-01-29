
import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "auto",
      minWidth: 200,
      maxWidth: 340,
      backgroundColor: "#1E293B", // dark dropdown background
      color: "white", // text color
    },
  },
};

export default function MultipleSelectCheckmarks({ names, changehandler, assignedTo }) {
  return (
    <div>
      <FormControl sx={{ m: 0, width: "100%", minWidth: 200, maxWidth: 340 }}>
        <InputLabel
          id="demo-multiple-checkbox-label"
          sx={{ color: "white" }}
        >
          Assigned To
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={assignedTo}
          onChange={changehandler}
          input={<OutlinedInput label="Assigned To" />}
          renderValue={(selected) =>
            selected
              .map((id) => {
                const user = names.find((n) => n.member._id === id);
                return user ? user.member.username : id;
              })
              .join(", ")
          }
          MenuProps={MenuProps}
          sx={{
            color: "white",
            bgcolor: "#1E293B",
            borderRadius: "8px",
            border: "1px solid #334155",
            width: "100%",
            "& .MuiSvgIcon-root": {
              color: "white",
            },
            "& .MuiSelect-select": {
              paddingTop: "10px",
              paddingBottom: "10px",
              paddingLeft: "12px",
              paddingRight: "36px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#334155",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3b82f6",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3b82f6",
            },
          }}
        >
          {names.map((n) => (
            <MenuItem key={n.member._id} value={n.member._id}>
              <Checkbox
                checked={assignedTo.includes(n.member._id)}
                sx={{
                  color: "#64748b",
                  "&.Mui-checked": { color: "#3b82f6" },
                }}
              />
              <ListItemText primary={n.member.username} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
