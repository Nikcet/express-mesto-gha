import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

export default function Card(props) {
    const currentUser = React.useContext(CurrentUserContext);

    const isOwn = props.card.owner._id === currentUser._id;
    const isLiked = props.card.likes.some(like => like._id === currentUser._id);
    const cardLikeButtonClassName = isLiked ? 'elements__heart_active' : '';

    function handleClick() {
        props.onCardClick(props.card);
    }

    function handleLike() {
        props.onCardLike(props.card);
    }

    function handleDeleteCard() {
        props.onDeleteCard(props.card);
    }

    return (
        <div className="elements__card">
            <img src={props.card.link}
                alt={props.card.name}
                className="elements__image"
                onClick={handleClick} />
            {isOwn && <button type="button" className="elements__delete" onClick={handleDeleteCard}></button>}
            <div className="elements__wrap">
                <h2 className="elements__name">{props.card.name}</h2>
                <div className="elements__heart-wrap">
                    <button type="button" className={`elements__heart ${cardLikeButtonClassName}`} onClick={handleLike}></button>
                    <p className="elements__heart-number">{props.card.likes.length}</p>
                </div>
            </div>
        </div>
    )
}