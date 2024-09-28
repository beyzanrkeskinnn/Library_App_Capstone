import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//This function gets all the authors from the database.
export const getAuthors = async () => {
  const { data } = await axios.get(BASE_URL + "/api/v1/authors");
  return data;
};

//This function creates a author in the database.
export const createAuthor = async (author) => {
  const { data } = await axios.post(`${BASE_URL}/api/v1/authors`, author);
  return data;
};

//This function deletes an author from the database.
export const deleteAuthor = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/api/v1/authors/${id}`);
  return data;
};

//This function updates a author in the database.
export const updateAuthor = async (author) => {
  const { data } = await axios.put(
    `${BASE_URL}/api/v1/authors/${author.id}`,
    author
  );
  return data;
};
