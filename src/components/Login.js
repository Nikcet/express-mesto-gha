import React from "react";
import { Link } from "react-router-dom";

export default function Login(props) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        target.name === 'email-input' ? setEmail(value) : setPassword(value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        props.onLogin({
            email,
            password,
        });
    }

    React.useEffect(() => {
        props.onLoad(true);
    }, [])

    return (
        <div className="login">
            <div className="login__wrapper">
                <h2 className="login__header">Вход</h2>
                <form className="login__form" name="login" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="input-email"
                        className="login__input login__input-email"
                        placeholder="Email"
                        name="email-input"
                        onChange={handleChange}
                        value={email}
                        required
                    />
                    <input
                        type="password"
                        id="input-password"
                        className="login__input login__input-password"
                        placeholder="Пароль"
                        name="password-input"
                        onChange={handleChange}
                        value={password}
                        required
                    />
                    <button type="submit" className="login__button">Войти</button>
                    <p className="login__question">Еще не зарегистрировались? <Link to="/sign-up" className="login__link">Зарегистрироваться</Link></p>
                </form>
            </div>
        </div>
    )
}