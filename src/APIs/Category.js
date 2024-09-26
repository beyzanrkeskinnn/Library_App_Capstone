import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getCategories = async () => {
    const { data } = await axios.get(BASE_URL + "/api/v1/categories");
    return data;
  };
  
  export const createCategory = async (category) => {
    const { data } = await axios.post(
      `${BASE_URL}/api/v1/categories`,
      category
    );
    return data;
  };

  export const deleteCategory = async (id) => {
    const { data } = await axios.delete(
      `${BASE_URL}/api/v1/categories/${id}`
    );
    return data;
  };
  
 
  export const updateCategory = async (category) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/v1/categories/${category.id}`, category);
      return response.data;
    } catch (error) {
      // Hata mesajını ayrıntılı şekilde logla
      console.error("Error updating category:", error.response?.data || error.message);
      throw error;
    }
  };
  