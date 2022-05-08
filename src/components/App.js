import React from "react";
import "../index.css";
import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CardsContext } from "../contexts/CardsContext";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Loading from "../utils/Loading";
import Login from "./Login";
import Registration from "./Registration";
import InfoTooltip from "./InfoTooltip";
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import * as auth from '../utils/Auth';

export function App() {
  const defaultUser = {
    _id: '',
    about: '',
    avatar: '',
    cohort: '',
    name: '',
  }
  const [currentUser, setCurrentUser] = React.useState(defaultUser);
  const [cardsList, setCardsList] = React.useState([]);

  const [email, setEmail] = React.useState('');

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isRegistrationPopupOpen, setIsRegistrationPopupOpen] = React.useState(false);
  const [isSuccessRegistration, setIsSuccessRegistration] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(undefined);
  const [activePopup, setActivePopup] = React.useState('');
  const [isLoginNow, setIsLoginNow] = React.useState(false);

  const [loggedIn, setLoggedIn] = React.useState(false);

  const history = useHistory();

  // Монтирование информации о пользователе
  React.useEffect(() => {
    Promise.resolve(api.getUserInfo())
      .then(dataUser => {
        setCurrentUser(dataUser);
      })
      .catch(err =>
        console.log("Что-то не так с информацией пользователя.", err)
      )
  }, []);

  // Монтирование карточек
  React.useEffect(() => {
    Promise.resolve(api.getCards())
      .then(dataCards => {
        setCardsList(dataCards);
      })
      .catch(err => {
        console.log("Что-то не так с карточками.", err)
      })
  }, []);

  // Автоматически заходит, если в localStorage есть подходящий токен
  React.useEffect(() => {
    signIn();
  }, [loggedIn]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
    setActivePopup(document.querySelector('.popup_type_edit-profile'));
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
    setActivePopup(document.querySelector('.popup_type_add-card'));
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
    setActivePopup(document.querySelector('.popup_type_update-avatar'));
  }

  function handleRegisterPopup() {
    setIsRegistrationPopupOpen(true);
  }

  function handleCardClick(cardInfo) {
    setSelectedCard({
      ...cardInfo
    });
  }

  // Закрывает попапы
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsRegistrationPopupOpen(false);
    setSelectedCard(undefined);
  }

  // Обновляет данные о пользователе
  function handleUpdateUser(datas) {
    Loading(true, activePopup);
    api.sendProfileDatasToServer(datas.name, datas.about)
      .then(profileDatas => {
        setCurrentUser(profileDatas);
        closeAllPopups();
      })
      .catch(err => { console.log("Что-то не так с отправкой данных на сервер", err) })
      .finally(() => { Loading(false, activePopup) })
  }

  // Обновляет аватар
  function handleUpdateAvatar({ avatar }) {
    Loading(true, activePopup);
    api.sendAvatarToServer(avatar)
      .then(user => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(err => { console.log("Не обновляется аватар", err) })
      .finally(() => { Loading(false, activePopup) })
  }

  // Добавляет карточку
  function handleAddPlaceSubmit(card) {
    Loading(true, activePopup);
    api.postCard(card)
      .then(newCard => {
        setCardsList([newCard, ...cardsList]);
        closeAllPopups();
      })
      .catch(err => { console.log("Не добавляется карточка", err) })
      .finally(() => { Loading(false, activePopup) })
  }

  // Лайки
  function handleCardLike(card) {
    const isLiked = card.likes.some(like => like._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then(newCard => {
        setCardsList(state => state.map(item => item._id === card._id ? newCard : item));
      })
      .catch(err => { console.log("Лайки не работают", err) })
  }

  // Удаление карточек
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        api.getCards()
          .then(newCards => setCardsList(newCards))
          .catch(err => { console.log("Не получаются карточки", err) })
      })
      .catch(err => { console.log("Не удаляется карточка", err) })
  }

  // Регистрация
  function handleRegister({ email, password }) {
    auth.registration(email, password)
      .then(() => {
        setIsSuccessRegistration(true);
        handleRegisterPopup();
      })
      .catch(err => {
        console.log('Не зарегистрировался ', err);
        handleRegisterPopup();
      })
    history.push('/sign-in');
  }

  // Авторизация
  function authorizationAndSignIn({ email, password }) {
    auth.authorization(email, password)
      .then(() => {
        if (localStorage.getItem('token')) {
          signIn();
        }
      })
      .catch(err => { console.log('Не авторизовался ', err) });
  }

  // Вход
  function signIn() {
    const token = localStorage.getItem('token');
    if (token) {
      history.push('/');
      auth.login(token)
        .then(data => {
          setLoggedIn(true);
          setEmail(data.data.email);
        })
        .catch(err => { console.log('Что-то не так с токеном', err) })
    } else {
      setLoggedIn(false);
    }
  }

  // Выход
  function signOut() {
    if (loggedIn) {
      localStorage.clear();
      setLoggedIn(false);
      history.push('/sign-in');
    }
  }

  function toggleCurrentWindow(what) {
    setIsLoginNow(what);
  }

  function redirectToRegister() {
    history.push('/sign-up');
  }

  function redirectToLogin() {
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          loggedIn={loggedIn}
          isLoginNow={isLoginNow}
          email={email}
          onClick={loggedIn ? signOut : isLoginNow ? redirectToRegister : redirectToLogin}
        />
        <Switch>
          <Route path='/sign-up'>
            <Registration
              onRegister={handleRegister}
              onLoad={toggleCurrentWindow}
            />
          </Route>
          <Route path='/sign-in'>
            <Login
              onLogin={authorizationAndSignIn}
              onLoad={toggleCurrentWindow}
            />
          </Route>
          <Route path='*'>
            <CardsContext.Provider value={cardsList}>
              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onUpdateCards={setCardsList}
                onCardLike={handleCardLike}
                onDeleteCard={handleCardDelete}
              />
            </CardsContext.Provider>
            <InfoTooltip title="Вы успешно зарегистрировались!" />
            <Footer />
            <Route>{loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}</Route>
          </Route>
        </Switch>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <PopupWithForm title="Вы уверены?" name="question" buttonText="Да" id="popup_delete"></PopupWithForm>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip isOpen={isRegistrationPopupOpen} onClose={closeAllPopups} isSuccess={isSuccessRegistration} />
      </div>
    </CurrentUserContext.Provider>
  );
}
