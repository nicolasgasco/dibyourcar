// Generic function to add list of options to select element fetching data from API
function addOptionsToSelectFromDBQuery(APIRoute, targetParent, isCity=false) {
    if ( APIRoute === "/API/locations/cities/All") {
        // pass;
    } else {

        fetch(APIRoute)
        .then(response => response.json())
        .then(data => {

            let elementList;
            if ( isCity ) {
                elementList = `<option value="null" class="s-text">All cities</option>`;
            } else {
                elementList = "";
            }


            for ( let element of data.results.sort() ) {
                elementList +=
                `
                <option value=${element.toLowerCase()} class="s-text">${capitalizeFirstLetterEveryWord(element)}</option>
                `
            };

            targetParent.innerHTML = elementList;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
}


// Event function to update city selector according to country selected
function updateCitySelection() {
    const countrySelectorValue = countrySelector.value.charAt(0).toUpperCase() + countrySelector.value.substring(1);

    // City selector changes according to country selector
    addOptionsToSelectFromDBQuery(`/API/locations/cities/${countrySelectorValue}`, citySelector, true);
}


function capitalizeFirstLetterEveryWord(myString) {
    myString = myString.split(" ").map( el => el.charAt(0).toUpperCase() + el.substring(1).toLowerCase()).join(" ");
    myString= myString.split("-").map( el => el.charAt(0).toUpperCase() + el.substring(1)).join("-")

    return myString.trim();
}


// Overall function to populate both country and city selectors
function createCountryCitySelector() {
    
    // Populate country selection first
    fetch("api/locations/countries")
    .then(response => response.json())
    .then(data => {

        let elementList = `<option value="all" class="s-text" selected>All countries</option>`;

        data.results = data.results.sort()

        // Need this to initialize page first time
        let firstCountry;
        for ( let i = 0; i < data.results.length; i++ ) {

            // THIS IS NOT USED AT THE MOMENT BUT LEFT IN CASE USEFUL IN FUTURE
            // First one is selected in order to have default value when page is charged
            if ( i === 0 ) {
                firstCountry = data.results[i].toLowerCase();
                elementList +=
                `
                <option value=${data.results[i].toLowerCase()} class="s-text">${capitalizeFirstLetterEveryWord(data.results[i])}</option>
                `
            } else {
                elementList +=
                `
                <option value=${data.results[i].toLowerCase()} class="s-text">${capitalizeFirstLetterEveryWord(data.results[i])}</option>
                `
            }
        };

        countrySelector.innerHTML = elementList;

        // Then populate city selection

        // First option is actually "All cities"
        let firstCountryInList = capitalizeFirstLetterEveryWord(countrySelector.children[1].value);


        fetch(`/api/locations/cities/${firstCountryInList}`)
        .then(response => response.json())
        .then(data => {

            let elementList = `<option value="null" class="s-text">All cities</option>`;

            for ( let element of data.results.sort() ) {
                elementList +=
                `
                <option value=${element.toLowerCase()} class="s-text">${capitalizeFirstLetterEveryWord(element)}</option>
                `
            };

            citySelector.innerHTML = elementList;

            const countrySelectorValue = countrySelector.value.charAt(0).toUpperCase() + countrySelector.value.substring(1);

            // City selector changes according to country selector
            countrySelector.addEventListener("change", updateCitySelection);
            showFilteredResults();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
    });
};

function showFilteredResults(event) {
    searchResultsDiv.innerHTML = ``;

    let countryToSearch = countrySelector.value;

    if ( !countryToSearch ) {
        countryToSearch = firstCountry;
    }

    let urlApi;
    // Triggered when page is loaded without actual event
    if ( !event ) {
        urlApi = `/api/humans/`;


    // Triggered when country selector is used
    } else if ( event.currentTarget.name === "country-selection" ) {
        urlApi = `/api/humans/${capitalizeFirstLetterEveryWord(countryToSearch)}`;

    // Triggered when city selector is used
    } else if ( event.currentTarget.name === "city-selection" ) {
        urlApi = `/api/humans/${capitalizeFirstLetterEveryWord(countryToSearch)}/${capitalizeFirstLetterEveryWord(citySelector.value)}`
    }
    

    fetch(urlApi)
    .then(response => response.json())
    .then( allHumans => {

        finalResult = ``;

        for ( let element of allHumans.results ) {
            
            // Skip if not approved
            if ( !element.approved ) {
                continue;
            }
            
            let portraitImage;
            if ( !element.img ) {
                portraitImage = `<img src="./img/no_image.jpg" alt="No image available" class="result-image">`
            } else {
                portraitImage = `<img src="${element.img}" alt="Picture of ${element.name} ${element.surname}" class="result-image">`
            }
            
            finalResult +=
            `
            <div class="single-result">
                ${portraitImage}
                <h3>${element.name} ${element.surname} (${element.age}, ${element.gender})</h3>
                <p><b>From:</b> ${element.from.city} (${element.from.country})</p>
                <p><b>Currently in:</b> ${element.currently_in.city} (${element.currently_in.country})<p>
                <p><b>Story:</b> ${element.interview.story}</p>
                <p><b>Advice:</b> ${element.interview.advice}</p>
                <p><b>Dream:</b> ${element.interview.dream}</p>
            </div>
            `
        };

        searchResultsDiv.innerHTML = finalResult;
    })
    .catch((error) => {
        console.error("Error:", error);
    });

}

// Country selector is created first, city selector shows the cities available for the selected country
let countrySelector = document.querySelector("#country-selection-humans");
let citySelector = document.querySelector("#city-selection-humans");

// Creates the selector and shows the default values
createCountryCitySelector();

// Press Search button to show results according to filters
let searchResultsDiv = document.querySelector("#search-results");
let startSearchButton = document.querySelector("#start-human-search");


countrySelector.addEventListener("change", showFilteredResults);
citySelector.addEventListener("change", showFilteredResults);
// startSearchButton.addEventListener("click", showFilteredResults);


// From here on it's all login logics
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

                // Use local storage to know which user is connected
                localStorage.setItem('user', userObject.email);

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
    
    emailObject = {};
    emailObject["email"] = localStorage.getItem("user");

    // Fetch data of current user
    fetch(`api/users/email/`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify( emailObject ),
    })
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
    }
    
    signupContainer.classList.toggle("hidden");
}

function showPasswordDontMatchMessage() {
    const passwordDontMatchMessage = document.querySelector("#password-no-match-text");
    passwordDontMatchMessage.classList.toggle("hidden");

    const passwordInput = document.querySelector("#password");
    passwordInput.classList.toggle("red-outline");

    const confirmPassword = document.querySelector("#confirm-password");
    confirmPassword.classList.toggle("red-outline");

    setTimeout( function() {
        confirmPassword.classList.toggle("red-outline");
        passwordInput.classList.toggle("red-outline");

        passwordDontMatchMessage.classList.toggle("hidden");

        passwordInput.value = ``;
        confirmPassword.value = ``;
    }, 2500);
}


// Utility functions for password validation
function isLengthOk(string, lengthChar) {

    if ( string.length > lengthChar ) {
        return true;
    }
    return false;
}

function isAlphanumeric(string) {
    let containsLetter = new RegExp("[a-zA-Z]");
    let containsNumber = new RegExp("[0-9]");
    if ( containsLetter.test(string) && containsNumber.test(string) ) {
        return true;
    }
    return false;
}

function containsCapitalLetter(string) {
    let containsNumber = new RegExp("[A-Z]");
    return containsNumber.test(string); 
}

function containsSpecialCharacter(string) {
    let containsSpecialCharacter = new RegExp(String.raw`[!"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~]`);
    return containsSpecialCharacter.test(string);
}


// Validate password and add tick to rule if password is OK
function isPasswordValid(password) {
    const length = isLengthOk(password, 8);
    if ( length ) {
        document.getElementById("length").classList.add("ticked-element");
    }

    const alphanumeric = isAlphanumeric(password);
    if ( alphanumeric ) {
        document.getElementById("alphanumeric").classList.add("ticked-element");
    }

    const capitalLetter = containsCapitalLetter(password);
    if ( capitalLetter ) {
        document.getElementById("capital").classList.add("ticked-element");
    }

    const specialCharacter = containsSpecialCharacter(password);
    if ( specialCharacter ) {
        document.getElementById("special").classList.add("ticked-element");
    }


    if ( length && alphanumeric && capitalLetter && specialCharacter ) {
        return true;
    }
    return false;
}


// Change styling to show that password is not valid
function showPasswordNotValid() {
    const passwordNoCriteriaMessage = document.querySelector("#password-no-criteria");
    passwordNoCriteriaMessage.classList.remove("hidden");

    const passwordInput = document.querySelector("#password");
    passwordInput.classList.add("red-outline");

    const confirmPassword = document.querySelector("#confirm-password");
    confirmPassword.classList.add("red-outline");
    
    function removePasswordNoCriteriaMessage() {
        confirmPassword.classList.remove("red-outline");
        passwordInput.classList.remove("red-outline");

        passwordNoCriteriaMessage.classList.add("hidden");

        // passwordInput.value = ``;
        // confirmPassword.value = ``;

        document.getElementById("length").classList.remove("ticked-element");
        document.getElementById("alphanumeric").classList.remove("ticked-element");
        document.getElementById("capital").classList.remove("ticked-element");
        document.getElementById("special").classList.remove("ticked-element");
        
        // Remove event, otherwise form gets deleted everything user blurs
        passwordInput.removeEventListener("focus", removePasswordNoCriteriaMessage);
    }

    passwordInput.addEventListener("focus", removePasswordNoCriteriaMessage);
}


// Start signup process
function tryToSignup(event) {
    event.preventDefault();

    // Use form validation without submitting it
    signupForm.checkValidity();
    if ( signupForm.reportValidity() ) {

        let userObject = {};

        // Need this to check if passwords are identical
        let password;
        let confirmPassword;

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

                    case "password":
                        password = value;
                        break;

                    case "confirm-password":
                        confirmPassword = value;
                        break;
                }
        
            }
        }

        const passwordInput = document.querySelector("#password");
        
        // Check if password is valid, but only if field is not empty   
        if ( !isPasswordValid(password) ) {
            showPasswordNotValid();
            return;
        }

        // Check if password are equals
        if ( password === confirmPassword ) {
            userObject["password"] = password;
        } else {
            showPasswordDontMatchMessage();
            return;
        }

        // Write user to database
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
            localStorage.setItem('user', userObject.email);

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
            localStorage.clear();
            userContainer.classList.toggle("hidden");
            location.reload();
            
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// If page is loaded when a user is already logged in
function checkUserAlreadyLoggedIn() {

    fetch("/api/check/")
    .then( res => res.json() )
    .then( userData => {
        console.log("isLogged", userData.isLogged)

        if ( userData.isLogged ) {
            loginSuccessful();
        } else {
            localStorage.clear();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
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

// Logout button
const logoutButton = document.querySelector("#logout-button");
logoutButton.addEventListener("click", logoutUser);

// When loading page, check if user is already logged in
checkUserAlreadyLoggedIn();