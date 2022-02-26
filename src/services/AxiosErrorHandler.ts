import axios, { AxiosError } from "axios";

export async function transaction(
    callback: () => Promise<void>,
) : Promise<void> {
    try {
        await callback();
    } catch(exception) {
        if (axios.isAxiosError(exception)) {
            let axiosError = exception as AxiosError
            throw axiosError.response?.statusText
        } else {
            throw exception
        }
    }
}