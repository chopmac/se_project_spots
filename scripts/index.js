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
const imageLink = newPostModal.querySelector("#image-link");
const imageText = newPostModal.querySelector("#caption");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}  

editProfileBtn.addEventListener("click", function () { 
  profileNameInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(editProfile)
 
});
profileCloseBtn.addEventListener("click", function () {
  closeModal(editProfile)
});
newPostBtn.addEventListener("click", function () {
  openModal(newPostModal)
});
postCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal)
});
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  editProfile.classList.remove("modal_is-opened");
  const newName = profileNameInput.value;
  const newDescription = profileDescriptionInput.value;
  profileName.textContent = newName;
  profileDescription.textContent = newDescription;
}

editProfile.addEventListener("submit", handleProfileFormSubmit);

function handleNewPostModalSubmit(evt) {
  evt.preventDefault();

  console.log(imageLink.value);
  console.log(imageText.value);

  newPostModal.classList.remove("modal_is-opened");
}

newPostModal.addEventListener("submit", handleNewPostModalSubmit);
