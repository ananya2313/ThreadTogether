

import { Stack, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { addPostModal } from "../../redux/slice";
import { FiArrowLeft } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { MdOutlineSentimentSatisfiedAlt, MdOutlineFactCheck } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";

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
  const iconSize = _300 ? 24 : 20;
  const iconColor = darkMode ? "#e2e8f0" : "#667eea";

  const navItems = [
    { 
      icon: GoHome, 
      to: "/", 
      label: "Home",
      isSpecial: false 
    },
    { 
      icon: IoIosSearch, 
      to: "/search", 
      label: "Search",
      isSpecial: false 
    },
    { 
      icon: TbEdit, 
      onClick: handleAddPost, 
      label: "Create",
      isSpecial: true 
    },
    { 
      icon: MdOutlineSentimentSatisfiedAlt, 
      to: "/sentiment", 
      label: "Sentiment",
      isSpecial: false 
    },
    { 
      icon: MdOutlineFactCheck, 
      to: "/fakenews", 
      label: "Fact Check",
      isSpecial: false 
    },
    { 
      icon: CiHeart, 
      label: "Liked",
      isSpecial: false 
    },
    { 
      icon: RxAvatar, 
      to: `/profile/threads/${myInfo?._id}`, 
      label: "Profile",
      isSpecial: false 
    },
  ];

  const renderNavItem = (item, index) => {
    const Icon = item.icon;
    const isActive = item.to && location.pathname === item.to;
    
    const iconButton = (
      <Stack
        key={index}
        sx={{
          width: _700 ? 48 : 44,
          height: _700 ? 48 : 44,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: item.isSpecial 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : isActive 
            ? (darkMode
              ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)')
            : (darkMode
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(102, 126, 234, 0.05)'),
          border: item.isSpecial 
            ? 'none'
            : darkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(102, 126, 234, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: item.isSpecial 
            ? '0 6px 20px rgba(102, 126, 234, 0.3)'
            : 'none',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.05)',
            background: item.isSpecial
              ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
              : (darkMode
                ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'),
            boxShadow: item.isSpecial
              ? '0 8px 25px rgba(102, 126, 234, 0.4)'
              : '0 6px 20px rgba(102, 126, 234, 0.2)',
          },
          '&:active': {
            transform: 'translateY(-1px) scale(1.02)',
          },
          position: 'relative',
          '&::before': isActive && !item.isSpecial ? {
            content: '""',
            position: 'absolute',
            bottom: _700 ? '-8px' : '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          } : {}
        }}
        onClick={item.onClick}
      >
        <Icon 
          size={iconSize} 
          color={item.isSpecial ? "white" : (isActive ? "#667eea" : iconColor)}
          style={{
            filter: item.isSpecial ? 'none' : isActive ? 'brightness(1.2)' : 'none'
          }}
        />
      </Stack>
    );

    if (item.to && !item.onClick) {
      return (
        <Link 
          key={index}
          to={item.to} 
          style={{ textDecoration: "none" }}
        >
          {iconButton}
        </Link>
      );
    }

    return iconButton;
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      alignItems="center"
      width="100%"
      height="100%"
      sx={{
        px: _700 ? 2 : 1,
        gap: _700 ? 1 : 0.5,
        position: 'relative'
      }}
    >
      {showArrow && (
        <Stack
          sx={{
            width: _700 ? 44 : 40,
            height: _700 ? 44 : 40,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: darkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(102, 126, 234, 0.1)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.2)' 
              : '1px solid rgba(102, 126, 234, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.05)',
              background: darkMode
                ? 'rgba(255, 255, 255, 0.15)'
                : 'rgba(102, 126, 234, 0.15)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)',
            }
          }}
          onClick={handleNavigate}
        >
          <FiArrowLeft
            size={iconSize}
            color={iconColor}
          />
        </Stack>
      )}
      
      {navItems.map((item, index) => renderNavItem(item, index))}
    </Stack>
  );
};

export default Navbar;