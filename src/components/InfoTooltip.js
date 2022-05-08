import React from "react";
import img from '../images/ok.svg';
import bad from '../images/bad.svg';

export default function InfoTooltip(props) {
    const goodTitle = "Вы успешно зарегистрировались!";
    const badTitle = "Что-то пошло не так! Попробуйте еще раз.";

    return (
        <div id="infoTooltip" className={`popup ${props.isOpen ? "popup_opened" : ""
            }`}>
            <div className="popup__container popup__info">
                <button
                    type="button"
                    className="popup__close"
                    aria-label="Закрыть"
                    onClick={props.onClose}
                ></button>
                <img src={props.isSuccess ? img : bad} alt={props.isSuccess ? goodTitle : badTitle} className="popup__info-image" />
                <h2 className="popup__header">{props.isSuccess ? goodTitle : badTitle}</h2>
            </div>
        </div>
    )
}