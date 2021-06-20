import { UserModel } from "../models/UserModel";

export class IUserRepositoryErrorAuthenticationFailed {

};

export interface IUserRepository {
    logIn(username: string, password: string): Promise<UserModel>;
    getUser(): Promise<UserModel | null>;
}