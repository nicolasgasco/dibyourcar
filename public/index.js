
function showLoginContainer() {
    loginLink.removeEventListener("click", showLoginContainer);

    loginContainer.style.display = "block";

    loginLink.addEventListener("click", hideLoginContainer);

}

function hideLoginContainer() {
    console.log('ciao')
    loginLink.removeEventListener("click", hideLoginContainer);

    loginContainer.style.display = "none";

    loginLink.addEventListener("click", showLoginContainer);
}

const loginLink = document.querySelector("#login-link");
loginLink.addEventListener("click", showLoginContainer);

const loginContainer = document.querySelector("#log-in-container");