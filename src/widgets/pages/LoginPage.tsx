import React, { useState } from 'react';
import Services from '../../config/Services';
import { useAppDispatch } from '../../hooks/Hooks';
import { error, loggedIn, loggingIn } from '../../reducers/UserReducer';
import { IUserRepository, IUserRepositoryErrorAuthenticationFailed } from '../../repositories/IUserRepository';
import Locator from '../../services/Locator';
import styles from './LoginPage.module.scss';

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

    return <main className={ styles.login_page }>
        <form className={ styles.login_form }>
            <label htmlFor="username">
                <p className="h4">
                    Username
                </p>
            </label>
            <input value={username} onChange={e => setUsername(e.target.value)} className={`${styles.input} pill border`} id="username">
            </input>
            <label htmlFor="password">
                <p className="h4">
                    Password
                </p>
            </label>
            <input value={password} onChange={e => setPassword(e.target.value)} className={`${styles.input} pill border`} id="password" type="password">
            </input>
            <button className={`${styles.button} primary-button`} onClick={onLoginHandler}>
                Log in
            </button>
        </form>
    </main>
}