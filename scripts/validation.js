export const config = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save-button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => evt.preventDefault());
    setEventListeners(formElement, config);
  });
}

function setEventListeners(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

function checkInputValidity(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      errorElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, errorElement, config);
  }
}

function showInputError(
  formElement,
  inputElement,
  errorElement,
  errorMessage,
  config
) {
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

export function hideInputError(
  formElement,
  inputElement,
  errorElement,
  config
) {

    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = "";
    errorElement.classList.remove(config.errorClass);
  }


export function toggleButtonState(inputList, buttonElement, config) {
    if (hasInvalidInput(inputList)) {
      buttonElement.classList.add(config.inactiveButtonClass);
      buttonElement.disabled = true;
    } else {
      buttonElement.classList.remove(config.inactiveButtonClass);
      buttonElement.disabled = false;
    }
  }


function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

function resetValidation(formElement, config) {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    hideInputError(formElement, inputElement, errorElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
}


const postTitle = newPostTitleInput.value;
const postImageLink = newPostImageInput.value;

addCard(
  { name: postTitle, link: postImageLink },
  cardsContainer,
  "#card-template"
);

newPostModalForm.reset();

const postInputs = [newPostTitleInput, newPostImageInput];
const postSubmitButton = newPostModal.querySelector(".modal__save-button");
const postForm = newPostModal.querySelector(".modal__form");

postInputs.forEach((inputElement) => {
  const errorElement = newPostModal.querySelector(`#${inputElement.id}-error`);
  hideInputError(postForm, inputElement, errorElement, config);
});

toggleButtonState(postInputs, postSubmitButton, config);
