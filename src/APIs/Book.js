import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//This function gets all the books from the database.
export const getBooks = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/v1/books`);
    return data;
  } catch (error) {
    console.error("Books verileri alınırken bir hata oluştu:", error);
    throw error;
  }
};

//This function creates a book in the database.
export const createBook = async (book) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/api/v1/books`, book);
    return data;
  } catch (error) {
    console.error("Kitap oluşturulurken bir hata oluştu:", error);
    throw error;
  }
};

//This function deletes an book from the database.
export const deleteBook = async (id) => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/api/v1/books/${id}`);
    return data;
  } catch (error) {
    console.error("Kitap silinirken bir hata oluştu:", error);
    throw error;
  }
};

//This function gets all the authors from the database.
export const getAuthors = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/v1/authors`);
    return data;
  } catch (error) {
    console.error("Yazar verileri alınırken bir hata oluştu:", error);
    throw error;
  }
};

//This function gets all the publishers from the database.
export const getPublishers = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/v1/publishers`);
    return data;
  } catch (error) {
    console.error("Yayınevi verileri alınırken bir hata oluştu:", error);
    throw error;
  }
};

//This function gets all the categories from the database.
export const getCategories = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/v1/categories`);
    return data;
  } catch (error) {
    console.error("Kategori verileri alınırken bir hata oluştu:", error);
    throw error;
  }
};

export const addBook = async (bookData) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/api/v1/books`, bookData);
    return data;
  } catch (error) {
    console.error("Kitap eklenirken bir hata oluştu:", error);
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/v1/books/${id}`);
    return data;
  } catch (error) {
    console.error("Kitap verileri alınırken bir hata oluştu:", error);
    throw error;
  }
};

//This function updates a book in the database.
export const updateBook = async (id, bookData) => {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/api/v1/books/${id}`,
      bookData
    );
    return data;
  } catch (error) {
    console.error("Kitap güncellenirken bir hata oluştu:", error);
    throw error;
  }
};
