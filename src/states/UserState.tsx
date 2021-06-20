import { StatusModel } from "../models/StatusModel";
import { UserModel } from "../models/UserModel";

export interface UserState {
    readonly status: StatusModel,
    readonly user: UserModel | null,
}