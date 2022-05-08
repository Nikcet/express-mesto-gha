import logo from '../images/logo.svg';

function Header(props) {
  return (
    <header className="header">
      <a href="./index.html" className="header__logo-link">
        <img src={logo} alt="#" className="header__logo" />
      </a>
      <div className="header__account-wrap">
        {props.loggedIn && <p className='header__email'>{props.email}</p>}
        <button type="button" className="header__btn-logout" onClick={props.onClick}>{props.loggedIn ? 'Выйти' : props.isLoginNow ? 'Регистрация' : 'Войти'}</button>
      </div>
    </header>
  );
}

export default Header;