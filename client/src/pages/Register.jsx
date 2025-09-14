import {
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLoginMutation, useSigninMutation } from "../redux/service";
import { Bounce, toast } from "react-toastify";
import Loading from "../components/common/Loading";

const Register = () => {
  const _700 = useMediaQuery("(min-width:700px)");

  const [signinUser, signinUserData] = useSigninMutation();
  const [loginUser, loginUserData] = useLoginMutation();

  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleLogin = () => {
    setLogin((pre) => !pre);
  };

  const handleLogin = async () => {
    const data = {
      email,
      password,
    };
    await loginUser(data);
  };

  const handleRegister = async () => {
    const data = {
      userName,
      email,
      password,
    };
  
    try {
      // Register the user
      const response = await signinUser(data).unwrap(); // Unwrap the response safely
      toast.success(response.msg, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
  
      // Auto-login with registered email & password
      const loginResponse = await loginUser({ email, password }).unwrap();
      toast.success(loginResponse.msg, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
  
      // Optionally store the token in localStorage
      localStorage.setItem("token", loginResponse.token);
  
      // Redirect to dashboard or homepage
      window.location.href = "/"; // Change this to your desired page
  
    } catch (error) {
      toast.error(error?.data?.msg || "Registration failed!", {
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
  };
  

  useEffect(() => {
    if (signinUserData.isSuccess && signinUserData.data?.msg) {
      toast.success(signinUserData.data.msg, {
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
    if (signinUserData.isError && signinUserData.error?.data?.msg) {
      toast.error(signinUserData.error.data.msg, {
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
  }, [
    signinUserData.isSuccess,
    signinUserData.isError,
    signinUserData.data?.msg,
    signinUserData.error?.data?.msg,
  ]);
  

  useEffect(() => {
    if (loginUserData.isSuccess && loginUserData.data?.msg) {
      toast.success(loginUserData.data.msg, {
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
    if (loginUserData.isError && loginUserData.error?.data?.msg) {
      toast.error(loginUserData.error.data.msg, {
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
  }, [
    loginUserData.isSuccess,
    loginUserData.isError,
    loginUserData.data?.msg,
    loginUserData.error?.data?.msg,
  ]);
  

  if (signinUserData.isLoading || loginUserData.isLoading) {
    return (
      <Stack 
        height={"90vh"} 
        alignItems={"center"} 
        justifyContent={"center"}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh'
        }}
      >
        <Loading />
      </Stack>
    );
  }

  return (
    <>
      <Stack
        width={"100%"}
        height={"100vh"}
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          background: _700 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%), url("/unnamed.jpg")'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundRepeat: "no-repeat",
          backgroundSize: _700 ? "cover" : "100% 100%",
          backgroundPosition: "center",
          minHeight: '100vh',
          padding: '1rem'
        }}
      >
        <Stack
          flexDirection={"column"}
          width={_700 ? "40%" : "100%"}
          maxWidth={'480px'}
          gap={3}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: _700 ? '3rem' : '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            mt: _700 ? 0 : 0
          }}
        >
          <Typography
            variant="h5"
            fontSize={_700 ? "2rem" : "1.75rem"}
            fontWeight={600}
            alignSelf={"center"}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
              mb: 1
            }}
          >
            {login ? "Welcome Back" : "Join ThreadTogether"}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              textAlign: 'center',
              mb: 2,
              fontSize: '0.95rem'
            }}
          >
            {login ? "Sign in to your peaceful community" : "Create your account for a safer social experience"}
          </Typography>

          {login ? null : (
            <TextField
              variant="outlined"
              placeholder="Enter your username..."
              onChange={(e) => setUserName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  backgroundColor: 'rgba(248, 250, 252, 0.8)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(248, 250, 252, 1)',
                    transform: 'translateY(-1px)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(248, 250, 252, 1)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 10px 25px -12px rgba(102, 126, 234, 0.3)',
                  },
                  '& fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.2)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(102, 126, 234, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                }
              }}
            />
          )}
          
          <TextField
            variant="outlined"
            placeholder="Enter your email..."
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(248, 250, 252, 1)',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(248, 250, 252, 1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 10px 25px -12px rgba(102, 126, 234, 0.3)',
                },
                '& fieldset': {
                  borderColor: 'rgba(102, 126, 234, 0.2)',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(102, 126, 234, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
          
          <TextField
            variant="outlined"
            type="password"
            placeholder="Enter your password..."
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: 'rgba(248, 250, 252, 0.8)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(248, 250, 252, 1)',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(248, 250, 252, 1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 10px 25px -12px rgba(102, 126, 234, 0.3)',
                },
                '& fieldset': {
                  borderColor: 'rgba(102, 126, 234, 0.2)',
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(102, 126, 234, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              }
            }}
          />
          
          <Button
            size="large"
            sx={{
              width: "100%",
              height: 56,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: "white",
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: '16px',
              textTransform: 'none',
              boxShadow: '0 10px 25px -12px rgba(102, 126, 234, 0.5)',
              transition: 'all 0.3s ease',
              ":hover": {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 20px 40px -12px rgba(102, 126, 234, 0.6)',
              },
              ":active": {
                transform: 'translateY(0px)',
              }
            }}
            onClick={login ? handleLogin : handleRegister}
          >
            {login ? "Sign In" : "Create Account"}
          </Button>
          
          <Typography
            variant="body2"
            sx={{
              fontSize: _700 ? "1rem" : "0.95rem",
              alignSelf: "center",
              color: '#6b7280',
              textAlign: 'center'
            }}
          >
            {login ? "Don't have an account?" : "Already have an account?"}
            <span 
              className="login-link" 
              onClick={toggleLogin}
              style={{
                color: '#667eea',
                fontWeight: 600,
                marginLeft: '0.5rem',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#5a67d8'}
              onMouseLeave={(e) => e.target.style.color = '#667eea'}
            >
              {login ? "Sign up" : "Sign in"}
            </span>
          </Typography>
        </Stack>
      </Stack>
      

    </>
  );
};

export default Register;