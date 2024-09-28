import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//This function gets all the categories from the database.
export const getCategories = async () => {
  const { data } = await axios.get(BASE_URL + "/api/v1/categories");
  return data;
};

//This function creates a category in the database.
export const createCategory = async (category) => {
  const { data } = await axios.post(`${BASE_URL}/api/v1/categories`, category);
  return data;
};

//This function deletes an category from the database.
export const deleteCategory = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/api/v1/categories/${id}`);
  return data;
};

//This function updates a category in the database.
export const updateCategory = async (category) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/v1/categories/${category.id}`,
      category
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating category:",
      error.response?.data || error.message
    );
    throw error;
  }
};
