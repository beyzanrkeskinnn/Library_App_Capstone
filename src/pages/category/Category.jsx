import "./Category.css";
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
  Snackbar,
  Modal,
  Fade,
  Backdrop,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../APIs/Category";

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

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    severity: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle error from API requests and show relevant notification
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
    setNotification({ message: errorMessage, severity: "error" });
  };

  // Handle input changes in the category form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
  };

  // Handle editing of a category
  const handleEdit = (category) => {
    if (category.id) {
      setEditingCategoryId(category.id);
      setNewCategory({
        name: category.name,
        description: category.description,
      });
    } else {
      console.error("Invalid category ID");
    }
  };

  // Handle form submission for creating or updating a category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        name: newCategory.name,
        description: newCategory.description,
      };

      if (editingCategoryId) {
        await updateCategory({ id: editingCategoryId, ...dataToSend });
        setNotification({
          message: "Category updated successfully!",
          severity: "success",
        });
        setEditingCategoryId(null);
      } else {
        await createCategory(dataToSend);
        setNotification({
          message: "Category added successfully!",
          severity: "success",
        });
      }

      setNewCategory({
        name: "",
        description: "",
      });

      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the deletion of a category
  const handleDelete = useCallback(async () => {
    if (!deleteCategoryId) return;

    try {
      setLoading(true);
      const response = await deleteCategory(deleteCategoryId);

      // Hata mesajını yanıt içeriğinden kontrol et
      if (response.data && response.data.message) {
        setNotification({
          message: response.data.message,
          severity: "error",
        });
      } else {
        setNotification({
          message: "Kategori başarıyla silindi!",
          severity: "success",
        });
      }

      setModalOpen(false);
      setDeleteCategoryId(null);

      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
    } catch (error) {
      handleAxiosError(error);
      setModalOpen(false);
      setDeleteCategoryId(null);
    } finally {
      setLoading(false);
    }
  }, [deleteCategoryId]);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchValue) ||
      category.description.toLowerCase().includes(searchValue)
    );
  });

  // Fetch categories on component mount
  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
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
        Categories
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
                value={newCategory.name}
                onChange={handleChange}
                required
              />
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                name="description"
                value={newCategory.description}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {editingCategoryId ? "Update Category" : "Add Category"}
              </Button>
            </Box>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="right">Description</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category) => (
                    <StyledTableRow key={category.id}>
                      <StyledTableCell component="th" scope="row">
                        {category.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {category.description}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <EditIcon
                          onClick={() => handleEdit(category)}
                          style={{ cursor: "pointer" }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            setDeleteCategoryId(category.id);
                            setModalOpen(true);
                          }}
                          style={{ cursor: "pointer" }}
                        />
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
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredCategories.length}
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Are you sure you want to delete the category?
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                pt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Is being deleted..." : "Delete"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setModalOpen(false)}
                sx={{ ml: 2 }}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={Boolean(notification.message)}
        autoHideDuration={6000}
        onClose={() => setNotification({ message: "", severity: "" })}
      >
        <Alert
          onClose={() => setNotification({ message: "", severity: "" })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
