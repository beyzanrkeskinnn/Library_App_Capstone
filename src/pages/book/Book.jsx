import { useEffect, useState } from "react";
import {
  CardActions,
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  getBooks,
  deleteBook,
  getAuthors,
  getPublishers,
  getCategories,
  addBook,
  updateBook,
} from "../../APIs/Book";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function Book() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookData, setBookData] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    authorId: "",
    publisherId: "",
    categoryIds: [],
  });
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    severity: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksData = await getBooks();
        setBooks(booksData);
        setFilteredBooks(booksData);

        const [authorsData, publishersData, categoriesData] = await Promise.all(
          [getAuthors(), getPublishers(), getCategories()]
        );

        setAuthors(authorsData);
        setPublishers(publishersData);
        setCategories(categoriesData);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredBooks(
        books.filter((book) =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredBooks(books);
    }
  }, [searchTerm, books]);

  const handleOpenModal = (book = null) => {
    setIsEditing(!!book);
    setSelectedBook(book);
    setBookData({
      name: book?.name || "",
      publicationYear: book?.publicationYear || "",
      stock: book?.stock || "",
      authorId: book?.author ? book.author.id.toString() : "",
      publisherId: book?.publisher ? book.publisher.id.toString() : "",
      categoryIds: book?.categories
        ? book.categories.map((cat) => cat.id.toString())
        : [],
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
    setBookData({
      name: "",
      publicationYear: "",
      stock: "",
      authorId: "",
      publisherId: "",
      categoryIds: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "categoryIds") {
      setBookData((prev) => ({
        ...prev,
        categoryIds: checked
          ? [...prev.categoryIds, value]
          : prev.categoryIds.filter((id) => id !== value),
      }));
    } else {
      setBookData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      setBookData((prev) => ({
        ...prev,
        publicationYear: date.getFullYear(),
      }));
    } else {
      setBookData((prev) => ({
        ...prev,
        publicationYear: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookPayload = {
      name: bookData.name,
      publicationYear: bookData.publicationYear,
      stock: bookData.stock,
      author: { id: bookData.authorId },
      publisher: { id: bookData.publisherId },
      categories: bookData.categoryIds.map((id) => ({ id })),
    };

    const action = isEditing ? updateBook : addBook;
    const actionPayload = isEditing
      ? [selectedBook.id, bookPayload]
      : [bookPayload];

    try {
      await action(...actionPayload);
      handleSuccessfulResponse(
        `Kitap ${isEditing ? "güncellendi" : "eklendi"}!`,
        "success"
      );
      handleCloseModal();
      setBooks((prevBooks) => {
        if (isEditing) {
          return prevBooks.map((book) =>
            book.id === selectedBook.id ? { ...book, ...bookPayload } : book
          );
        } else {
          return [...prevBooks, bookPayload];
        }
      });
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBook(bookToDelete.id);
      handleSuccessfulResponse("Kitap başarıyla silindi!", "success");
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookToDelete.id)
      );
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setDeleteConfirmOpen(false);
      setBookToDelete(null);
    }
  };

  const handleSuccessfulResponse = (message, severity) => {
    setNotification({ message, severity });
    setSnackbarOpen(true);
  };

  const handleAxiosError = (error) => {
    let errorMessage = "Bir hata oluştu.";
    if (error.response) {
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data?.data) {
        errorMessage = error.response.data.data[0] || "Bir hata oluştu.";
      } else {
        errorMessage = error.message;
      }
    } else {
      errorMessage = error.message;
    }
    console.error("Hata detayları:", error);
    handleSuccessfulResponse(errorMessage, "error");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
      <TextField
        label="Ara"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button onClick={() => handleOpenModal()}>Kitap Ekle</Button>
      {filteredBooks.map((book) => (
        <Card sx={{ maxWidth: 345, mb: 3 }} key={book.id}>
          <CardMedia
            sx={{ height: 140 }}
            image={book.image || "/img/yazar.jpg"}
            title={book.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {book.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {book.publicationYear}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {book.author?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {book.publisher?.name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleOpenModal(book)}>
              Düzenle
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleDeleteBook(book)}
            >
              Sil
            </Button>
          </CardActions>
        </Card>
      ))}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{isEditing ? "Kitap Düzenle" : "Kitap Ekle"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Kitap Adı"
              type="text"
              fullWidth
              value={bookData.name}
              onChange={handleChange}
              required
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Yayın Yılı"
                value={
                  bookData.publicationYear
                    ? new Date(bookData.publicationYear, 0)
                    : null
                }
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField {...params} margin="dense" fullWidth />
                )}
              />
            </LocalizationProvider>
            <TextField
              margin="dense"
              name="stock"
              label="Stok"
              type="number"
              fullWidth
              value={bookData.stock}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Yazar</InputLabel>
              <Select
                name="authorId"
                value={bookData.authorId}
                onChange={handleChange}
                required
              >
                {authors.map((author) => (
                  <MenuItem key={author.id} value={author.id}>
                    {author.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Yayınevi</InputLabel>
              <Select
                name="publisherId"
                value={bookData.publisherId}
                onChange={handleChange}
                required
              >
                {publishers.map((publisher) => (
                  <MenuItem key={publisher.id} value={publisher.id}>
                    {publisher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormGroup>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      value={category.id}
                      checked={bookData.categoryIds.includes(
                        category.id.toString()
                      )}
                      onChange={handleChange}
                      name="categoryIds"
                    />
                  }
                  label={category.name}
                />
              ))}
            </FormGroup>
            <DialogActions>
              <Button onClick={handleCloseModal}>İptal</Button>
              <Button type="submit">Kaydet</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Kitap Sil</DialogTitle>
        <DialogContent>
          <Typography>
            {bookToDelete?.name} kitabını silmek istediğinize emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete}>Sil</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Book;
