import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
  disableUser,
  enableUser,
  getAllUsers,
  getUserApi,
} from "../api/authentication";
import { createBlogApi, getEventApi, suggestApi } from "../api/blogs";
import Spinner from "./Spinner";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const Navbar = ({ sections, search, setSearch }) => {
  const location = useLocation();

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    location.reload();
  };

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAddPost({
      id: Math.floor(Math.random() * 1000000),
      title: "",
      description: "",
      cover: "",
      authorName: "",
      createdAt: "",
      category: "",
      authorAvatar: require("../assets/author.jpg"),
      likes: 0,
      comments: [],
    });
  };

  const [addPost, setAddPost] = useState({
    title: "",
    description: "",
    cover: "",
    authorName: "",
    createdAt: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddPost({ ...addPost, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createBlogApi(addPost);
    if (res.data) {
      enqueueSnackbar("Successfully blog has been added!", { variant: "success" });
      handleClose();
      const path = addPost.category.toLowerCase();
      navigate(`/${path}`);
    } else {
      alert(res.response.data.message);
    }
  };

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const getUser = async () => {
    if (localStorage.getItem("token")) {
      const res = await getUserApi();
      if (res.data) {
        setUser(res.data);
      } else {
        alert(res.response.data.message);
      }
      if (res.data.role === "Administrator") {
        let resp = await getAllUsers();
        if (resp.data) {
          setUsers(resp.data);
          // window.location.reload();
        } else {
          alert(resp.response.data.message);
        }
      }
    }
  };

  const fetchUsers = async () => {
    let resp = await getAllUsers();
    if (resp.data) {
      setUsers(resp.data);
    } else {
      alert(resp.response.data.message);
    }
  };

  const handleEnableDisableUser = async (userId, enable) => {
    if (enable) {
      await enableUser(userId);
    } else {
      await disableUser(userId);
    }
    // Refetch users after enabling/disabling user
    fetchUsers();
  };

  useEffect(() => {
    getUser();
  }, []);

  const [openFirst, setOpenFirst] = React.useState(false);
  const [firstLoading, setFirstLoading] = React.useState(false);

  const [openSecond, setOpenSecond] = React.useState(false);
  const [secondLoading, setSecondLoading] = React.useState(false);

  const [first, setFirst] = React.useState("");
  const [second, setSecond] = React.useState([]);
  const [locate, setLocate] = React.useState("");

  const [address, setAddress] = React.useState({});
  //   const [topStories, setTopStories] = React.useState([]);

  const handleClickOpenFirst = async () => {
    setOpenFirst(true);
  };

  const firstSubmit = async (city, question, temperature, weather) => {
    const res = await suggestApi(city, question, temperature, weather);
    if (res.data) {
      setFirst(res.data);
      setFirstLoading(false);
      return;
    } else {
      setFirstLoading(false);
      alert(res.response.data.message);
      return;
    }
  };

  const secondSubmit = async (question) => {
    const res = await getEventApi(question);
    if (res.data) {
      setSecond(res.data);
      setSecondLoading(false);
      return;
    } else {
      setSecondLoading(false);
      alert(res.response.data.message);
      return;
    }
  };

  const handleClickOpenSecond = () => {
    setOpenSecond(true);
  };

  const handleCloseFirst = () => {
    setOpenFirst(false);
    setFirst("");
    setLocate("");
  };

  const handleCloseSecond = () => {
    setOpenSecond(false);
    setSecond([]);
    setLocate("");
  };

  const getAddress = async () => {
    const res = await axios({ url: "https://ipapi.co/json/", method: "GET" });
    if (res && res.data) {
      setAddress(res.data);
    } else {
      alert("trouble finding your location");
    }
  };

  const getLocation = () => {
    if (address && address.region) {
      setLocate(`${address.city}, ${address.region}`);
    } else {
      alert(
        "Cannot access your location. You might have been blocked loaciton for the browser. Please allow loaction to see your current location"
      );
    }
  };

  //   const getTopStories = async () => {
  //     if (address && address.region) {
  //       const res = await getTopStoriesApi(address.region);
  //       if (res && res.data) {
  //         setTopStories(res.data);
  //       } else {
  //         console.log(res);
  //         // alert(res.response.data.message);
  //       }
  //     }
  //   };

  useEffect(() => {
    getAddress();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // getTopStories();
    // eslint-disable-next-line
  }, [address]);

  return (
    <header
      className="text-gray-600 body-font bg-gray-800"
      style={{ display: !user.role && "none" }}
    >
      {user && (
        <div className="mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center">
          <Link
            to={"/"}
            className="flex title-font font-medium items-center text-gray-900 mb-0 md:mb-0"
          >
            <span className="ml-2 text-xl">Blogs</span>
          </Link>
          <nav className="md:mr-auto md:ml-2 md:py-1 md:pl-2 md:border-gray-400	flex flex-wrap items-center text-base justify-center">
            {sections.map((section) => (
              <Link
                key={section.url}
                to={`/${section.url}`}
                className="mr-3 hover:text-gray-900"
              >
                {section.title}
              </Link>
            ))}
          </nav>
          <TextField
            size="small"
            sx={{
              width: 180,
              background: "white",
              marginRight: 2,
              borderRadius: 1,
            }}
            placeholder="Search blog"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <a
            className="nav-link dropdown-toggle"
            href="/"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {user && user.username}
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link className="dropdown-item">{user && user.username}</Link>
            </li>
            <li>
              <Link className="dropdown-item">{user && user.email}</Link>
            </li>
            <li>
              <Link className="dropdown-item">{user && user.role}</Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" onClick={handleClickOpenFirst}>
                Suggest Activities
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" onClick={handleClickOpenSecond}>
                Real time events
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" onClick={handleClickOpen}>
                Add Post
              </Link>
            </li>
            <li>
              <Link to={"/unsubscribed"} className="dropdown-item">
                Unsubscribed Blogs
              </Link>
            </li>
            {user && user.role === "Administrator" && (
              <>
                <li>
                  <Link className="dropdown-item" onClick={() => setShow(true)}>
                    Manage Login Accounts
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
              </>
            )}
            <li>
              <Link
                className="dropdown-item"
                style={{ color: "red" }}
                onClick={() => handleLogout()}
              >
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      )}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Add a Blog"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              className={"my-2"}
              fullWidth
              label="Title"
              variant="outlined"
              value={addPost.title}
              name="title"
              onChange={(e) => handleChange(e)}
              required
              size="small"
            />
            <TextField
              className={"my-2"}
              fullWidth
              label="Description"
              variant="outlined"
              value={addPost.description}
              name="description"
              onChange={(e) => handleChange(e)}
              required
              size="small"
            />
            <TextField
              className={"my-2"}
              fullWidth
              variant="outlined"
              value={addPost.createdAt}
              name="createdAt"
              onChange={(e) => handleChange(e)}
              required
              type="date"
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Category"
                name="category"
                value={addPost.category}
                onChange={(e) => handleChange(e)}
                size="small"
              >
                <MenuItem value="Academic">Academic</MenuItem>
                <MenuItem value="Career">Career</MenuItem>
                <MenuItem value="Campus">Campus</MenuItem>
                <MenuItem value="Culture">Culture</MenuItem>
                <MenuItem value="Local Community">Local Community</MenuItem>
                <MenuItem value="Social">Social</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Health and Wellness">
                  Health and Wellness
                </MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Travel">Travel</MenuItem>
                <MenuItem value="Alumni">Alumni</MenuItem>
              </Select>
            </FormControl>
            <TextField
              className={"my-2"}
              fullWidth
              label="Author Name"
              variant="outlined"
              value={addPost.authorName}
              name="authorName"
              onChange={(e) => handleChange(e)}
              required
              size="small"
            />
            <TextField
              className={"my-2"}
              fullWidth
              label="Image link (https)"
              variant="outlined"
              value={addPost.cover}
              name="cover"
              onChange={(e) => handleChange(e)}
              required
              size="small"
            />
          </DialogContent>
          <DialogActions>
            <Button color="error" sx={{ width: "auto" }} onClick={handleClose}>
              Cancel
            </Button>
            <Button color="success" sx={{ width: "auto" }} type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {show && (
        <Dialog open={show} onClose={() => setShow(false)} fullWidth>
          <DialogTitle>Manage Login Accounts</DialogTitle>
          <DialogContent>
            {users &&
              users.length > 0 &&
              users
                .filter((user) => user.role !== "Administrator")
                .map((user) => (
                  <Box
                    key={user._id}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>{user.username}</Typography>
                    <Checkbox
                      defaultChecked={user.enable ? true : false}
                      onChange={() =>
                        handleEnableDisableUser(user._id, !user.enable)
                      }
                    />
                  </Box>
                ))}
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              sx={{ width: "auto" }}
              onClick={() => setShow(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={openFirst}
        onClose={handleCloseFirst}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const question = formJson.question;
            if (address && address.city) {
              setFirstLoading(true);
              const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${address.latitude}&lon=${address.longitude}&exclude=minutely&units=metric&appid=117bfe6be263d54afb55f47b46b6daf1`
              );
              firstSubmit(
                address.city,
                question,
                res.data.current.temp,
                res.data.daily[0].weather[0].main
              );
            } else {
              alert("trouble finding your location");
            }
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {"Suggest Activities"}
          <Button
            variant="outlined"
            sx={{ width: "auto" }}
            onClick={() => getLocation()}
          >
            Get location
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Recommend activities based on current weather conditions.
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            placeholder="Search event"
            size="small"
            name="question"
          />
          {locate !== "" && (
            <Typography sx={{ mt: 1, mb: 1 }}>
              Your current location is {locate}
            </Typography>
          )}
          {firstLoading ? (
            <Spinner />
          ) : (
            <Typography sx={{ mt: 1, mb: 1 }}>{first}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFirst} sx={{ width: "auto" }}>
            Cancel
          </Button>
          <Button type="submit" sx={{ width: "auto" }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSecond}
        onClose={handleCloseSecond}
        PaperProps={{
          component: "form",
          onSubmit: async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const question = formJson.question;
            secondSubmit(question);
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          {"Real Time Events"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Search real-time events / search (current sports events).
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            placeholder="Search event"
            size="small"
            name="question"
          />
          {secondLoading ? (
            <Spinner />
          ) : (
            second &&
            second.length > 0 &&
            second.map((done) => (
              <Typography key={done.title} sx={{ mt: 1, mb: 1 }}>
                <a
                  target="_blank"
                  href={done.link}
                  rel="noreferrer"
                  className="text-black no-underline hover:underline"
                >
                  {done.title}
                </a>
              </Typography>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSecond} sx={{ width: "auto" }}>
            Cancel
          </Button>
          <Button type="submit" sx={{ width: "auto" }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

export default Navbar;
