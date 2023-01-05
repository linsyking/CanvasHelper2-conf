import axios from 'axios'
import {AxiosError} from 'axios'

const Base_url = 'http://192.168.1.12:9283'

export async function get(path:string) {
    try {
        const response = await axios.get(Base_url + path)
        return response
    }
    catch (error) {
        if (error instanceof AxiosError) {
            return error.response;
        }else{
            throw new Error("Unknown error")
        }
    }
}

export async function put(path:string, data: any) {
    try {
        const response = await axios.put(Base_url + path, data)
        return response
    }
    catch (error) {
        if (error instanceof AxiosError) {
            return error.response;
        }else{
            throw new Error("Unknown error")
        }
    }
}

export async function post(path:string, data: any) {
    try {
        const response = await axios.post(Base_url + path, data)
        return response
    }
    catch (error) {
        if (error instanceof AxiosError) {
            return error.response;
        }else{
            throw new Error("Unknown error")
        }
    }
}

export async function del(path:string) {
    try {
        const response = await axios.delete(Base_url + path)
        return response
    }
    catch (error) {
        if (error instanceof AxiosError) {
            return error.response;
        }else{
            throw new Error("Unknown error")
        }
    }
}
