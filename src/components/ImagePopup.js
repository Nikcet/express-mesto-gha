export default function ImagePopup(props) {
  return (
    <div id="popupImage" className={`image-popup popup ${props.card ? "popup_opened" : ""}`}>
      <div className="image-popup__wrap">
        <img src={props.card?.link} alt={props.card?.name} className="image-popup__image" />
        <p className="image-popup__description">{props.card?.name}</p>
        <button
          className="image-popup__close-btn popup__close"
          type="button"
          aria-label="Закрыть"
          onClick={props.onClose}
        ></button>
      </div>
    </div>
  );
}
