import axios, { AxiosError } from "axios";
import { injectable } from "inversify";
import { HOST_URL } from "../config/Url";
import { UserModel } from "../models/UserModel";
import { IUserRepository, IUserRepositoryErrorAuthenticationFailed } from "./IUserRepository";

@injectable()
export class RemoteUserRepository implements IUserRepository {
    async logIn(username: string, password: string): Promise<UserModel> {
        try {
            await axios.post(`${HOST_URL}/user/login/`, {
                'username': username,
                'password': password,
            });
            return {
                username: username,
            }
        } catch (exception) {
            let axioException = exception as AxiosError
            if (axioException.response?.status === 404) {
                throw new IUserRepositoryErrorAuthenticationFailed();
            } else {
                throw axioException.response?.statusText;
            }
        }
    }

    async getUser(): Promise<UserModel | null> {
        try {
            let result = await axios.get(`${HOST_URL}/user/`);
            if (result.status === 200) {
                return {
                    username: result.data.username,
                };
            } else {
                return null;
            }
        } catch (exception) {
            return null;
        }
    }
}