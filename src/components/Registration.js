import React from "react";
import { Link } from 'react-router-dom';

export default function Registration(props) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        target.name === 'email-input' ? setEmail(value) : setPassword(value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        props.onRegister({
            email,
            password,
        });
    }

    React.useEffect(() => {
        props.onLoad(false);
    }, [])

    return (
        <div className="login">
            <div className="login__wrapper">
                <h2 className="login__header">Регистрация</h2>
                <form
                    className="login__form"
                    name="login"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="email"
                        id="input-email"
                        className="login__input login__input-email"
                        placeholder="Email"
                        name="email-input"
                        required
                        onChange={handleChange}
                        value={email}
                    />
                    <input
                        type="password"
                        id="input-password"
                        className="login__input login__input-password"
                        placeholder="Пароль"
                        name="password-input"
                        required
                        onChange={handleChange}
                        value={password}
                    />
                    <button
                        type="submit"
                        className="login__button"
                    >Зарегистрироваться</button>
                    <p className="login__question">Уже зарегистрированы? <Link to="/sign-in" className="login__link">Войти</Link></p>
                </form>
            </div>
        </div>
    )
}