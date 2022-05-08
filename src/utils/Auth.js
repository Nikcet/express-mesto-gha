export const URL = 'https://auth.nomoreparties.co';

function onResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res}`);
}

export const registration = (email, password) => {
    return fetch(
        `${URL}/signup`,
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        }
    )
        .then(res => onResponse(res))
}

export const authorization = (email, password) => {
    return fetch(
        `${URL}/signin`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        }
    )
        .then(res => onResponse(res))
        .then(data => {
            localStorage.setItem('token', data.token);
        })
}

export const login = (jwtToken) => {
    return fetch(
        `${URL}/users/me`,
        {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${jwtToken}`
            }
        }
    )
        .then(res => onResponse(res))
}
