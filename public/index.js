
function showLoginContainer() {

    if ( signupContainer.style.display === "block" ) {
        signupContainer.style.display = "none";
    } else {
        loginLink.removeEventListener("click", showLoginContainer);

        loginContainer.style.display = "block";
        signupContainer.style.display = "none";

        loginLink.addEventListener("click", hideLoginContainer);
    }

    
}


function hideLoginContainer() {
    loginLink.removeEventListener("click", hideLoginContainer);

    loginContainer.style.display = "none";
    signupContainer.style.display = "none";


    loginLink.addEventListener("click", showLoginContainer);
}


function showSignupContainer() {
    loginContainer.style.display = "none";
    signupContainer.style.display = "block";
}



const loginLink = document.querySelector("#login-link");
loginLink.addEventListener("click", showLoginContainer);

const loginContainer = document.querySelector("#log-in-container");

const signupLink = document.querySelector("#signup-link");
signupLink.addEventListener("click", showSignupContainer)

const signupContainer = document.querySelector("#sign-up-container");

const firstStartHelpLink = document.querySelector("#start-help-link");
firstStartHelpLink.addEventListener("click", showSignupContainer);

const secondStartHelpLink = document.querySelector("#start-helping-link");
secondStartHelpLink.addEventListener("click", showSignupContainer);