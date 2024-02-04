import axios from 'axios'
import { AxiosError } from 'axios'

export const Base_url = localStorage.getItem("serverURL") || 'http://localhost:9283';

export async function get(path: string, config = {}) {
  try {
    const response = await axios.get(Base_url + path, config)
    return response
  }
  catch (error) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      throw new Error("Unknown error")
    }
  }
}

export async function put(path: string, data: any, config = {}) {
  try {
    const response = await axios.put(Base_url + path, data, config)
    return response
  }
  catch (error) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      throw new Error("Unknown error")
    }
  }
}

export async function post(path: string, data: any, config = {}) {
  try {
    const response = await axios.post(Base_url + path, data, config)
    return response
  }
  catch (error) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      throw new Error("Unknown error")
    }
  }
}

export async function del(path: string, config = {}) {
  try {
    const response = await axios.delete(Base_url + path, config)
    return response
  }
  catch (error) {
    if (error instanceof AxiosError) {
      return error.response;
    } else {
      throw new Error("Unknown error")
    }
  }
}
