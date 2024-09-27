import { 
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
import { getPublishers, createPublisher, deletePublisher, updatePublisher } from "../../APIs/Publisher";
import { parseISO } from "date-fns";

// Stil kodları
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: '#d47a33',
    color: theme.palette.common.white,
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function Publisher() {
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState({
    name: "",
    establishmentYear: null,
    address: "",
  });
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    severity: "",
  });
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPublisher({
      ...newPublisher,
      [name]: value,
    });
  };

  const handleDateChange = (newValue) => {
    setNewPublisher({
      ...newPublisher,
      establishmentYear: newValue,
    });
  };

  const handleEdit = (publisher) => {
    if (publisher.id) {
      setEditingPublisher(publisher.id);
      setNewPublisher({
        name: publisher.name,
        establishmentYear: parseISO(`${publisher.establishmentYear}-01-01`),
        address: publisher.address,
      });
    } else {
      console.error("Invalid publisher ID");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...newPublisher,
        establishmentYear: newPublisher.establishmentYear
          ? newPublisher.establishmentYear.getFullYear()
          : null,
      };

      if (editingPublisher) {
        await updatePublisher({ id: editingPublisher, ...dataToSend });
        setEditingPublisher(null);
      } else {
        await createPublisher(dataToSend);
      }

      setNewPublisher({
        name: "",
        establishmentYear: null,
        address: "",
      });

      const data = await getPublishers();
      setPublishers(data);

      setNotification({
        message: `Publisher ${editingPublisher ? 'updated' : 'added'} successfully!`,
        severity: "success",
      });
      setTimeout(() => {
        setNotification({ message: "", severity: "" });
      }, 3000);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleClear = () => {
    setNewPublisher({
      name: "",
      establishmentYear: null,
      address: "",
    });
    setEditingPublisher(null);
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
    setErrorMessage(errorMessage);
    setErrorDialogOpen(true);
  };

  const handleDelete = async (publisherId) => {
    if (window.confirm("Are you sure you want to delete this publisher?")) {
      try {
        await deletePublisher(publisherId);

        setNotification({
          message: "Publisher deleted successfully!",
          severity: "success",
        });
        setTimeout(() => {
          setNotification({ message: "", severity: "" });
        }, 3000);

        const updatedPublishers = await getPublishers();
        setPublishers(updatedPublishers);
      } catch (error) {
        handleAxiosError(error);
      }
    }
  };

  const filteredPublishers = publishers.filter((publisher) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      publisher.name.toLowerCase().includes(searchValue) ||
      publisher.address.toLowerCase().includes(searchValue) ||
      publisher.establishmentYear.toString().includes(searchValue)
    );
  });

  useEffect(() => {
    getPublishers().then((data) => {
      setPublishers(data);
    });
  }, []);

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
        Publishers
      </Typography>
      <div className="p-search">
        <Typography variant="body2" pb={2} textAlign={"center"}>
          Our publishers whose works shed light on the future.
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
      </div>
      <div className="article">
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
                id="name"
                label="Name"
                variant="outlined"
                name="name"
                value={newPublisher.name}
                onChange={handleChange}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Establishment Year"
                  views={["year"]}
                  value={newPublisher.establishmentYear}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <TextField
                id="address"
                label="Address"
                variant="outlined"
                name="address"
                value={newPublisher.address}
                onChange={handleChange}
              />
              <Button type="submit" variant="contained" color="primary">
                {editingPublisher ? "Update Publisher" : "Add Publisher"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleClear}
                sx={{ mt: 2 }}
              >
                Clear
              </Button>
            </Box>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Establishment Year</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPublishers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((publisher) => (
                <StyledTableRow key={publisher.id}>
                  <StyledTableCell>{publisher.name}</StyledTableCell>
                  <StyledTableCell>{publisher.establishmentYear}</StyledTableCell>
                  <StyledTableCell>{publisher.address}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(publisher)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(publisher.id)}
                      startIcon={<DeleteIcon />}
                      sx={{ ml: 2 }}
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredPublishers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={Boolean(notification.message)}
        autoHideDuration={6000}
        onClose={() => setNotification({ message: "", severity: "" })}
        message={notification.message}
        severity={notification.severity}
      />

      {/* Error Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>{errorMessage}</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
