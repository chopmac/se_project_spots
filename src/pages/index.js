import validation from "../scripts/validation.js";
import Api from "../utils/Api.js";
import "./index.css"; 

const cardContainer = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const editProfileModal = document.querySelector("#edit-profile-modal");
const avatarModal = document.querySelector("#edit-avatar-modal");
const newPostModal = document.querySelector("#new-post-modal");
const deleteModal = document.querySelector("#delete-modal");
const previewModal = document.querySelector("#preview-image-modal");

const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "7174c401-cf05-4634-82da-556bcd30e936",
    "Content-Type": "application/json"
  }
});

let cardToDelete = null;

const initialCards = [
  { name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg" },
  { name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
  { name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
  { name: "A very long bridge", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
  { name: "Tunnel", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
  { name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" },
];

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

function renderLoading(modal, isLoading, buttonText = "Save") {
  const submitButton = modal.querySelector(".modal__save-button") || modal.querySelector(".modal__button_type_confirm");
  if (submitButton) {
    submitButton.textContent = isLoading ? "Saving..." : buttonText;
  }
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
    profileName.textContent = userInfo.name.includes(";") ? "Bessie Coleman" : userInfo.name;
    profileDescription.textContent = userInfo.about.includes(";") ? "Civil Aviator" : userInfo.about;
    profileAvatar.src = userInfo.avatar;
    renderInitialCards(cards.length > 0 ? cards : initialCards);
  })
  .catch(() => {
    profileName.textContent = "Bessie Coleman";
    profileDescription.textContent = "Civil Aviator";
    renderInitialCards(initialCards);
  });

document.querySelector(".profile__edit-button").addEventListener("click", () => {
  editProfileModal.querySelector("#name").value = profileName.textContent;
  editProfileModal.querySelector("#description").value = profileDescription.textContent;
  validation.resetValidation(editProfileModal.querySelector(".modal__form"), validation.config);
  
  const inputList = Array.from(editProfileModal.querySelectorAll(validation.config.inputSelector));
  const buttonElement = editProfileModal.querySelector(validation.config.submitButtonSelector);
  validation.toggleButtonState(inputList, buttonElement, validation.config);
  
  openModal(editProfileModal);
});

document.querySelector(".profile__add-button").addEventListener("click", () => {
  validation.resetValidation(newPostModal.querySelector(".modal__form"), validation.config);
  
  const inputList = Array.from(newPostModal.querySelectorAll(validation.config.inputSelector));
  const buttonElement = newPostModal.querySelector(validation.config.submitButtonSelector);
  validation.toggleButtonState(inputList, buttonElement, validation.config);
  
  openModal(newPostModal);
});

document.querySelector(".profile__avatar-container").addEventListener("click", () => {
  validation.resetValidation(avatarModal.querySelector(".modal__form"), validation.config);
  
  const inputList = Array.from(avatarModal.querySelectorAll(validation.config.inputSelector));
  const buttonElement = avatarModal.querySelector(validation.config.submitButtonSelector);
  validation.toggleButtonState(inputList, buttonElement, validation.config);
  
  openModal(avatarModal);
});

document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("mousedown", (e) => {
    if (
      e.target === m ||
      e.target.classList.contains("modal__close-button") ||
      e.target.classList.contains("modal__button_type_cancel")
    ) {
      closeModal(m);
    }
  });
});

editProfileModal.querySelector(".modal__form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderLoading(editProfileModal, true);
  api.setUserInfo({
    name: editProfileModal.querySelector("#name").value,
    about: editProfileModal.querySelector("#description").value
  }).then((res) => {
    profileName.textContent = res.name;
    profileDescription.textContent = res.about;
    closeModal(editProfileModal);
  })
  .catch(console.error)
  .finally(() => renderLoading(editProfileModal, false));
});

avatarModal.querySelector(".modal__form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderLoading(avatarModal, true);
  const avatarUrl = avatarModal.querySelector(".modal__input").value;
  api.updateAvatar(avatarUrl).then((res) => {
    profileAvatar.src = res.avatar;
    closeModal(avatarModal);
  })
  .catch(console.error)
  .finally(() => renderLoading(avatarModal, false));
});

newPostModal.querySelector(".modal__form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderLoading(newPostModal, true, "Create");
  api.addCard({
    name: newPostModal.querySelector("input[name='name']").value,
    link: newPostModal.querySelector("input[name='link']").value
  }).then((res) => {
    cardContainer.prepend(getCardElement(res));
    closeModal(newPostModal);
    evt.target.reset();
  })
  .catch(console.error)
  .finally(() => renderLoading(newPostModal, false, "Create"));
});

deleteModal.querySelector(".modal__button_type_confirm").addEventListener("click", () => {
  if (cardToDelete) {
    if (!cardToDelete.id) {
      cardToDelete.element.remove();
      closeModal(deleteModal);
      cardToDelete = null;
      return;
    }
    renderLoading(deleteModal, true, "Yes");
    api.deleteCard(cardToDelete.id)
      .then(() => {
        cardToDelete.element.remove();
        closeModal(deleteModal);
        cardToDelete = null;
      })
      .catch(console.error)
      .finally(() => renderLoading(deleteModal, false, "Yes"));
  }
});

validation.enableValidation(validation.config);