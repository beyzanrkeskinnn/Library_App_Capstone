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
const StyledSearchField = styled(TextField)({
  width: "300px",
  "& .MuiInputBase-root": {
    height: "40px",
  },
  "& .MuiInputBase-input": {
    padding: "10px",
  },
});

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
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    getAuthors().then((data) => {
      setAuthors(data);
    });

    setCities([
      "Istanbul",
      "Ankara",
      "Izmir",
      "Bursa",
      "Antalya",
      "Adana",
      "Konya",
      "Gaziantep",
      "Mersin",
      "Diyarbakir",
    ]);
  }, []);

  const handleNewAuthor = (event) => {
    setNewAuthor({
      ...newAuthor,
      [event.target.name]: event.target.value,
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page when search term changes
  };

  const filteredAuthors = authors.filter((author) => {
    return (
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (id) => {
    try {
      await deleteAuthor(id);
      const data = await getAuthors();
      setAuthors(data);
      handleSuccessfulResponse("Author deleted successfully.", "success");
    } catch (error) {
      handleAxiosError(error);
    }
  };

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
    } catch (error) {
      handleAxiosError(error);
    }
  };

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

  const handleAxiosError = (error) => {
    let errorMessage = "An error occurred.";
    if (error.response.data.data) {
      errorMessage = error.response.data.data[0];
    } else if (error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    setNotification({ message: errorMessage, severity: "error" });
    setTimeout(() => {
      setNotification({ message: "", severity: "" });
    }, 3000);
  };

  const handleSuccessfulResponse = (message, severity) => {
    setNotification({ message: message, severity: severity });
    setTimeout(() => {
      setNotification({ message: "", severity: "" });
    }, 3000);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
                  id="name"
                  label="Name"
                  variant="outlined"
                  value={newAuthor.name}
                  onChange={handleNewAuthor}
                  name="name"
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="BirthDate"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    slots={{
                      textField: (params) => <TextField {...params} />,
                    }}
                  />
                </LocalizationProvider>

                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={newAuthor.country}
                    onChange={handleNewAuthor}
                    name="country"
                    label="Country"
                  >
                    {cities.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: "#4CAF50" }}
                  onClick={handleCreateOrUpdate}
                >
                  {editMode ? "Update" : "Add"}
                </Button>
              </Box>
            </FormControl>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Birthdate</StyledTableCell>
                  <StyledTableCell align="right">Country</StyledTableCell>
                  <StyledTableCell align="right">Edit / Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAuthors.length > 0 ? (
                  filteredAuthors
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((author) => (
                      <StyledTableRow key={author.id}>
                        <StyledTableCell component="th" scope="row">
                          {author.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {author.birthDate
                            ? format(parseISO(author.birthDate), "dd/MM/yyyy")
                            : ""}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {author.country}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <EditIcon onClick={() => handleEdit(author)} />
                          <DeleteIcon onClick={() => handleDelete(author.id)} />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={4} align="center">
                      No data available
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>

            <StickyPagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredAuthors.length} // Use filtered count
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </Container>
    </>
  );
}
