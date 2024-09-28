import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//This function gets all the publishers from the database.
export const getPublishers = async () => {
  const { data } = await axios.get(BASE_URL + "/api/v1/publishers");
  return data;
};

//This function creates a publisher in the database.
export const createPublisher = async (publisher) => {
  const { data } = await axios.post(`${BASE_URL}/api/v1/publishers`, publisher);
  return data;
};

//This function deletes an Publisher from the database.
export const deletePublisher = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/api/v1/publishers/${id}`);
  return data;
};

//This function updates a publisher in the database.
export const updatePublisher = async (publisher) => {
  const { data } = await axios.put(
    `${BASE_URL}/api/v1/publishers/${publisher.id}`,
    publisher
  );
  return data;
};
