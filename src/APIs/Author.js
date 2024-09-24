import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAuthors = async () => {
    const { data } = await axios.get(BASE_URL + "/api/v1/authors");
    return data;
  };
  
  export const createAuthor = async (author) => {
    const { data } = await axios.post(
      `${BASE_URL}/api/v1/authors`,
      author
    );
    return data;
  };

  export const deleteAuthor = async (id) => {
    const { data } = await axios.delete(
      `${BASE_URL}/api/v1/authors/${id}`
    );
    return data;
  };
  
  export const updateAuthor = async (author) => {
    const { data } = await axios.put(
      `${BASE_URL}/api/v1/authors/${author.id}`,
      author
    );
    return data;
  };