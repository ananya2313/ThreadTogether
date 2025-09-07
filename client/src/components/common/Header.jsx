
import { Grid, Stack, useMediaQuery } from "@mui/material";
import Navbar from "./Navbar";
import { IoMenu } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggleMainMenu } from "../../redux/slice";

const Header = () => {
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  const dispatch = useDispatch();

  const handleOpenMenu = (e) => {
    dispatch(toggleMainMenu(e.currentTarget));
  };

  return (
    <>
      {_700 ? (
        <Stack
          direction="row"
          height={60}
          justifyContent="space-around"
          alignItems="center"
          position="sticky"
          top={0}
          bgcolor={darkMode ? "#C8A2C8" : "#E6E6FA"}
          zIndex={10}
        >
          <img
            src={
              darkMode
                ? "/Threads-logo-black-bg.webp"
                : "/Threads-logo-white-bg.png"
            }
            alt="logo"
            width={60}
            height={35}
          />
          <Stack
            width={550}
            justifyContent="center"
            height={50}
            borderRadius={3}
            bgcolor={darkMode ? "#3e2b4b" : "#FAFAFA"}
            boxShadow="0 2px 6px rgba(200, 162, 200, 0.3)"
          >
            <Navbar />
          </Stack>
          <IoMenu
            size={30}
            className="image-icon"
            color={darkMode ? "#FFD1DC" : "#5D5D5D"}
            onClick={handleOpenMenu}
          />
        </Stack>
      ) : (
        <>
          <Stack
            position="fixed"
            bottom={0}
            width="100%"
            height={52}
            justifyContent="center"
            p={1}
            bgcolor={darkMode ? "#C8A2C8" : "#E6E6FA"}
            borderTop="1px solid #D3C1D3"
            zIndex={10}
          >
            <Navbar />
          </Stack>
          <Grid
            container
            height={60}
            justifyContent="flex-end"
            alignItems="center"
            p={1}
            bgcolor={darkMode ? "#C8A2C8" : "#E6E6FA"}
          >
            <Grid item xs={6}>
              <img
                src="/Threads-logo-white-bg.png"
                alt="logo"
                width={60}
                height={35}
              />
            </Grid>
            <IoMenu size={36} className="image-icon" color="#5D5D5D" />
          </Grid>
        </>
      )}
    </>
  );
};

export default Header;
