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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../APIs/Category";

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
  const handleAxiosError = (error) => {
    let errorMessage = "An error occurred.";
    if (error.response?.data?.data) {
      errorMessage = error.response.data.data[0];
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    setNotification({ message: errorMessage, severity: "error" });
    setTimeout(() => {
      setNotification({ message: "", severity: "" });
    }, 3000);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...newCategory,
      };

      if (editingCategoryId) {
        await updateCategory({ id: editingCategoryId, ...dataToSend });
        setEditingCategoryId(null);
      } else {
        await createCategory(dataToSend);
      }

      setNewCategory({
        name: "",
        description: "",
      });

      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);

        setNotification({
          message: "Category deleted successfully!",
          severity: "success",
        });
        setTimeout(() => {
          setNotification({ message: "", severity: "" });
        }, 3000);

        const updatedCategories = await getCategories();
        setCategories(updatedCategories);
      } catch (error) {
        handleAxiosError(error);
      }
    }
  };

  const filteredCategories = categories.filter((category) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchValue) ||
      category.description.toLowerCase().includes(searchValue)
    );
  });

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
              />

              <TextField
                id="description"
                label="Description"
                variant="outlined"
                name="description"
                value={newCategory.description}
                onChange={handleChange}
              />
              <Button type="submit" variant="contained" color="primary">
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
                          onClick={() => handleDelete(category.id)}
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
            rowsPerPageOptions={[10, 25, 50]}
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
    </Container>
  );
}
