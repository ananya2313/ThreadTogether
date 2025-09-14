import { InputAdornment, TextField, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLazySearchUsersQuery } from "../../redux/service";
import { addToSearchedUsers } from "../../redux/slice";
import { Bounce, toast } from "react-toastify";

const SearchInput = () => {
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  const [query, setQuery] = useState();

  const [searchUser, searchUserData] = useLazySearchUsersQuery();
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    if (query && e.key === "Enter") {
      await searchUser(query);
    }
  };

useEffect(() => {
  if (searchUserData.isSuccess) {
    dispatch(addToSearchedUsers(searchUserData.data.users));
    toast.success(searchUserData.data.msg, {
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
  if (searchUserData.isError) {
    toast.error(searchUserData.error.data.msg || "Search failed", {
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
  dispatch,
  searchUserData.isSuccess,
  searchUserData.data?.msg,
  searchUserData.data?.users,
  searchUserData.isError,
  searchUserData.error?.data?.msg,
]);
  return (
    <TextField
      sx={{
        width: "90%",
        maxWidth: _700 ? "750px" : "100%",
        boxShadow: darkMode
          ? "0 4px 12px rgba(255, 255, 255, 0.1)"
          : "0 4px 12px rgba(102, 126, 234, 0.2)",
        borderRadius: "16px",
        mx: "auto",
        my: _700 ? 5 : 3,
        "& .MuiOutlinedInput-root": {
          color: darkMode ? "whitesmoke" : "black",
          background: darkMode
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(102, 126, 234, 0.05)",
          "& fieldset": {
            border: "none",
          },
          "&:hover": {
            background: darkMode
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(102, 126, 234, 0.08)",
          },
          "&:focus-within": {
            boxShadow: darkMode
              ? "0 0 0 3px rgba(255, 255, 255, 0.2)"
              : "0 0 0 3px rgba(102, 126, 234, 0.2)",
            borderRadius: "16px",
          },
        },
      }}
      placeholder="Search user..."
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{ color: darkMode ? "whitesmoke" : "black" }}
          >
            <FaSearch />
          </InputAdornment>
        ),
      }}
      onChange={(e) => setQuery(e.target.value)}
      onKeyUp={handleSearch}
    />
  );
};

export default SearchInput;
