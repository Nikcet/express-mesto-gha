export default function Loading(isLoading, activePopup) {
    const button = activePopup.querySelector('.popup__submit-btn');

    isLoading
        ? button.textContent = 'Сохранение...'
        : button.textContent = 'Сохранить';
}