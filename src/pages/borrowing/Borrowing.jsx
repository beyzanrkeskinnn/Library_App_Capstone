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
  Alert,
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

const getStatusColor = (returnDate) => {
  const today = new Date();
  if (!returnDate) return "red";
  return new Date(returnDate) <= today ? "green" : "orange";
};

export default function Borrowing() {
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
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleDateChange = (date, fieldName) => {
    setNewBorrow((prevState) => ({
      ...prevState,
      [fieldName]: date,
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
        await updateBorrow(selectedBorrow.id, dataToSend);
        handleSuccessfulResponse("Borrow record updated successfully!", "success");
      } else {
        await createBorrow(dataToSend);
        handleSuccessfulResponse("Borrow record created successfully!", "success");
      }
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

  const handleClear = () => {
    setNewBorrow({
      borrowerName: "",
      borrowerMail: "",
      borrowingDate: null,
      returnDate: null,
      bookId: "",
    });
    setSelectedBorrow(null);
  };

  const handleAxiosError = (error) => {
    let errorMessage = "An error occurred.";
    if (error.response) {
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data?.data) {
        errorMessage = error.response.data.data[0] || "An error occurred.";
      } else {
        errorMessage = error.message;
      }
    } else {
      errorMessage = error.message;
    }
    console.error("Error details:", error);
    setErrorMessage(errorMessage);
    setOpenErrorDialog(true);
  };

  const handleSuccessfulResponse = (message, severity) => {
    setNotification({ message, severity });
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
    setSelectedBorrow(borrow);
    setNewBorrow({
      borrowerName: borrow.borrowerName,
      borrowerMail: borrow.borrowerMail,
      borrowingDate: parseISO(borrow.borrowingDate),
      returnDate: borrow.returnDate ? parseISO(borrow.returnDate) : null,
      bookId: borrow.book?.id || "",
    });
  };

  const filteredBorrows = borrows.filter((borrow) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      borrow.borrowerName.toLowerCase().includes(searchValue) ||
      (borrow.borrowerMail && borrow.borrowerMail.toLowerCase().includes(searchValue)) ||
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
            onChange={(date) => handleDateChange(date, "borrowingDate")}
            renderInput={(params) => <TextField {...params} />}
          />
          {selectedBorrow && (
            <DatePicker
              label="Return Date"
              value={newBorrow.returnDate}
              onChange={(date) => handleDateChange(date, "returnDate")}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        </LocalizationProvider>
        <FormControl fullWidth>
          <InputLabel id="bookId-label">Select Book</InputLabel>
          <Select
            labelId="bookId-label"
            id="bookId"
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {selectedBorrow ? "Update Borrow" : "Add Borrow"}
          </Button>
          <Button type="button" variant="outlined" color="secondary" onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Borrower Name</StyledTableCell>
              <StyledTableCell>Borrowing Date</StyledTableCell>
              <StyledTableCell>Return Date</StyledTableCell>
              <StyledTableCell>Book</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBorrows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((borrow) => {
              const statusColor = getStatusColor(borrow.returnDate);
              const statusText = borrow.returnDate ? "Returned" : "Not Returned";

              return (
                <StyledTableRow key={borrow.id}>
                  <StyledTableCell>{borrow.borrowerName}</StyledTableCell>
                  <StyledTableCell>
                    {borrow.borrowingDate && format(parseISO(borrow.borrowingDate), "dd MMM yyyy")}
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: statusColor }}>
                    {borrow.returnDate ? format(parseISO(borrow.returnDate), "dd MMM yyyy") : "Not returned"}
                  </StyledTableCell>
                  <StyledTableCell>{borrow.book?.name || "Unknown"}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      onClick={() => handleEdit(borrow)}
                      startIcon={<EditIcon />}
                      color="primary"
                      variant="outlined"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(borrow.id)}
                      startIcon={<DeleteIcon />}
                      color="secondary"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 1,
                        color: statusColor,
                        fontWeight: 'bold',
                      }}
                    >
                      {statusText}
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredBorrows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      </TableContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={openErrorDialog}
        onClose={() => setOpenErrorDialog(false)}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
