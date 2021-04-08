function showHideLoginContainer() {
    if ( !signupContainer.classList.contains("hidden") ) {

        signupContainer.classList.toggle("hidden");
        
    } else {
        loginContainer.classList.toggle("hidden");
    }
}

function tryToLogin(event) {
    event.preventDefault();

    let userObject = {};

    for ( let inputField of loginForm.children ) {
        if ( inputField.tagName === "LABEL" ) {
            let value = inputField.firstElementChild.value;
            const name = inputField.firstElementChild.name;
            
            switch ( name ) {
                case "email":
                    userObject["email"] = value;
                    break;
                case "password":
                    userObject["password"] = value;
                    break;
            }
        }
    }

    loginForm.checkValidity();
    if ( loginForm.reportValidity() ) {
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( userObject ),
        })
        .then(response => response.json())
        .then(data => {
    
            console.log(data);
            if ( data.session === true ) {
                window.alert(`Welcome back!`)
                sessionStorage.setItem('user', userObject.email);
                loginSuccessful();
            }

            if ( !data.loginDataCorrect ) {
                const wrongEmailPasswordText = document.querySelector("#wrong-email-password-text");
                const passwordFieldForm = document.querySelector("#password-login");
                const emailFieldForm = document.querySelector("#email-login");

                wrongEmailPasswordText.classList.toggle("hidden");
                passwordFieldForm.classList.toggle("red-outline");
                emailFieldForm.classList.toggle("red-outline");

                setTimeout( function() {
                    wrongEmailPasswordText.classList.toggle("hidden");
                    passwordFieldForm.classList.toggle("red-outline");
                    emailFieldForm.classList.toggle("red-outline");
                }, 2500);
                


            }
    
    
        })
        .catch((error) => {
    
            console.error('Error:', error);
    
        });
    };


}

function loginSuccessful(event) {
    loginLink.classList.toggle("hidden");
    loginContainer.style.display = "none";
    signupContainer.style.display = "none";


    // Show button with profile icon
    userIconLink.style.display = "block";
    
    // Show dropdown menu with user info
    userIconLink.addEventListener("click", showDropdownUserProfile);
}

function showDropdownUserProfile(event) {
    event.preventDefault();

    const email = sessionStorage.getItem("user");

    fetch(`/api/users/email/${email}`)
    .then( res => res.json() )
    .then( user => {

        userName = `${user.results.name} ${user.results.surname}`;

        userContainer.firstElementChild.innerText = `Hi, ${userName}`;
        userContainer.classList.toggle("hidden");

        userIconLink.addEventListener("click", showDropdownUserProfile);

    })
    // Get email from session storage and name from database

}

function showHideSignupContainer() {
    if ( !loginContainer.classList.contains("hidden") ) {
        loginContainer.classList.toggle("hidden");
    }

    if ( signupContainer.classList.contains("hidden") ) {
        signupContainer.classList.toggle("hidden");
    }
}

function tryToSignup(event) {
    event.preventDefault();

    

    signupForm.checkValidity();
    if ( signupForm.reportValidity() ) {

        let userObject = {};

        for ( let inputField of signupForm.children ) {
            if ( inputField.tagName === "LABEL" ) {

                let value = inputField.firstElementChild.value;
                const name = inputField.firstElementChild.name;
                
                switch ( name ) {
                    case "name":
                        userObject["name"] = value;
                        break;
                    
                    case "surname":
                        userObject["surname"] = value;
                        break;
                    case "email":
                        userObject["email"] = value;
                        break;
                    case "confirm-password":
                        userObject["password"] = value;
                        break;
                }
            }
        }

        fetch("/api/signin/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( userObject ),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if ( data.success ) {
                window.alert(`Sign up successful!`)
                sessionStorage.setItem('user', userObject.email);
                loginSuccessful();
            }

            if ( !data.new_user ) {

                const emailField = document.querySelector("#email");
                emailField.classList.toggle("red-outline");
                
                const userAlreadyExistsText = document.querySelector("#user-already-exists-text");
                userAlreadyExistsText.classList.toggle("hidden");

                setTimeout( function() {
                    emailField.classList.toggle("red-outline");
                    userAlreadyExistsText.classList.toggle("hidden");
                }, 2500);
            }



        })
        .catch((error) => {

            console.error('Error:', error);

        });
    }
}

function logoutUser() {
    console.log("ciao")
    fetch("/api/logout/", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then( res => res.json() )
    .then( result => {
        console.log(result)
        if ( result.loggedOut ) {
            // Clean locale storage
            sessionStorage.clear();
            location.reload();
            
        }
    })
}

function checkUserAlreadyLoggedIn() {
    if ( sessionStorage.getItem("user") ) {
        loginSuccessful();
    }
}

// Login link in right top corner
const loginLink = document.querySelector("#login-link");
loginLink.addEventListener("click", showHideLoginContainer);

// Login container and form
const loginContainer = document.querySelector("#log-in-container");
const loginForm = document.querySelector("#log-in-form");

const loginButton = document.querySelector("#login-button");
loginButton.addEventListener("click", tryToLogin);

const userIconLink = document.querySelector("#user-icon-button")
const userContainer = document.querySelector("#user-container");

const signupContainer = document.querySelector("#sign-up-container");
const signupForm = document.querySelector("#sign-up-form");

const signupLink = document.querySelector("#signup-link");
signupLink.addEventListener("click", showHideSignupContainer)

const signupButton = document.querySelector("#signup-button");
signupButton.addEventListener("click", tryToSignup)

const firstStartHelpLink = document.querySelector("#start-help-link");
firstStartHelpLink.addEventListener("click", showHideSignupContainer);

const secondStartHelpLink = document.querySelector("#start-helping-link");
secondStartHelpLink.addEventListener("click", showHideSignupContainer);

const logoutButton = document.querySelector("#logout-button");
logoutButton.addEventListener("click", logoutUser)

// When loading page, check if user is already logged in
checkUserAlreadyLoggedIn();