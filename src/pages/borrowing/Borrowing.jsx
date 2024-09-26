import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  tableCellClasses,
  TableHead,
  TableRow,
  Paper,
  styled,
  Button,
  Box,
  TextField,
  FormControl,
  InputAdornment,
  TablePagination,
  MenuItem,
  Select,
  InputLabel,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getBorrows, createBorrow, deleteBorrow, updateBorrow } from "../../APIs/Borrow";
import { getBooks } from "../../APIs/Book";
import { parseISO, format } from "date-fns";

// Stil kodları
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d47a33",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Borrow() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [newBorrow, setNewBorrow] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: null,
    returnDate: null,
    bookId: "",
  });
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    severity: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const borrowData = await getBorrows();
        setBorrows(borrowData);
        const bookData = await getBooks();
        setBooks(bookData);
      } catch (error) {
        handleAxiosError(error);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBorrow((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (newValue, fieldName) => {
    setNewBorrow((prevState) => ({
      ...prevState,
      [fieldName]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        borrowerName: newBorrow.borrowerName,
        borrowerMail: newBorrow.borrowerMail,
        borrowingDate: newBorrow.borrowingDate ? format(newBorrow.borrowingDate, "yyyy-MM-dd") : null,
        returnDate: newBorrow.returnDate ? format(newBorrow.returnDate, "yyyy-MM-dd") : null,
        bookForBorrowingRequest: {
          id: newBorrow.bookId,
        },
      };
      if (selectedBorrow) {
        // Update existing borrow
        await updateBorrow(selectedBorrow.id, dataToSend);
        setNotification({
          message: "Borrow record updated successfully!",
          severity: "success",
        });
      } else {
        // Create new borrow
        await createBorrow(dataToSend);
        setNotification({
          message: "Borrow record created successfully!",
          severity: "success",
        });
      }
      setOpenSnackbar(true);
      setNewBorrow({
        borrowerName: "",
        borrowerMail: "",
        borrowingDate: null,
        returnDate: null,
        bookId: "",
      });
      setSelectedBorrow(null);
      const updatedBorrows = await getBorrows();
      setBorrows(updatedBorrows);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleAxiosError = (error) => {
    let errorMessage = "An error occurred.";
    if (error.response?.data?.data) {
      errorMessage = error.response.data.data[0];
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    setNotification({ message: errorMessage, severity: "error" });
    setOpenSnackbar(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBorrow(id);
      const updatedBorrows = await getBorrows();
      setBorrows(updatedBorrows);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleEdit = (borrow) => {
    setNewBorrow({
      borrowerName: borrow.borrowerName,
      borrowerMail: borrow.borrowerMail,
      borrowingDate: parseISO(borrow.borrowingDate),
      returnDate: borrow.returnDate ? parseISO(borrow.returnDate) : null,
      bookId: borrow.book.id,
    });
    setSelectedBorrow(borrow);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewBorrow({
      borrowerName: "",
      borrowerMail: "",
      borrowingDate: null,
      returnDate: null,
      bookId: "",
    });
    setSelectedBorrow(null);
  };

  const filteredBorrows = borrows.filter((borrow) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      borrow.borrowerName.toLowerCase().includes(searchValue) ||
      borrow.borrowerMail.toLowerCase().includes(searchValue) ||
      (borrow.borrowingDate && format(parseISO(borrow.borrowingDate), "dd MMM yyyy").toLowerCase().includes(searchValue)) ||
      (borrow.returnDate && format(parseISO(borrow.returnDate), "dd MMM yyyy").toLowerCase().includes(searchValue))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ pt: 5, pb: 5 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          pb: 4,
          fontWeight: "bold",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        Borrows
      </Typography>
      <Box mb={2} textAlign="center">
        <Typography variant="body2" pb={2}>
          Search through borrow records.
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Box mb={2} border={"2px solid #4caf50"} p={5}>
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
              id="borrowerName"
              label="Borrower Name"
              variant="outlined"
              name="borrowerName"
              value={newBorrow.borrowerName}
              onChange={handleChange}
            />
            <TextField
              id="borrowerMail"
              label="Borrower Email"
              variant="outlined"
              name="borrowerMail"
              value={newBorrow.borrowerMail}
              onChange={handleChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Borrowing Date"
                value={newBorrow.borrowingDate}
                onChange={(newValue) => handleDateChange(newValue, "borrowingDate")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="Return Date"
                value={newBorrow.returnDate}
                onChange={(newValue) => handleDateChange(newValue, "returnDate")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel id="book-select-label">Select Book</InputLabel>
              <Select
                labelId="book-select-label"
                id="book-select"
                name="bookId"
                value={newBorrow.bookId}
                onChange={handleChange}
                label="Select Book"
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              {selectedBorrow ? "Update Borrow" : "Add Borrow"}
            </Button>
          </Box>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Borrower Name</StyledTableCell>
              <StyledTableCell>Borrower Email</StyledTableCell>
              <StyledTableCell>Borrowing Date</StyledTableCell>
              <StyledTableCell>Return Date</StyledTableCell>
              <StyledTableCell>Book</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBorrows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((borrow) => (
                <StyledTableRow key={borrow.id}>
                  <StyledTableCell>{borrow.borrowerName}</StyledTableCell>
                  <StyledTableCell>{borrow.borrowerMail}</StyledTableCell>
                  <StyledTableCell>
                    {borrow.borrowingDate
                      ? format(parseISO(borrow.borrowingDate), "dd MMM yyyy")
                      : "-"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {borrow.returnDate
                      ? format(parseISO(borrow.returnDate), "dd MMM yyyy")
                      : "-"}
                  </StyledTableCell>
                  <StyledTableCell>{borrow.book?.name || "-"}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEdit(borrow)}
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(borrow.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredBorrows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={notification.message}
        severity={notification.severity}
      />
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{selectedBorrow ? "Edit Borrow Record" : "Add New Borrow Record"}</DialogTitle>
        <DialogContent>
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
              id="borrowerName"
              label="Borrower Name"
              variant="outlined"
              name="borrowerName"
              value={newBorrow.borrowerName}
              onChange={handleChange}
            />
            <TextField
              id="borrowerMail"
              label="Borrower Email"
              variant="outlined"
              name="borrowerMail"
              value={newBorrow.borrowerMail}
              onChange={handleChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Borrowing Date"
                value={newBorrow.borrowingDate}
                onChange={(newValue) => handleDateChange(newValue, "borrowingDate")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="Return Date"
                value={newBorrow.returnDate}
                onChange={(newValue) => handleDateChange(newValue, "returnDate")}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel id="book-select-label">Select Book</InputLabel>
              <Select
                labelId="book-select-label"
                id="book-select"
                name="bookId"
                value={newBorrow.bookId}
                onChange={handleChange}
                label="Select Book"
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {selectedBorrow ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
