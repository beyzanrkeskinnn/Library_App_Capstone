import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getPublishers = async () => {
    const { data } = await axios.get(BASE_URL + "/api/v1/publishers");
    return data;
  };
  
  export const createPublisher = async (publisher) => {
    const { data } = await axios.post(
      `${BASE_URL}/api/v1/publishers`,
      publisher
    );
    return data;
  };

  export const deletePublisher = async (id) => {
    const { data } = await axios.delete(
      `${BASE_URL}/api/v1/publishers/${id}`
    );
    return data;
  };
  
  export const updatePublisher = async (publisher) => {
    const { data } = await axios.put(
      `${BASE_URL}/api/v1/publishers/${publisher.id}`,
      publisher
    );
    return data;
  };