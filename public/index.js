// Toggle on or off the hidden container for logging in
function showHideLoginContainer() {
    if ( !signupContainer.classList.contains("hidden") ) {

        signupContainer.classList.toggle("hidden");
        
    } else {
        loginContainer.classList.toggle("hidden");
    }
}


// Toggle on or off the hidden container for signing up
function tryToLogin(event) {
    event.preventDefault();

    
    // USe form validation without submitting it
    loginForm.checkValidity();

    // If all data is fine
    if ( loginForm.reportValidity() ) {
        
        let userObject = {};
        // Extract info from form
        for ( let inputField of loginForm.children ) {

            // Relevant inputs are nested inside labels for formatting reasons
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

        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( userObject ),
        })
        .then(response => response.json())
        .then(data => {

            if ( data.loginDataCorrect ) {
                window.alert("Welcome back!")

                // Use session storage to know which user is connected
                sessionStorage.setItem('user', userObject.email);

                // Change page to show a logged user
                loginSuccessful();
            } else {

                // Show text for wrong e-mail/password
                const wrongEmailPasswordText = document.querySelector("#wrong-email-password-text");
                wrongEmailPasswordText.classList.toggle("hidden");

                // Add a red outline for wrong elements
                const passwordFieldForm = document.querySelector("#password-login");
                passwordFieldForm.classList.toggle("red-outline");

                const emailFieldForm = document.querySelector("#email-login");
                emailFieldForm.classList.toggle("red-outline");

                // After a while, make the text and the outline disappear
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


// Adapt page when login is successful
function loginSuccessful(event) {
    loginLink.classList.toggle("hidden");

    // Need these like this because you get here from different places, toggle isn't always what you need
    loginContainer.style.display = "none";
    signupContainer.style.display = "none";


    // Show button with profile icon
    userIconLink.style.display = "block";
    
    // Show dropdown menu with user info when clicking on icon
    userIconLink.addEventListener("click", showDropdownUserProfile);
}


// Show dropdown menu for when you're logged
function showDropdownUserProfile(event) {
    event.preventDefault();

    const email = sessionStorage.getItem("user");

    // Fetch complete name of user from database
    fetch(`/api/users/email/${email}`)
    .then( res => res.json() )
    .then( user => {

        // Show personalized message
        userName = `${user.results.name} ${user.results.surname}`;
        userContainer.firstElementChild.innerText = `Hi, ${userName}`;

        userContainer.classList.toggle("hidden");

        // Not sure if this is still required
        userIconLink.addEventListener("click", showDropdownUserProfile);

    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Toggle on and off container with signup form
function showHideSignupContainer() {

    // If container is not already hidden
    if ( !loginContainer.classList.contains("hidden") ) {

        loginContainer.classList.toggle("hidden");
    } else {

        signupContainer.classList.toggle("hidden");
    }
}


// Start signup process
function tryToSignup(event) {
    event.preventDefault();

    // Use form validation without submitting it
    signupForm.checkValidity();
    if ( signupForm.reportValidity() ) {

        let userObject = {};

        // Relevant inputs are nested inside labels
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

            // Successful signup
            if ( data.success ) {

                window.alert(`Sign up successful!`)
                sessionStorage.setItem('user', userObject.email);

                // Do the same as for logged user
                loginSuccessful();

            }

            // Wrong data
            if ( !data.new_user ) {

                // Add red outline to e-mail field
                const emailField = document.querySelector("#email");
                emailField.classList.toggle("red-outline");
                
                // Show message
                const userAlreadyExistsText = document.querySelector("#user-already-exists-text");
                userAlreadyExistsText.classList.toggle("hidden");

                // Make everything disappear after a while
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

            // Clean locale storage and reload page
            sessionStorage.clear();
            location.reload();
            
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// If page is loaded when a user is already logged in
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

// Login button
const loginButton = document.querySelector("#login-button");
loginButton.addEventListener("click", tryToLogin);

// User icon and data container
const userIconLink = document.querySelector("#user-icon-button")
const userContainer = document.querySelector("#user-container");

// Signup container and form
const signupContainer = document.querySelector("#sign-up-container");
const signupForm = document.querySelector("#sign-up-form");

// Signup link
const signupLink = document.querySelector("#signup-link");
signupLink.addEventListener("click", showHideSignupContainer)

// Signup button
const signupButton = document.querySelector("#signup-button");
signupButton.addEventListener("click", tryToSignup)

// First call to action
const firstStartHelpLink = document.querySelector("#start-help-link");
firstStartHelpLink.addEventListener("click", showHideSignupContainer);

// Second call to action
const secondStartHelpLink = document.querySelector("#start-helping-link");
secondStartHelpLink.addEventListener("click", showHideSignupContainer);

// Logout button
const logoutButton = document.querySelector("#logout-button");
logoutButton.addEventListener("click", logoutUser)

// When loading page, check if user is already logged in
checkUserAlreadyLoggedIn();