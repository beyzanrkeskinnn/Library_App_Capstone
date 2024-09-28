import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//This function gets all the borrows from the database.
export const getBorrows = async () => {
  const { data } = await axios.get(BASE_URL + "/api/v1/borrows");
  return data;
};

//This function creates a borrow in the database.
export const createBorrow = async (borrow) => {
  const { data } = await axios.post(`${BASE_URL}/api/v1/borrows`, borrow);
  return data;
};

//This function deletes an borrowing from the database.
export const deleteBorrow = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/api/v1/borrows/${id}`);
  return data;
};

//This function updates a borrow in the database.
export const updateBorrow = async (id, borrow) => {
  const { data } = await axios.put(`${BASE_URL}/api/v1/borrows/${id}`, borrow);
  return data;
};

//This function gets all the books from the database.
export const getBooks = async () => {
  const { data } = await axios.get(`${BASE_URL}/api/v1/books`);
  return data;
};
