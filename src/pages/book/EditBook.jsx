import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBookById,
  updateBook,
  getAuthors,
  getPublishers,
  getCategories,
} from "../../APIs/Book";
import {
  Box,
  Button,
  FormControl,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function EditBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();

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
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const book = await getBookById(bookId);
        console.log("Book data:", book); // Veriyi kontrol edin

        // Kitap verilerini ayarla
        setBookData({
          name: book.name || "",
          publicationYear: book.publicationYear || "",
          stock: book.stock || "",
          authorId: book.author ? book.author.id.toString() : "", // ID'yi string olarak
          publisherId: book.publisher ? book.publisher.id.toString() : "", // ID'yi string olarak
          categoryIds: book.categories
            ? book.categories.map((cat) => cat.id.toString())
            : [], // Kategori ID'lerini string olarak
        });

        // Diğer verileri al
        const [authorsData, publishersData, categoriesData] = await Promise.all(
          [getAuthors(), getPublishers(), getCategories()]
        );

        console.log("Authors data:", authorsData);
        console.log("Publishers data:", publishersData);
        console.log("Categories data:", categoriesData);

        // Verileri state'e ata
        setAuthors(authorsData);
        setPublishers(publishersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      }
    };

    fetchData();
  }, [bookId]);

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
    const formattedDate = date ? date.getFullYear() : "";
    setBookData((prev) => ({
      ...prev,
      publicationYear: formattedDate,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !bookData.name ||
      !bookData.publicationYear ||
      !bookData.stock ||
      !bookData.authorId ||
      !bookData.publisherId ||
      bookData.categoryIds.length === 0
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const updatedBook = {
      name: bookData.name,
      publicationYear: bookData.publicationYear,
      stock: bookData.stock,
      author: { id: bookData.authorId },
      publisher: { id: bookData.publisherId },
      categories: bookData.categoryIds.map((id) => ({ id })),
    };

    console.log("Updating book with:", updatedBook);

    updateBook(bookId, updatedBook)
      .then((response) => {
        setSnackbarMessage("Kitap başarıyla güncellendi!");
        setSnackbarOpen(true);
        navigate("/book");
      })
      .catch((error) => {
        console.error("Kitap güncelleme hatası:", error);
        setSnackbarMessage("Kitap güncelleme hatası!");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box mb={2} border={"2px solid #4caf50"} p={5}>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/book")}
        sx={{ mb: 2 }}
      >
        Geri
      </Button>
      <FormControl fullWidth>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "30ch" },
            display: "flex",
            flexDirection: "column",
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <TextField
            id="name"
            label="Book Name"
            variant="outlined"
            name="name"
            value={bookData.name}
            onChange={handleChange}
          />
          <TextField
            id="stock"
            label="Stock"
            variant="outlined"
            name="stock"
            type="number"
            value={bookData.stock}
            onChange={handleChange}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Publication Year"
              views={["year"]}
              value={
                bookData.publicationYear
                  ? new Date(bookData.publicationYear, 0)
                  : null
              }
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <TextField
            select
            label="Select Author"
            name="authorId"
            value={bookData.authorId}
            onChange={handleChange}
            variant="outlined"
          >
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id.toString()}>
                {author.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Publisher"
            name="publisherId"
            value={bookData.publisherId}
            onChange={handleChange}
            variant="outlined"
          >
            {publishers.map((publisher) => (
              <MenuItem key={publisher.id} value={publisher.id.toString()}>
                {publisher.name}
              </MenuItem>
            ))}
          </TextField>

          <FormControl component="fieldset">
            {categories.map((category) => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    checked={bookData.categoryIds.includes(
                      category.id.toString()
                    )}
                    onChange={handleChange}
                    name="categoryIds"
                    value={category.id.toString()}
                  />
                }
                label={category.name}
              />
            ))}
          </FormControl>

          <Button type="submit" variant="contained" color="primary">
            Update Book
          </Button>
        </Box>
      </FormControl>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarMessage.includes("başarıyla") ? "success" : "error"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditBook;
