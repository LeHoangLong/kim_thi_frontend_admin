import { useEffect, useState } from "react";
import Services from "../../config/Services";
import myContainer from "../../container";
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { EStatus } from "../../models/StatusModel";
import { loggedIn, loggedOut, fetchingUser } from "../../reducers/UserReducer";
import { IUserRepository } from "../../repositories/IUserRepository";
import Loading from "../components/Loading";
import { LoginPage } from "../pages/LoginPage"
import { Router } from "./Router";

export const UserStateListener = () => {
    const user = useAppSelector(state => state.users.user);
    const dispatch = useAppDispatch();


    let userOperationState = useAppSelector(state => state.users.status);
    let [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function init() {
            dispatch(fetchingUser());
            let userRepository = myContainer.get<IUserRepository>(Services.USER_REPOSITORY);
            let user = await userRepository!.getUser();
            if (user !== null) {
                dispatch(loggedIn(user));
            } else {
                dispatch(loggedOut());
            }
        }
        if (userOperationState.status === EStatus.INIT) {
            init();
        }
        
        if (userOperationState.status === EStatus.IN_PROGRESS || 
            userOperationState.status === EStatus.INIT ) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [userOperationState, dispatch]);

    if (isLoading) {
        return <Loading></Loading>
    } else {
        if (user === null) {
            return <LoginPage/>
        } else {
            return <Router/>
        }
    }
}