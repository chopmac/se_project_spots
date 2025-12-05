const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfile = document.querySelector("#edit-profile-modal");
const profileCloseBtn = editProfile.querySelector(".modal__close-button");
const newPostBtn = document.querySelector(".profile__add-button");
const newPost = document.querySelector("#new-post-modal");
const postCloseBtn = newPost.querySelector(".modal__close-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileNameInput = editProfile.querySelector("#name");
const profileDescriptionInput = editProfile.querySelector("#description");
const imageLink = newPost.querySelector("#image-link");
const imageText = newPost.querySelector("#caption");
const newName = profileNameInput.value;
const newDescription = profileDescriptionInput.value;
profileName.textContent = newName;
profileDescription.textContent = newDescription;

editProfileBtn.addEventListener("click", function () {
  editProfile.classList.add("modal_is-opened");
});
profileCloseBtn.addEventListener("click", function () {
  editProfile.classList.remove("modal_is-opened");
});
newPostBtn.addEventListener("click", function () {
  newPost.classList.add("modal_is-opened");
});
postCloseBtn.addEventListener("click", function () {
  newPost.classList.remove("modal_is-opened");
});
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  editProfile.classList.remove("modal_is-opened");
}

editProfile.addEventListener("submit", handleProfileFormSubmit);

// Create the form submission handler.
function newPostSubmit(evt) {
  // Prevent default browser behavior.
  evt.preventDefault();

  // Log both input values to the console.
  console.log(newName);
  console.log(newDescription);

 
  addCardModal.classList.remove("modal_is-opened");
}


newPost.addEventListener("submit", newPostSubmit);
