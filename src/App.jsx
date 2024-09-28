import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Footer from "./components/Footer";
import Book from "./pages/book/Book";
import BookDetails from "./pages/book/BookDetails";
import Author from "./pages/author/Author";
import Publisher from "./pages/publisher/Publisher";
import Category from "./pages/category/Category";
import Borrowing from "./pages/borrowing/Borrowing";
import { Typography } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Navbar />
      {loading ? (
        <Typography variant="body1" sx={{ minHeight: "100vh" }}>
          Loading...
        </Typography>
      ) : (
        <div className="section">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="book/*" element={<Book />} />
            <Route path="author/*" element={<Author />} />
            <Route path="publisher/*" element={<Publisher />} />
            <Route path="category/*" element={<Category />} />
            <Route path="borrowing/*" element={<Borrowing />} />

            <Route path="/book-details/:bookId" element={<BookDetails />} />
          </Routes>
        </div>
      )}
      <Footer />
    </>
  );
}

export default App;
