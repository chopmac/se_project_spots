import validation from "../scripts/validation.js";
import Api from "../utils/Api.js";
import "./index.css"; 

import "../images/Like-Icon.svg";
import "../images/edit-icon.svg";
import "../images/Plus-icon.svg";
import "../images/Logo.svg";


const cardContainer = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const nameInput = editProfileForm.querySelector("#name");
const descriptionInput = editProfileForm.querySelector("#description");

const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarForm.querySelector(".modal__input");

const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const postNameInput = newPostForm.querySelector("input[name='name']");
const postLinkInput = newPostForm.querySelector("input[name='link']");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-image-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const profileEditBtn = document.querySelector(".profile__edit-button");
const profileAddBtn = document.querySelector(".profile__add-button");
const avatarEditBtn = document.querySelector(".profile__avatar-edit-button");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7174c401-cf05-4634-82da-556bcd30e936",
    "Content-Type": "application/json"
  }
});

let cardToDelete = null;

function openModal(m) {
  if (!m) return;
  m.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(m) {
  if (!m) return;
  m.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
    const opened = document.querySelector(".modal_is-opened");
    if (opened) closeModal(opened);
  }
}

function renderLoading(isLoading, button, buttonText = "Save", loadingText = "Saving...") {
  button.textContent = isLoading ? loadingText : buttonText;
}

function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter || evt.target.querySelector(".modal__save-button");
  const initialText = submitButton.textContent;
  
  renderLoading(true, submitButton, initialText, loadingText);
  
  request()
    .then(() => {
      evt.target.reset();
      closeModal(evt.target.closest(".modal"));
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__text");
  const deleteBtn = cardElement.querySelector(".card__delete-button");
  const likeBtn = cardElement.querySelector(".card__like-btn");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  if (data.isLiked) likeBtn.classList.add("card__like-btn_is-active");

  deleteBtn.addEventListener("click", () => {
    cardToDelete = { element: cardElement, id: data._id };
    openModal(deleteModal);
  });

  likeBtn.addEventListener("click", () => {
    const isLiked = likeBtn.classList.contains("card__like-btn_is-active");
    const action = isLiked ? api.removeLike(data._id) : api.addLike(data._id);
    action
      .then(() => likeBtn.classList.toggle("card__like-btn_is-active"))
      .catch(console.error);
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function renderInitialCards(cards) {
  cardContainer.innerHTML = "";
  cards.forEach(card => cardContainer.append(getCardElement(card)));
}

api.getAppInfo()
  .then(([userInfo, cards]) => {
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
    renderInitialCards(cards);
  })
  .catch(console.error);

profileEditBtn.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  validation.resetValidation(editProfileForm, validation.config);
  openModal(editProfileModal);
});

profileAddBtn.addEventListener("click", () => {
  validation.resetValidation(newPostForm, validation.config);
  openModal(newPostModal);
});

avatarEditBtn.addEventListener("click", () => {
  validation.resetValidation(avatarForm, validation.config);
  openModal(avatarModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  const makeRequest = () => {
    return api.setUserInfo({
      name: nameInput.value,
      about: descriptionInput.value
    }).then((res) => {
      profileName.textContent = res.name;
      profileDescription.textContent = res.about;
    });
  };
  handleSubmit(makeRequest, evt);
});

avatarForm.addEventListener("submit", (evt) => {
  const makeRequest = () => {
    return api.updateAvatar(avatarInput.value).then((res) => {
      profileAvatar.src = res.avatar;
    });
  };
  handleSubmit(makeRequest, evt);
});

newPostForm.addEventListener("submit", (evt) => {
  const makeRequest = () => {
    return api.addCard({
      name: postNameInput.value,
      link: postLinkInput.value
    }).then((res) => {
      cardContainer.prepend(getCardElement(res));
    });
  };
  handleSubmit(makeRequest, evt, "Creating...");
});

deleteForm.addEventListener("submit", (evt) => {
  if (cardToDelete) {
    const makeRequest = () => {
      return api.deleteCard(cardToDelete.id)
        .then(() => {
          cardToDelete.element.remove();
          cardToDelete = null;
        });
    };
    handleSubmit(makeRequest, evt, "Deleting...");
  }
});

document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("mousedown", (e) => {
    if (e.target === m || e.target.classList.contains("modal__close-button") || e.target.classList.contains("modal__cancel-button")) {
      closeModal(m);
    }
  });
});

validation.enableValidation(validation.config);