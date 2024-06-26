import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Blogs from "./pages/Blogs";
import Navbar from "./components/Navbar";
import Blog from "./pages/Blog";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";
import { SnackbarProvider } from "notistack";

const sections = [
  { title: "Academic", url: "academic" },
  { title: "Career", url: "career" },
  { title: "Campus", url: "campus" },
  { title: "Culture", url: "culture" },
  { title: "Local Community", url: "local" },
  { title: "Social", url: "social" },
  { title: "Sports", url: "sports" },
  { title: "Health", url: "health" },
  { title: "Technology", url: "technology" },
  { title: "Travel", url: "travel" },
  { title: "Alumni", url: "alumni" },
];

function App() {
  const [search, setSearch] = useState("");
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <BrowserRouter>
        <Navbar sections={sections} search={search} setSearch={setSearch} />
        <Routes>
          <Route path="/" element={<Blogs search={search} title="" />} />
          <Route
            path="/unsubscribed"
            element={<Blogs search={search} title="" />}
          />
          {sections.map((section) => (
            <Route
              key={section.url}
              exact
              path={`${section.url}`}
              element={<Blogs search={search} title={section.title} />}
            />
          ))}
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
