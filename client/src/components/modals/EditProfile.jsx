import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { editProfileModal } from "../../redux/slice";
import {
  useUpdateProfileMutation,
  useUserDetailsQuery,
} from "../../redux/service";
import Loading from "../common/Loading";
import { Bounce, toast } from "react-toastify";

const EditProfile = () => {
  const { openEditProfileModal, myInfo, darkMode } = useSelector(
    (state) => state.service
  );
  const _700 = useMediaQuery("(min-width:700px)");

  const [pic, setPic] = useState();
  const [bio, setBio] = useState();

  const imgRef = useRef();
  const dispatch = useDispatch();

  const [updateProfile, updateProfileData] = useUpdateProfileMutation();

  const { refetch } = useUserDetailsQuery(myInfo?._id, {
    skip: !myInfo?._id,
  });

  const handlePhoto = () => {
    imgRef.current.click();
  };

  const handleClose = () => {
    dispatch(editProfileModal(false));
  };

  const handleUpdate = async () => {
    if (pic || bio) {
      const data = new FormData();
      if (bio) {
        data.append("text", bio);
      }
      if (pic) {
        data.append("media", pic);
      }
      await updateProfile(data);
    }
    dispatch(editProfileModal(false));
  };

  useEffect(() => {
    if (updateProfileData?.isSuccess) {
      refetch();
      toast.success(updateProfileData.data?.msg, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
    if (updateProfileData?.isError) {
      toast.error(updateProfileData.error?.data?.msg || "Update failed", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [updateProfileData, refetch]);

  return (
    <>
      <Dialog
        open={openEditProfileModal}
        onClose={handleClose}
        fullWidth
        fullScreen={!_700}
        PaperProps={{
          sx: {
            background: darkMode
              ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: darkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(102, 126, 234, 0.1)',
            borderRadius: _700 ? '24px' : '0px',
            boxShadow: darkMode
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
              : '0 25px 50px -12px rgba(102, 126, 234, 0.3)',
          }
        }}
      >
        {updateProfileData.isLoading ? (
          <Stack 
            height={"60vh"}
            sx={{
              background: darkMode
                ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.9) 100%)',
            }}
          >
            <Loading />
          </Stack>
        ) : (
          <>
            <Box
              position={"absolute"}
              top={_700 ? 20 : 16}
              right={_700 ? 20 : 16}
              onClick={handleClose}
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
            >
              <RxCross2 
                size={_700 ? 24 : 20} 
                color={darkMode ? "#e2e8f0" : "#667eea"}
              />
            </Box>

            <DialogTitle 
              textAlign={"center"} 
              mb={_700 ? 4 : 3}
              sx={{
                fontSize: _700 ? '1.5rem' : '1.25rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                pt: _700 ? 3 : 2,
              }}
            >
              Edit Profile
            </DialogTitle>

            <DialogContent sx={{ px: _700 ? 3 : 2 }}>
              <Stack 
                flexDirection={"column"} 
                gap={3}
                alignItems="center"
                mb={4}
              >
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-8px',
                      left: '-8px',
                      right: '-8px',
                      bottom: '-8px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      opacity: 0.3,
                      zIndex: 0,
                    }
                  }}
                >
                  <Avatar
                    src={
                      pic
                        ? URL.createObjectURL(pic)
                        : myInfo
                        ? myInfo.profilePic
                        : ""
                    }
                    alt={myInfo ? myInfo.userName : ""}
                    sx={{ 
                      width: _700 ? 96 : 80, 
                      height: _700 ? 96 : 80,
                      position: 'relative',
                      zIndex: 1,
                      border: darkMode 
                        ? '3px solid rgba(255, 255, 255, 0.1)' 
                        : '3px solid rgba(102, 126, 234, 0.1)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                    }}
                  />
                </Box>

                <Button
                  onClick={handlePhoto}
                  sx={{
                    width: _700 ? 120 : 100,
                    height: 44,
                    borderRadius: "16px",
                    fontSize: _700 ? "0.9rem" : "0.8rem",
                    fontWeight: 600,
                    textTransform: "none",
                    background: darkMode
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(102, 126, 234, 0.05)',
                    border: darkMode 
                      ? '1px solid rgba(255, 255, 255, 0.2)' 
                      : '1px solid rgba(102, 126, 234, 0.2)',
                    color: darkMode ? '#e2e8f0' : '#667eea',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.02)',
                      background: darkMode
                        ? 'rgba(102, 126, 234, 0.1)'
                        : 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid #667eea',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)',
                    }
                  }}
                >
                  Change Photo
                </Button>

                <input
                  type="file"
                  accept="image/*"
                  ref={imgRef}
                  onChange={(e) => setPic(e.target.files[0])}
                  style={{ display: 'none' }}
                />
              </Stack>

              <Stack gap={4}>
                {/* Username Section */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={"bold"}
                    fontSize={_700 ? "1.1rem" : "1rem"}
                    mb={2}
                    sx={{
                      color: darkMode ? '#e2e8f0' : '#1a202c',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Username
                  </Typography>
                  <Box
                    component="input"
                    type="text"
                    value={myInfo ? myInfo.userName : ""}
                    readOnly
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '16px',
                      border: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: '16px',
                      fontSize: _700 ? '1rem' : '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(102, 126, 234, 0.02)',
                      color: darkMode ? 'rgba(226, 232, 240, 0.6)' : 'rgba(26, 32, 44, 0.6)',
                      cursor: 'not-allowed',
                      opacity: 0.7,
                    }}
                  />
                </Box>

                {/* Email Section */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={"bold"}
                    fontSize={_700 ? "1.1rem" : "1rem"}
                    mb={2}
                    sx={{
                      color: darkMode ? '#e2e8f0' : '#1a202c',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Email
                  </Typography>
                  <Box
                    component="input"
                    type="text"
                    value={myInfo ? myInfo.email : ""}
                    readOnly
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '16px',
                      border: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: '16px',
                      fontSize: _700 ? '1rem' : '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(102, 126, 234, 0.02)',
                      color: darkMode ? 'rgba(226, 232, 240, 0.6)' : 'rgba(26, 32, 44, 0.6)',
                      cursor: 'not-allowed',
                      opacity: 0.7,
                    }}
                  />
                </Box>

                {/* Bio Section */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={"bold"}
                    fontSize={_700 ? "1.1rem" : "1rem"}
                    mb={2}
                    sx={{
                      color: darkMode ? '#e2e8f0' : '#1a202c',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Bio
                  </Typography>
                  <Box
                    component="input"
                    type="text"
                    placeholder={myInfo ? myInfo.bio : "Tell us about yourself..."}
                    value={bio ? bio : ""}
                    onChange={(e) => setBio(e.target.value)}
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      padding: '16px',
                      border: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(102, 126, 234, 0.1)',
                      borderRadius: '16px',
                      fontSize: _700 ? '1rem' : '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      background: darkMode
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(102, 126, 234, 0.03)',
                      color: darkMode ? '#e2e8f0' : '#1a202c',
                      transition: 'all 0.3s ease',
                      '&::placeholder': {
                        color: darkMode ? 'rgba(226, 232, 240, 0.5)' : 'rgba(26, 32, 44, 0.5)',
                      },
                      '&:focus': {
                        background: darkMode
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(102, 126, 234, 0.05)',
                        borderColor: '#667eea',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                      }
                    }}
                  />
                </Box>

                {/* Update Button */}
                <Button
                  onClick={handleUpdate}
                  sx={{
                    width: "100%",
                    py: 2,
                    mt: 3,
                    borderRadius: "16px",
                    fontSize: _700 ? "1.1rem" : "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.02)',
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(-1px) scale(1.01)',
                    }
                  }}
                >
                  Update Profile
                </Button>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default EditProfile;