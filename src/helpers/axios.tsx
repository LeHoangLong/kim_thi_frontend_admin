import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export async function axiosGet<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig) : Promise<R> {
    try {
        return await axios.get(url, config)
    } catch (error) {
        let axiosError = error as AxiosError
        throw axiosError.message
    }
}

export  async function axiosPost<T = any, R = AxiosResponse<T>> (url: string, data?: any, config?: AxiosRequestConfig) : Promise<R> {
    try {
        return await axios.post(url, data, config)
    } catch (error) {
        let axiosError = error as AxiosError
        throw axiosError.message
    }
}

export async function axiosPut<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    try {
        return await axios.put(url, data, config)
    } catch (error) {
        let axiosError = error as AxiosError
        throw axiosError.message
    }
}

export async function axiosDelete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    try {
        return await axios.delete(url, config)
    } catch (error) {
        let axiosError = error as AxiosError
        throw axiosError.message
    }
}
  

  