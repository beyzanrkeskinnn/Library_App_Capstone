import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getBorrows = async () => {
    const { data } = await axios.get(BASE_URL + "/api/v1/borrows");
    return data;
  };
  
  export const createBorrow = async (borrow) => {
    const { data } = await axios.post(
      `${BASE_URL}/api/v1/borrows`,
      borrow
    );
    return data;
  };

  export const deleteBorrow = async (id) => {
    const { data } = await axios.delete(
      `${BASE_URL}/api/v1/borrows/${id}`
    );
    return data;
  };
  
  export const updateBorrow = async (borrow) => {
    const { data } = await axios.put(
      `${BASE_URL}/api/v1/borrows/${borrow.id}`,
      borrow
    );
    return data;
  };

  export const getBooks = async () => {
   
      const { data } = await axios.get(`${BASE_URL}/api/v1/books`);
      return data;

  };