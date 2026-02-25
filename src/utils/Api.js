class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _request(endpoint, options = {}) {
    const url = `${this._baseUrl}${endpoint}`;
    const finalOptions = {
      headers: this._headers,
      ...options,
    };
    return fetch(url, finalOptions).then(this._checkResponse);
  }

  getInitialCards() {
    return this._request("/cards");
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  setUserInfo({ name, about }) {
    return this._request("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, about }),
    });
  }

  updateAvatar(avatarUrl) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({ avatar: avatarUrl }),
    });
  }

  addCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  addLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "PUT",
    });
  }

  removeLike(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "DELETE",
    });
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }
}

export default Api;