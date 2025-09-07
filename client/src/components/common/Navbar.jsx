


import { Stack, useMediaQuery } from "@mui/material";
import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { FiArrowLeft } from "react-icons/fi";
import { MdOutlineSentimentSatisfiedAlt, MdOutlineFactCheck } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPostModal } from "../../redux/slice";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { darkMode, myInfo } = useSelector((state) => state.service);
  const _300 = useMediaQuery("(min-width:300px)");
  const _700 = useMediaQuery("(min-width:700px)");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("/post/") && _700) {
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  }, [location.pathname, _700]);

  const handleAddPost = () => dispatch(addPostModal(true));
  const handleNavigate = () => navigate(-1);
  const iconSize = _300 ? 26 : 22;
  const iconColor = darkMode ? "#FFD1DC" : "#2E2E2E";

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      alignItems="center"
      width="100%"
      height="100%"
    >
      {showArrow && (
        <FiArrowLeft
          size={iconSize}
          className="image-icon"
          onClick={handleNavigate}
          color={iconColor}
        />
      )}
      <Link to="/" style={{ textDecoration: "none" }}>
        <GoHome size={iconSize} color={iconColor} />
      </Link>
      <Link to="/search" style={{ textDecoration: "none" }}>
        <IoIosSearch size={iconSize} color={iconColor} />
      </Link>
      <TbEdit
        size={iconSize}
        onClick={handleAddPost}
        style={{ cursor: "pointer" }}
        color={iconColor}
      />
      <Link to="/sentiment" style={{ textDecoration: "none" }}>
        <MdOutlineSentimentSatisfiedAlt size={iconSize} color={iconColor} />
      </Link>
      <Link to="/fakenews" style={{ textDecoration: "none" }}>
        <MdOutlineFactCheck size={iconSize} color={iconColor} />
      </Link>
      <CiHeart size={iconSize} color={iconColor} />
      <Link
        to={`/profile/threads/${myInfo?._id}`}
        style={{ textDecoration: "none" }}
      >
        <RxAvatar size={iconSize} color={iconColor} />
      </Link>
    </Stack>
  );
};

export default Navbar;
