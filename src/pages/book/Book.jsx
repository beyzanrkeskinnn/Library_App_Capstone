import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid";
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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

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
  const navigate = useNavigate();

  // Fetch books, authors, publishers, and categories from the API when the component mounts
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

  // Update filteredBooks when search term or books change
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

  // Open the modal for adding or editing a book
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

  // Close the modal and reset form data
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

  // Handle form field changes
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

  // Handle date change for the publication year
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

  // Submit form to either add or edit a book
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
      const booksData = await getBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // Open delete confirmation dialog for the selected book
  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setDeleteConfirmOpen(true);
  };

  // Confirm book deletion and fetch updated list of books
  const confirmDelete = async () => {
    try {
      await deleteBook(bookToDelete.id);
      handleSuccessfulResponse("Kitap başarıyla silindi", "success");
      const booksData = await getBooks();
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setDeleteConfirmOpen(false);
      setBookToDelete(null);
    }
  };

  // Show success response in snackbar
  const handleSuccessfulResponse = (message, severity) => {
    setNotification({ message, severity });
    setSnackbarOpen(true);
  };

  // Handle and display Axios errors
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
    <Container maxWidth="lg" sx={{ pt: 5, pb: 5 }}>
      <Typography variant="body2" pb={2} textAlign={"center"}>
        Books encourage personal and social development by imparting knowledge
        and ideas.
      </Typography>
      <div className="p-search">
        <Button
          variant="contained"
          color="success"
          onClick={() => handleOpenModal()}
        >
          Added
        </Button>
        <TextField
          label="Ara..."
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "30%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <Grid container spacing={3} sx={{ marginTop: 0, borderTop: "none" }}>
        {filteredBooks.map((book) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140, objectFit: "cover" }}
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
              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenModal(book)}
                ></Button>
                <Button
                  color="info"
                  onClick={() => navigate(`/book-details/${book.id}`)} // Detay sayfasına yönlendirme
                >
                  DETAİL
                </Button>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteBook(book)}
                ></Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{isEditing ? "Kitap Düzenle" : "Kitap Ekle"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Book Name"
              type="text"
              fullWidth
              value={bookData.name}
              onChange={handleChange}
              required
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Publication Year"
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
              label="Stock"
              type="number"
              fullWidth
              value={bookData.stock}
              onChange={handleChange}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Author</InputLabel>
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
              <InputLabel>Publisher</InputLabel>
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
              <Typography>Categories Select</Typography>
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
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Book Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the {bookToDelete?.name} book?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cansel</Button>
          <Button onClick={confirmDelete}>Delete</Button>
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
