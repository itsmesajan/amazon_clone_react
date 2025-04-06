import axios from "axios";

const instance = axios.create({
  // THE API (cloud function) URL
  baseURL:'http://127.0.0.1:5001/challenge-7b8e1/us-central1/api' // THE APO cloud fun url
});

export default instance;