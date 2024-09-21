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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getAuthors, createAuthor } from "../../APIs/Author";

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

export default function Author() {
  const [authors, setAuthors] = useState([]);

  const [cities, setCities] = useState([]); // Şehirleri saklamak için
  const [newAuthor, setNewAuthor] = useState({
    name: "",
    birthDate: "",
    country: "",
  });

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

  const handleCreate = async () => {
    try {
      // Doğrudan DatePicker'den dönen string formatını kullan
      await createAuthor({ ...newAuthor, birthDate: selectedDate });
      // Form alanlarını sıfırla
      setNewAuthor({ name: "", birthDate: "", country: "" });
      // Yazarlar listesini güncelle
      const data = await getAuthors();
      setAuthors(data);
    } catch (error) {
      console.error("Failed to create author:", error);
    }
  };
  const [selectedDate, setSelectedDate] = useState(null);

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

        <Typography variant="body2" pb={2} textAlign={"center"}>
          Our writers whose works shed light on the future.
        </Typography>

        <div className="author-section">
          <Box mb={2} border={"2px solid #4caf50"} p={5}>
            <Typography variant="h5" align="center">
              Add Author
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
                  onClick={handleCreate}
                >
                  Add
                </Button>
              </Box>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell align="right">Birthdate</StyledTableCell>
                  <StyledTableCell align="right">Country</StyledTableCell>
                  <StyledTableCell align="right">Edit / Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(authors) && authors.length > 0 ? (
                  authors.map((author) => (
                    <StyledTableRow key={author.id}>
                      <StyledTableCell component="th" scope="row">
                        {author.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {author.birthDate}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {author.country}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <EditIcon /> <DeleteIcon />
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
          </TableContainer>
        </div>
      </Container>
    </>
  );
}
