import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { CardsContext } from "../contexts/CardsContext.js";

export default function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const cards = React.useContext(CardsContext);

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__info-wrap">
          <div className="profile__avatar-overley">
            <img src={currentUser.avatar} alt={currentUser.name} className="profile__avatar" />
            <button
              type="button"
              className="profile__avatar-edit-btn"
              onClick={props.onEditAvatar}
            ></button>
          </div>
          <div className="profile__info">
            <div className="profile__info-elems">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                type="button"
                className="profile__edit-button"
                aria-label="Редактировать профиль"
                onClick={props.onEditProfile}
              ></button>
            </div>
            <p className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="Добавить карточку"
          onClick={props.onAddPlace}
        ></button>
      </section>
      <section className="elements">
        {cards.map(item => {
          return (
            <Card
              key={item._id}
              card={item}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onDeleteCard={props.onDeleteCard}
            />
          )
        })}
      </section>
    </main>
  );
}
