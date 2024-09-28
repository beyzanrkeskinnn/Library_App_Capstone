import "./Author.css";
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
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  getAuthors,
  createAuthor,
  deleteAuthor,
  updateAuthor,
} from "../../APIs/Author";
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

const StyledSearchField = styled(TextField)(() => ({
  width: "300px",
  "& .MuiInputBase-root": {
    height: "40px",
  },
  "& .MuiInputBase-input": {
    padding: "10px",
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

const StickyPagination = styled(TablePagination)(({ theme }) => ({
  position: "sticky",
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: theme.zIndex.appBar,
}));

export default function Author() {
  const [authors, setAuthors] = useState([]);
  const [cities, setCities] = useState([]);
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    birthDate: null,
    country: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [notification, setNotification] = useState({
    message: "",
    severity: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetches authors when the component mounts
  useEffect(() => {
    getAuthors().then((data) => {
      setAuthors(data);
    });

    setCities([
      "TACİKİSTAN",
      "TANZANYA",
      "TAYLAND",
      "TAYVAN (Chinese Taipei)",
      "TOGO",
      "TONGA",
      "TURKEY",
    ]);
  }, []);

  // Handles changes in the new author form fields
  const handleNewAuthor = (event) => {
    setNewAuthor({
      ...newAuthor,
      [event.target.name]: event.target.value,
    });
  };

  // Handles search input changes and resets the page number
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Filters authors based on the search term
  const filteredAuthors = authors.filter((author) => {
    return (
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handles the deletion of an author
  const handleDelete = async () => {
    try {
      if (authorToDelete) {
        await deleteAuthor(authorToDelete.id);
        const data = await getAuthors();
        setAuthors(data);
        handleSuccessfulResponse("Author deleted successfully.", "success");
        setOpenDeleteDialog(false);
      }
    } catch (error) {
      handleAxiosError(error);
      setOpenDeleteDialog(false);
    }
  };

  // Function to select the author to update and create
  const handleCreateOrUpdate = async () => {
    if (editMode && !selectedAuthorId) {
      console.error("Cannot update: No author selected");
      return;
    }

    const authorData = { ...newAuthor, birthDate: selectedDate };

    try {
      if (editMode) {
        await updateAuthor({ id: selectedAuthorId, ...authorData });
        setEditMode(false);
      } else {
        await createAuthor(authorData);
      }
      setNewAuthor({ name: "", birthDate: null, country: "" });
      setSelectedDate(null);
      const data = await getAuthors();
      setAuthors(data);
      handleSuccessfulResponse(
        editMode
          ? "Author updated successfully."
          : "Author added successfully.",
        "success"
      );
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // Sets the author details for editing
  const handleEdit = (author) => {
    setEditMode(true);
    setSelectedAuthorId(author.id);
    setNewAuthor({
      name: author.name,
      birthDate: author.birthDate,
      country: author.country,
    });
    setSelectedDate(parseISO(author.birthDate));
  };

  // Handles error responses from Axios requests
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
    setErrorMessage(errorMessage);
    setOpenErrorDialog(true);
  };

  // Displays success notifications
  const handleSuccessfulResponse = (message, severity) => {
    setNotification({ message: message, severity: severity });
    setTimeout(() => {
      setNotification({ message: "", severity: "" });
    }, 3000);
  };

  // Handles page change for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handles changes in rows per page for pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Opens confirmation dialog to delete an author
  const openConfirmDeleteDialog = (author) => {
    setAuthorToDelete(author);
    setOpenDeleteDialog(true);
  };

  // Clears the form inputs
  const handleClear = () => {
    setNewAuthor({ name: "", birthDate: null, country: "" });
    setSelectedDate(null);
    setEditMode(false);
    setSelectedAuthorId(null);
  };

  return (
    <>
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
          Authors
        </Typography>
        <div className="p-search">
          <Typography variant="body2" pb={2} textAlign={"center"}>
            Our writers whose works shed light on the future.
          </Typography>
          {/* Search Box */}
          <StyledSearchField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="author-section">
          <Box mb={2} border={"2px solid #4caf50"} p={5}>
            <Typography variant="h5" align="center">
              {editMode ? "Update Author" : "Add Author"}
            </Typography>
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
              >
                <TextField
                  label="Name"
                  name="name"
                  variant="outlined"
                  value={newAuthor.name}
                  onChange={handleNewAuthor}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Birth Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    label="Country"
                    name="country"
                    value={newAuthor.country}
                    onChange={handleNewAuthor}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateOrUpdate}
                  >
                    {editMode ? "Update Author" : "Add Author"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </FormControl>
          </Box>
          <TableContainer component={Paper} sx={{ maxHeight: "400px", mt: 2 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Birth Date</StyledTableCell>
                  <StyledTableCell>Country</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAuthors
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((author) => (
                    <StyledTableRow key={author.id}>
                      <TableCell>{author.name}</TableCell>
                      <TableCell>
                        {format(parseISO(author.birthDate), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell>{author.country}</TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(author)}
                        ></Button>
                        <Button
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => openConfirmDeleteDialog(author)}
                        ></Button>
                      </TableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
            <StickyPagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredAuthors.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </Container>
      {/* Error Dialog */}
      <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this author?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Notification Snackbar */}
      <Snackbar
        open={notification.message.length > 0}
        autoHideDuration={6000}
        onClose={() => setNotification({ message: "", severity: "" })}
        message={notification.message}
        action={
          <Button
            color="inherit"
            onClick={() => setNotification({ message: "", severity: "" })}
          >
            Close
          </Button>
        }
        severity={notification.severity}
      />
    </>
  );
}
