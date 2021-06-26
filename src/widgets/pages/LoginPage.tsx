import React, { useState } from 'react';
import Services from '../../config/Services';
import { useAppDispatch } from '../../hooks/Hooks';
import { error, loggedIn, loggingIn } from '../../reducers/UserReducer';
import { IUserRepository, IUserRepositoryErrorAuthenticationFailed } from '../../repositories/IUserRepository';
import Locator from '../../services/Locator';
import './LoginPage.scss';

export const LoginPage = () => {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    let dispatch = useAppDispatch();
    let userRepository = Locator.get<IUserRepository>(Services.USER_REPOSITORY);
    async function onLoginHandler() {
        dispatch(loggingIn());
        try {
            let user = await userRepository!.logIn(username, password);
            dispatch(loggedIn(user)); 
        } catch (exception) {
            if (exception instanceof IUserRepositoryErrorAuthenticationFailed) {
                dispatch(error("Mật khẩu hoặc tên đăng nhập không đúng"));
            } else {
                throw exception;
            }
        }
        
    }

    return <main className="login-page">
        <form className="login-form">
            <label htmlFor="username">
                <h4>
                    Username
                </h4>
            </label>
            <input value={username} onChange={e => setUsername(e.target.value)} className="pill border" id="username">
            </input>
            <label htmlFor="password">
                <h4>
                    Password
                </h4>
            </label>
            <input value={password} onChange={e => setPassword(e.target.value)} className="pill border" id="password" type="password">
            </input>
            <button className="primary-button" onClick={onLoginHandler}>
                Log in
            </button>
        </form>
    </main>
}