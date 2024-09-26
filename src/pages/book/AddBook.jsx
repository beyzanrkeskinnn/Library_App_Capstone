import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, getAuthors, getPublishers, getCategories } from "../../APIs/Book";
import { Box, Button, FormControl, TextField, MenuItem, FormControlLabel, Checkbox, Snackbar, Alert } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function AddBook() {
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    name: "",
    publicationYear: null,
    stock: "",
    authorId: "",
    publisherId: "",
    categories: [],
  });

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 


  useEffect(() => {
    getAuthors().then((data) => setAuthors(data));
    getPublishers().then((data) => setPublishers(data));
    getCategories().then((data) => setCategories(data));
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleDateChange = (date) => {
    const formattedDate = date ? date.getFullYear() : null;
    setBookData((prev) => ({
      ...prev,
      publicationYear: formattedDate,
    }));
  };

 
  const handleCategoryChange = (categoryId) => {
    setBookData((prev) => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId) 
        : [...prev.categories, categoryId]; 
      return { ...prev, categories };
    });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Yeni kitap verisi oluştur
    const newBookData = {
      name: bookData.name,
      publicationYear: bookData.publicationYear,
      stock: bookData.stock,
      author: bookData.authorId ? { id: bookData.authorId } : null, // Eğer authorId varsa
      publisher: bookData.publisherId ? { id: bookData.publisherId } : null, // Eğer publisherId varsa
      categories: bookData.categories.map((catId) => ({ id: catId })) // Kategori ID'lerini id formatında gönder
    };
  
    console.log("Gönderilen Kitap Verisi:", newBookData);
  
    createBook(newBookData)
      .then(() => {
        setSnackbarMessage("Kitap başarıyla eklendi!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setBookData({
          name: "",
          publicationYear: null,
          stock: "",
          authorId: "",
          publisherId: "",
          categories: [],
        });
      })
      .catch((error) => {
        console.error("Kitap ekleme hatası:", error);
        setSnackbarMessage("Kitap ekleme hatası!");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };
  

  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box mb={2} border={"2px solid #4caf50"} p={5}>
     
      <Button variant="outlined" color="secondary" onClick={() => navigate("/book")} sx={{ mb: 2 }}>
        Geri
      </Button>

     
      <FormControl fullWidth>
        <Box component="form" onSubmit={handleSubmit} sx={{ "& > :not(style)": { m: 1, width: "30ch" }, display: "flex", flexDirection: "column" }} noValidate autoComplete="off">
          
          
          <TextField id="name" label="Kitap Adı" variant="outlined" name="name" value={bookData.name} onChange={handleChange} />

         
          <TextField id="stock" label="Stok" variant="outlined" name="stock" type="number" value={bookData.stock} onChange={handleChange} />

          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Yayın Yılı"
              views={["year"]}
              value={bookData.publicationYear ? new Date(bookData.publicationYear, 0) : null}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          
          <TextField select label="Yazar Seçin" name="authorId" value={bookData.authorId} onChange={handleChange} variant="outlined">
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name}
              </MenuItem>
            ))}
          </TextField>

         
          <TextField select label="Yayınevi Seçin" name="publisherId" value={bookData.publisherId} onChange={handleChange} variant="outlined">
            {publishers.map((publisher) => (
              <MenuItem key={publisher.id} value={publisher.id}>
                {publisher.name}
              </MenuItem>
            ))}
          </TextField>

       
          <FormControl component="fieldset">
            {categories.map((category) => (
              <FormControlLabel
                key={category.id}
                control={<Checkbox checked={bookData.categories.includes(category.id)} onChange={() => handleCategoryChange(category.id)} />}
                label={category.name}
              />
            ))}
          </FormControl>

          
          <Button type="submit" variant="contained" color="primary">
            Kitap Ekle
          </Button>
        </Box>
      </FormControl>

     
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddBook;
