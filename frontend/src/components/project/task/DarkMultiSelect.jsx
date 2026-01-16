// import * as React from "react";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import ListItemText from "@mui/material/ListItemText";
// import Select from "@mui/material/Select";
// import Checkbox from "@mui/material/Checkbox";

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// export default function MultipleSelectCheckmarks({
//   names,changehandler,assignedTo
// }) {

//   return (
//     <div>
//       <FormControl sx={{ m: 1, width: 300 }}>
//         <InputLabel id="demo-multiple-checkbox-label">Assigned To</InputLabel>
//         <Select
//         sx={{
//             color:"white",
//             bgcolor:"#1D293D",
//             borderRadius:"25px",
//             border:"1px solid #314158",
//             "::placeholder":{
//                 color:"white"
//             }
//         }}
//           labelId="demo-multiple-checkbox-label"
//           id="demo-multiple-checkbox"
//           multiple
//           value={assignedTo}
//           onChange={changehandler}
//           input={<OutlinedInput label="Assigned To" />}
//           renderValue={(selected) => selected.join(", ")}
//           MenuProps={MenuProps}
//         >
//           {names.map((name) => (
//             <MenuItem key={name.member._id} value={name.member._id}>
//               <Checkbox checked={assignedTo.includes(name.member._id)} />
//               <ListItemText primary={name.member.username} />
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//   );
// }
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
      width: 250,
      backgroundColor: "#1E293B", // dark dropdown background
      color: "white", // text color
    },
  },
};

export default function MultipleSelectCheckmarks({ names, changehandler, assignedTo }) {
  return (
    <div>
      <FormControl sx={{ m: 1,height:20, width: 300 }}>
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
            "& .MuiSvgIcon-root": {
              color: "white",
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
