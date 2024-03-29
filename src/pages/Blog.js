import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Link } from "@mui/material";
import { getUserApi } from "../api/authentication";
import {
  deleteBlogApi,
  getOneBlogApi,
  subscribeApi,
  unSubscribeApi,
} from "../api/blogs";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState({});
  const [subscribed, setSubscribed] = useState(null);

  const getBlog = async () => {
    const res = await getOneBlogApi(id);
    if (res.data) {
      setBlog(res.data);
    } else {
      alert(res.response.data.messege);
    }
  };

  const getUser = async () => {
    const res = await getUserApi();
    if (res.data) {
      setUser(res.data);
      const count = res.data.unSubscribed.filter((sub) => sub === id).length;
      setSubscribed(count === 0);
    } else {
      alert(res.response.data.messege);
    }
  };

  useEffect(() => {
    getUser();
    getBlog();
    // eslint-disable-next-line
  }, []);

  const navigate = useNavigate();
  const handleDelete = async () => {
    const res = await deleteBlogApi(id);
    if (res.data) {
      navigate("/");
    } else {
      alert(res.response.data.message);
    }
  };
  const handleSubscribe = async () => {
    const res = await subscribeApi(id);
    if (res.data) {
      setSubscribed(true);
    } else {
      alert(res.response.data.message);
    }
  };

  const handleUnSubscribe = async () => {
    const res = await unSubscribeApi(id);
    if (res.data) {
      setSubscribed(false);
    } else {
      alert(res.response.data.message);
    }
  };

  return (
    <div className="blog-post bg-dark" style={{ minHeight: "100vh" }}>
      <div style={{ width: "auto" }}>
        <Button
          color="primary"
          variant="outlined"
          sx={{ width: "auto" }}
          className="mx-2"
          onClick={() => (subscribed ? handleUnSubscribe() : handleSubscribe())}
        >
          {subscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
        {user && user.role === "Moderator" && (
          <Button
            color="error"
            variant="outlined"
            sx={{ width: "auto" }}
            className="mx-2"
            onClick={() => handleDelete()}
          >
            Delete Blog
          </Button>
        )}
      </div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-5 mx-auto">
          <div className="flex flex-wrap -m-12 mx-auto">
            <div className="p-12 flex flex-col items-start">
              <span className="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                {blog && blog.category}
              </span>
              <img
                className="mt-4 mx-auto w-5/6"
                src={blog && blog.cover}
                alt={blog && blog.title}
              />
              <h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
                {blog && blog.title}
              </h2>
              <p className="leading-relaxed mb-8">
                {blog && blog.description} Lorem Ipsum is simply dummy text of
                the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book. It has survived not only five centuries, but
                also the leap into electronic typesetting, remaining essentially
                unchanged. It was popularised in the 1960s with the release of
                Letraset sheets containing Lorem Ipsum passages, and more
                recently with desktop publishing software like Aldus PageMaker
                including versions of Lorem Ipsum.
              </p>
              <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                <span className="text-gray-400 mr-3 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
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
                  {blog && blog.likes}
                </span>
                <span className="text-gray-400 inline-flex items-center leading-none text-sm">
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
                  {blog && blog.comments.length}
                </span>
              </div>
              <Link href="/" className="inline-flex items-center">
                <img
                  alt="blog"
                  src="https://dummyimage.com/104x104"
                  className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center"
                />
                <span className="flex-grow flex flex-col pl-4">
                  <span className="title-font font-medium text-gray-900">
                    {blog && blog.authorName}
                  </span>
                  <span className="text-gray-400 text-xs tracking-widest mt-0.5">
                    {blog && blog.createdAt}
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
