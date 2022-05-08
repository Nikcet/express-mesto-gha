import React from "react";

export default function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${props.isOpen ? "popup_opened" : ""
        }`}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__close"
          aria-label="Закрыть"
          onClick={props.onClose}
        ></button>
        <h2 className="popup__header">{props.title}</h2>
        <form className="popup__form" name={props.name} onSubmit={props.onSubmit}>
          {props.children}
          <button type="submit" className={`popup__submit-btn ${props.id === "popup_delete" ? "popup__delete-btn" : ""}`}>
            {props.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
