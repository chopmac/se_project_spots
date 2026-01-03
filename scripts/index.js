const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfile = document.querySelector("#edit-profile-modal");
const profileCloseBtn = editProfile.querySelector(".modal__close-button");
const newPostBtn = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const postCloseBtn = newPostModal.querySelector(".modal__close-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileNameInput = editProfile.querySelector("#name");
const profileDescriptionInput = editProfile.querySelector("#description");
const cardTemplate = document.querySelector("#card__template");
const cardContainer = document.querySelector("#card-list");
const nameInput = newPostModal.querySelector("#caption");
const linkInput = newPostModal.querySelector("#image-link");
const previewImageModal = document.querySelector("#preview-image-modal");
const modalImage = previewImageModal.querySelector(".modal__image");
const modalCaption = previewImageModal.querySelector(".modal__caption");
const modalCloseButton = previewImageModal.querySelector(
  ".modal__close-button"
);
const modals = document.querySelectorAll(".modal");
import {
  enableValidation,
  hideInputError,
  toggleButtonState,
} from "./validation.js";
import { settings } from "./settings.js";

modalCloseButton.addEventListener("click", function () {
  closeModal(previewImageModal);

});
const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

function getCardElement(data) {
  const cardElement = cardTemplate.content.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__text");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  const likeButton = cardElement.querySelector(".card__like-btn");

  likeButton.addEventListener("click", function () {
    likeButton.classList.toggle("card__like-btn_is-active");
  });

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", function () {
    const card = deleteButton.closest(".card");
    card.remove();
  });

  cardImage.addEventListener("click", function () {
    modalImage.src = data.link;
    modalImage.alt = data.name;
    modalCaption.textContent = data.name;

    openModal(previewImageModal);
  });

  return cardElement;
}

initialCards.forEach((cardData) => {
  const cardElement = getCardElement(cardData);
  cardContainer.prepend(cardElement);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}
editProfileBtn.addEventListener("click", function () {
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;


  const profileInputs = [profileNameInput, profileDescriptionInput];
  const profileSubmitButton = editProfile.querySelector(".modal__button");
  const profileForm = editProfile.querySelector(".modal__form");

  profileInputs.forEach((inputElement) => {
    const errorElement = editProfile.querySelector(`#${inputElement.id}-error`);
    hideInputError(profileForm, inputElement, errorElement, settings);
  });

  toggleButtonState(profileInputs, profileSubmitButton, settings);

  openModal(editProfile);
});
profileCloseBtn.addEventListener("click", function () {
  closeModal(editProfile);
});
newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});
postCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  closeModal(editProfile);
  const newName = profileNameInput.value;
  const newDescription = profileDescriptionInput.value;
  profileName.textContent = newName;
  profileDescription.textContent = newDescription;
}

editProfile.addEventListener("submit", handleProfileFormSubmit);
function handleNewPostModalSubmit(evt) {
  evt.preventDefault();

  const nameValue = nameInput.value;
  const linkValue = linkInput.value;

  const cardData = { name: nameValue, link: linkValue };
  const cardElement = getCardElement(cardData);
  cardContainer.prepend(cardElement);


  const postForm = newPostModal.querySelector(".modal__form");
  postForm.reset();


  const postSubmitButton = newPostModal.querySelector(".modal__button");
  const postInputs = [nameInput, linkInput];
  toggleButtonState(postInputs, postSubmitButton, settings);

  closeModal(newPostModal);
}





newPostModal.addEventListener("submit", handleNewPostModalSubmit);

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (evt) => {

    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

console.log("Logging card names:"),
  initialCards.forEach((card) => {
    console.log(card.name);
  });
