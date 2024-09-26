import "./Book.css";
import {
  CardActions,
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Container,
} from "@mui/material";
import { getBooks, deleteBook } from "../../APIs/Book";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Book() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
    });
  }, []);

  const handleAddBook = () => {
    navigate("/add-book");
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) {
      deleteBook(bookId)
        .then(() => {
          setBooks((prevBooks) =>
            prevBooks.filter((book) => book.id !== bookId)
          );
        })
        .catch((error) => {
          console.error("Kitap silme hatası:", error);
          alert("Kitap silme işlemi başarısız oldu.");
        });
    }
  };

  return (
    <Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
      <Button onClick={handleAddBook}>Ekle</Button>
      {books.map((book) => (
        <Card sx={{ maxWidth: 345, mb: 3 }} key={book.id}>
          <CardMedia
            sx={{ height: 140 }}
            image={book.image || "/img/yazar.jpg"}
            title={book.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {book.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {book.publicationYear}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {book.stock}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => navigate(`/edit-book/${book.id}`)}
            >
              Edit
            </Button>
            <Button
              size="small"
              onClick={() => navigate(`/book-details/${book.id}`)}
            >
              Detay
            </Button>
            <Button size="small" onClick={() => handleDeleteBook(book.id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
    </Container>
  );
}

export default Book;
