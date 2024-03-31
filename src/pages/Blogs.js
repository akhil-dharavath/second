import React, { useEffect, useState } from "react";
import BlogItem from "../components/BlogItem";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllBlogsApi, getTopStoriesApi } from "../api/blogs";
import { getUserApi } from "../api/authentication";
import axios from "axios";
// import serpapi from "serpapi";

const Blogs = ({ search }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname.slice(1);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState([]);
  const [address, setAddress] = useState({});
  const [topStories, setTopStories] = useState([]);

  const getBlogs = async () => {
    const res = await getAllBlogsApi();
    if (res.data) {
      setBlogs(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  const getUser = async () => {
    const res = await getUserApi();
    if (res.data) {
      setUser(res.data);
    } else {
      alert(res.response.data.message);
    }
  };
  // console.log(search);

  const getAddress = async () => {
    const res = await axios({ url: "https://ipapi.co/json/", method: "GET" });
    if (res && res.data) {
      setAddress(res.data);
    } else {
      alert("trouble finding your location");
    }
  };

  const getTopStories = async () => {
    if (address && address.region) {
      const res = await getTopStoriesApi(address.region);
      if (res && res.data) {
        setTopStories(res.data);
      } else {
        console.log(res);
        // alert(res.response.data.message);
      }
    }
  };
  // console.log(topStories);

  useEffect(() => {
    getBlogs();
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getUser();
    }
    // getAddress();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // getTopStories();
    // eslint-disable-next-line
  }, [address]);

  return (
    <section
      className="text-gray-600 body-font bg-dark"
      style={{ minHeight: "100vh" }}
    >
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -m-4">
          {topStories &&
            topStories.length > 0 &&
            topStories.map((story) => (
              <div className="p-4 md:w-1/3">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    className="lg:h-48 md:h-36 mx-auto h-full object-cover object-center"
                    src={story.thumbnail}
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                      {story.source}
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      {story.title}
                    </h1>
                    <p className="leading-relaxed mb-3">
                      published {story.date}
                    </p>
                    <div className="flex items-center flex-wrap ">
                      <a
                        href={story.link}
                        className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
                        target="_blank"
                        rel="noreferrer"
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
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* {blogs && blogs.length > 0 ? (
            blogs
              .filter((blog) => blog.category.toLowerCase().includes(location))
              .map((blog) => <BlogItem key={blog._id} blog={blog} />)
          ) : (
            <p className="text-center mt-5">Trouble finding blogs</p>
          )} */}
          {location === "unsubscribed" ? (
            blogs && blogs.length > 0 ? (
              blogs
                .filter((blog) => {
                  // Check if user.unSubscribed exists and contains blog._id
                  return !(
                    user.unSubscribed && !user.unSubscribed.includes(blog._id)
                  );
                })
                .filter(
                  (blog) =>
                    search === undefined ||
                    blog.title.toLowerCase().includes(search)
                )
                .map((blog) => <BlogItem key={blog._id} blog={blog} />)
            ) : (
              <p className="text-center mt-5">Trouble finding blogs</p>
            )
          ) : blogs && blogs.length > 0 ? (
            blogs
              .filter((blog) => {
                // Check if user.unSubscribed exists and contains blog._id
                return !(
                  user.unSubscribed && user.unSubscribed.includes(blog._id)
                );
              })
              .filter((blog) => blog.category.toLowerCase().includes(location))
              .filter(
                (blog) =>
                  search === undefined ||
                  blog.title.toLowerCase().includes(search)
              )
              .map((blog) => <BlogItem key={blog._id} blog={blog} />)
          ) : (
            <p className="text-center mt-5">Trouble finding blogs</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
