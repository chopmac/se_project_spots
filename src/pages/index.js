import { enableValidation, config } from "../scripts/validation.js";
import Api from "../../utils/Api.js";

const cardContainer = document.querySelector("#card-list");
const cardTemplate = document.querySelector("#card__template");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const editProfileModal = document.querySelector("#edit-profile-modal");
const avatarModal = document.querySelector("#edit-avatar-modal");
const newPostModal = document.querySelector("#new-post-modal");

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

// Initial Bessie Setup
profileName.textContent = "Bessie Colman";
profileDescription.textContent = "Civil Aviator";
profileAvatar.src = "./images/Avatar.svg";

// --- CORE FUNCTIONS ---

function toggleButtonState(form) {
  const btn = form.querySelector(".modal__save-button");
  if (!btn) return;

  const isValid = form.checkValidity();
  if (!isValid) {
    btn.disabled = true;
    btn.classList.add("modal__save-button_disabled");
  } else {
    btn.disabled = false;
    btn.classList.remove("modal__save-button_disabled");
  }
}

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

// --- CARD LOGIC ---

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
    cardElement.remove();
    if (data._id) api.deleteCard(data._id).catch(console.error);
  });

  likeBtn.addEventListener("click", () => {
    const isLiked = likeBtn.classList.contains("card__like-btn_is-active");
    likeBtn.classList.toggle("card__like-btn_is-active");
    const action = isLiked ? api.removeLike(data._id) : api.addLike(data._id);
    action.catch(() => likeBtn.classList.toggle("card__like-btn_is-active"));
  });

  cardImage.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

const initialCards = [
  { name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg" },
  { name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg" },
  { name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg" },
  { name: "A very long bridge", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg" },
  { name: "Tunnel", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg" },
  { name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg" },
];

cardContainer.innerHTML = "";
initialCards.forEach(card => cardContainer.append(getCardElement(card)));

// --- EVENT LISTENERS ---

document.querySelector(".profile__edit-button").addEventListener("click", () => {
  const form = editProfileModal.querySelector(".modal__form");
  editProfileModal.querySelector("#name").value = profileName.textContent;
  editProfileModal.querySelector("#description").value = profileDescription.textContent;
  openModal(editProfileModal);
  toggleButtonState(form); // Check state AFTER opening
});

document.querySelector(".profile__add-button").addEventListener("click", () => {
  const form = newPostModal.querySelector(".modal__form");
  form.reset();
  openModal(newPostModal);
  toggleButtonState(form); // Force disable because form is now empty
});

profileAvatar.addEventListener("click", () => {
  const form = avatarModal.querySelector(".modal__form");
  form.reset();
  openModal(avatarModal);
  toggleButtonState(form); // Force disable
});

document.querySelectorAll(".modal__form").forEach(form => {
  form.addEventListener("input", () => toggleButtonState(form));
});

document.querySelectorAll(".modal").forEach(m => {
  m.addEventListener("mousedown", (e) => {
    if (e.target === m || e.target.classList.contains("modal__close-button")) closeModal(m);
  });
});

// --- SUBMIT HANDLERS ---

editProfileModal.querySelector(".modal__form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  api.setUserInfo({
    name: editProfileModal.querySelector("#name").value,
    about: editProfileModal.querySelector("#description").value
  }).then((res) => {
    profileName.textContent = res.name;
    profileDescription.textContent = res.about;
    closeModal(editProfileModal);
  }).catch(console.error);
});

avatarModal.querySelector(".modal__form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  api.updateAvatar(avatarModal.querySelector("#avatar-link").value).then((res) => {
    profileAvatar.src = res.avatar;
    closeModal(avatarModal);
  }).catch(console.error);
});

newPostModal.querySelector(".modal__form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  api.addCard({
    name: newPostModal.querySelector("input[name='name']").value,
    link: newPostModal.querySelector("input[name='link']").value
  }).then((res) => {
    cardContainer.prepend(getCardElement(res));
    closeModal(newPostModal);
  }).catch(console.error);
});

enableValidation(config);