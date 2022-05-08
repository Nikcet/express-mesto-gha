import React from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup(props) {
    const [avatar, setAvatar] = React.useState('');

    React.useEffect(() => {
        setAvatar('');
    }, [props.isOpen])

    function handleSubmit(event) {
        event.preventDefault();

        props.onUpdateAvatar({
            avatar
        })
    }

    function handleAvatarLink(event) {
        setAvatar(event.target.value);
    }

    return (
        <PopupWithForm
            title="Обновить аватар"
            name="update-avatar"
            isOpen={props.isOpen}
            onClose={props.onClose}
            buttonText="Сохранить"
            onSubmit={handleSubmit}
        >
            <input
                type="url"
                id="popup__ava-link"
                className="popup__input"
                placeholder="Ссылка на изображение"
                name="link"
                onChange={handleAvatarLink}
                value={avatar}
                required
            />
            <span className="popup__form-error popup__pic-link-error"></span>
        </PopupWithForm>
    )
}