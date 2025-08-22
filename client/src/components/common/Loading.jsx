// import {Stack, CircularProgress} from "@mui/material"
// const Loading = () => {
//   return (
//     <Stack
//       flexDirection={"row"}
//       minHeight={"50vh"}
//       width={"100%"}
//       height={"100%"}
//       justifyContent={"center"}
//       alignItems={"center"}
//       my={5}
//     >
//       <CircularProgress color="success" />
//     </Stack>
//   );
// };

// export default Loading;


import { Stack, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Stack
      flexDirection={"row"}
      minHeight={"50vh"}
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      my={5}
      bgcolor={"#E6E6FA"} // Lavender background
    >
      <CircularProgress
        sx={{ color: "#C8A2C8" }} // Lilac spinner
      />
    </Stack>
  );
};

export default Loading;
