const editProfileBtn = document.querySelector(".profile__edit-button")
const editProfile = document.querySelector("#edit-profile-modal")
const profileCloseBtn = editProfile.querySelector(".modal__close-button")
const newPostBtn = document.querySelector(".profile__add-button")
const newPost = document.querySelector("#new-post-modal")
const postCloseBtn = newPost.querySelector(".modal__close-button")
editProfileBtn.addEventListener("click", function() {
   editProfile.classList.add("modal_is-opened");
});
profileCloseBtn.addEventListener("click", function() {
    editProfile.classList.remove("modal_is-opened");
})
newPostBtn.addEventListener("click", function() {
   newPost.classList.add("modal_is-opened");
});
postCloseBtn.addEventListener("click", function() {
    newPost.classList.remove("modal_is-opened");
})