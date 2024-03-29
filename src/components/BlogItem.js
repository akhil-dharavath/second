import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { addCommentApi } from "../api/blogs";
import { getAllUsers } from "../api/authentication";

const BlogItem = ({
  blog: {
    description,
    title,
    createdAt,
    authorName,
    cover,
    category,
    _id,
    likes,
    comments,
  },
}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [comment, setComment] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment === "") {
      return;
    }
    const res = await addCommentApi(_id, comment);
    if (res.data) {
      handleClose();
      window.location.reload();
    } else {
      alert(res.response.data.message);
    }
  };

  const [users, setUsers] = useState({});
  const fetchAllUsers = async () => {
    const res = await getAllUsers();
    if (res.data) {
      setUsers(res.data);
    } else {
      alert("You are not Authorized");
    }
  };
  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-4 md:w-1/3">
      <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
        <img
          className="lg:h-48 md:h-36 w-full object-cover object-center"
          src={cover}
          alt="blog"
        />
        <div className="p-6">
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
            {category}
          </h2>
          <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
            {title.slice(0, 60)}
            {title.length >= 60 && "..."}
          </h1>
          <p className="leading-relaxed mb-3">
            {description.slice(0, 70)}
            {description.length >= 70 && "..."}
          </p>
          <div className="flex items-center flex-wrap ">
            <a
              href={`/blog/${_id}`}
              className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
            >
              Learn More
              <svg
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
            <span className="text-gray-400 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
              <svg
                className="w-4 h-4 mr-1"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {likes}
            </span>
            <span
              className="text-gray-400 inline-flex items-center leading-none text-sm"
              onClick={handleClickOpen}
            >
              <svg
                className="w-4 h-4 mr-1"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
              </svg>
              {comments.length}
            </span>
          </div>
        </div>
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        fullWidth
      >
        <DialogTitle id="responsive-dialog-title">Comments</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="comments">
              {comments.length > 0 &&
                comments.map((comment, index) => (
                  // <div key={index}>{comment.user} {comment.comment}</div>
                  <div key={index} className="d-flex">
                    <img
                      src={require("../assets/author.jpg")}
                      alt="author"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        marginRight: 10,
                        marginBottom: 10,
                      }}
                    />
                    <div className="text-black">
                      <b>
                        {users &&
                        users.length > 0 &&
                        users.filter((user) => user._id === comment.user)
                          .length > 0
                          ? users.filter((user) => user._id === comment.user)[0]
                              .username
                          : "Unknown"}
                      </b>
                      <br />
                      {comment.comment}
                    </div>
                  </div>
                ))}
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "100%",
                  position: "relative",
                }}
              >
                <textarea
                  placeholder="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="comment-input"
                  rows={4}
                />
                <button className="btn btn-primary my-2 w-auto" type="submit">
                  Post
                </button>
              </form>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogItem;
