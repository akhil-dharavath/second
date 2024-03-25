import React, { useEffect, useState } from "react";
import BlogItem from "../components/BlogItem";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllBlogsApi } from "../api/blogs";

const Blogs = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname.slice(1);
  const [blogs, setBlogs] = useState([]);

  const getBlogs = async () => {
    const res = await getAllBlogsApi();
    if (res.data) {
      setBlogs(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  useEffect(() => {
    getBlogs();
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <section
      className="text-gray-600 body-font bg-dark"
      style={{ minHeight: "100vh" }}
    >
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -m-4">
          {blogs && blogs.length > 0 ? (
            blogs
              .filter((blog) => blog.category.toLowerCase().includes(location))
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
