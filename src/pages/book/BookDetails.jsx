import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "../../APIs/Book";
import {
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    getBookById(bookId)
      .then((data) => {
        setBook(data);
      })
      .catch((error) => {
        console.error("Kitap detaylarını alma hatası:", error);
      });
  }, [bookId]);

  if (!book) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => window.history.back()}
      >
        Geri
      </Button>
      <Card sx={{ maxWidth: 600, margin: "auto", mt: 3 }}>
        <CardMedia
          sx={{ height: 300 }}
          image={book.image || "/img/yazar.jpg"}
          title={book.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {book.name}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {book.author
              ? `Author: ${book.author.name}`
              : "Author: Not available"}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {book.publisher
              ? `Publisher: ${book.publisher.name}`
              : "Publisher: Not available"}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Publication Year: {book.publicationYear}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Stock: {book.stock}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Categories:
          </Typography>
          {book.categories.length > 0 ? (
            <ul>
              {book.categories.map((category) => (
                <li key={`${category.id}-${category.name}`}>
                  {" "}
                  {/* Benzersiz key kullanımı */}
                  <Typography variant="body1">
                    <strong>{category.name}</strong>: {category.description}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body1">No categories available</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default BookDetails;
