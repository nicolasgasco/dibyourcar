// Container with personal info
const yourProfileContainer = document.querySelector("#your-profile-container");
// Smaller container with actual data
const unchangedDataContainer = document.querySelector("#unchanged-data-container");


// Container with hidden form for changing data
const changeDataForm = document.getElementById("profile-data-box");

// Edit data button for personal info container
const editDataButton = document.querySelector("#edit-data-button");

// Cancel button when you're editing data
const cancelEditData = document.getElementById("cancel-data-edit");

// Button to confirm data edit changes
const confirmNewData = document.querySelector("#confirm-new-data");


// Container with hidden form for changing password
const changePasswordForm = document.getElementById("profile-password-box");

// Edit password button for personal info container
const editPasswordButton = document.querySelector("#edit-password-button");

// Cancel button for password change in personal info container
const cancelPasswordEditButton = document.querySelector("#cancel-password-button");

// Confirm password button for password change in personal info container 
const confirmNewPasswordButton = document.querySelector("#confirm-password-button");


// Container with stories submitted
let yourSubmissions = document.querySelector("#your-submissions");

// Container with data shown as stored in database, content added later in time
let singleResultShowData;

// Container with form for editing data in database, content added later in time
let singleResultEditData;




// Initialize all the button events at first
initializeButtonEvents();
// Show all the submitted post or default message
showSubmittedPosts();
// Populate personal data section with actual data
populatePersonalData();


function populatePersonalData() {
    const email = localStorage.getItem("user");
    const emailObject = {};
    emailObject["email"] = email;

    // Fetch user data
    fetch("/api/users/email/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( emailObject ),
    })
    .then( res => res.json() )
    .then( user => {

        if ( user.results ) {
            
            for ( let textField of unchangedDataContainer.getElementsByTagName("SPAN") ) { 

                switch ( textField.id ) {
                    case "name-displayed":
                        textField.innerText = user.results.name;
                        break;
                    
                    case "surname-displayed":
                        textField.innerText = user.results.surname
                        break;

                    case "email-displayed":
                        textField.innerText = user.results.email;
                }
            }
        }

    });
}

function initializeButtonEvents() {
    // Buttons for editing data
    editDataButton.addEventListener("click", editDataInProfile);
    cancelEditData.addEventListener("click", exitEditPersonalData);
    confirmNewData.addEventListener("click", saveNewPersonalData);

    // Buttons for editing password
    editPasswordButton.addEventListener("click", editPasswordInProfile);
    cancelPasswordEditButton.addEventListener("click", exitEditPassword);
    confirmNewPasswordButton.addEventListener("click", saveNewPassword);
}


// Show message when no story was submitted
function showDefaultMessageYourSubmissions() {
    yourSubmissions.innerHTML =
        `
        <div>
            <p>You haven't submitted any story yet. Use the button below to add one.</p>
            <a href="./add.html"><button class="home-paragraph-button black-bg white-text bold">New story</button></a>
        </div>
        `
}


// Three utility functions used later
function capitalizeFirstLetterEveryWord(myString) {
    myString = myString.split(" ").map( el => el.charAt(0).toUpperCase() + el.substring(1).toLowerCase()).join(" ");
    myString= myString.split("-").map( el => el.charAt(0).toUpperCase() + el.substring(1)).join("-")

    return myString.trim();
}

function capitalizeFirstCharLeaveRestSame(myString) {
    myString = myString.trim();
    let result = myString.charAt(0).toUpperCase() + myString.substring(1);
    return result;
}

function createObjectFromString(arrayToParse) {
    let stringToParse = `{${arrayToParse.join(", ")}}`;
    let result = JSON.parse(stringToParse);
    return result;
}


// Activated when Edit data button is pressed
function editDataInProfile(event) {
    event.preventDefault();

    const email = localStorage.getItem("user");
    const emailObject = {};
    emailObject["email"] = email;

    // Fetch user data
    fetch("/api/users/email/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( emailObject ),
    })
    .then( res => res.json() )
    .then( user => {

        for ( let singleInput of changeDataForm.getElementsByTagName("INPUT") ) {


            switch ( singleInput.name ) {
                case "name":
                    singleInput.style.color = "black";
                    singleInput.value = user.results.name;
                    break;
                case "surname":
                    singleInput.style.color = "black";
                    singleInput.value = user.results.surname;
                    break;
                case "email":
                    singleInput.style.color = "black";
                    singleInput.value = user.results.email;
                    break;
            }
        }
    });

    changeDataForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
}

// Activated when Cancel button is pressed during data editing 
function exitEditPersonalData(event) {
    // Not always this function is called by an event
    if ( event) {
        event.preventDefault();
    }

    changeDataForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
}

// Activated when Confirm data button is pressed during data editing
function saveNewPersonalData(event) {
    event.preventDefault();

    const dataContainer = event.currentTarget.parentElement.parentElement;
    const newDataInputs = dataContainer.children;

    dataContainer.checkValidity();

    let userObject = {};
    if ( dataContainer.reportValidity() ) {
        for ( let newInput of newDataInputs ) {
            if ( newInput.tagName === "LABEL" ) {

                let value = newInput.children[1].value;
                let name = newInput.children[1].name;
    
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
                }
            }

            userObject["oldmail"] = localStorage.getItem("user");
        }
        console.log(userObject)
        fetch(`/api/users/update/data`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify( userObject ),
        })
        .then(response => response.json())
        .then(data => {

            if ( data.results.modifiedCount > 0 ) {

                window.alert("Personal data were updated!");

                exitEditPersonalData();
                localStorage.setItem("user", userObject.email)
                populatePersonalData();
                
            } else {
                window.alert("It wasn't possible updating your data!")
            }

        })
        .catch((error) => {

            console.error('Error:', error);

        });
    }
}   


// Activated when Edit password button is pressed
function editPasswordInProfile(event) {
    event.preventDefault();

    changePasswordForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
    
    changePasswordForm.checkValidity();

    let passwordObject = {};
    if ( changePasswordForm.reportValidity() ) {
        console.log("ciao")
    }
}

// Activated when Cancel button is pressed during password change
function exitEditPassword(event) {
    event.preventDefault();

    changePasswordForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
}


function saveNewPassword(event) {
    event.preventDefault();

    const dataContainer = event.currentTarget.parentElement.parentElement;


    const newDataInputs = dataContainer.children;

    let passwordObject = {};
    for ( let newInput of newDataInputs ) {
        if ( newInput.tagName === "LABEL" ) {
            let value = newInput.firstElementChild.value;
            let name = newInput.firstElementChild.name;


            switch ( name ) {
                case "password":
                    passwordObject["password"] = value;
                    break;
                case "new-password":
                    passwordObject["new-password"] = value;
                    break;
                case "confirm-new-password":
                    passwordObject["confirm-new-password"] = value;
                    break;
            }
        }
    }

    dataContainer.checkValidity();
    if ( dataContainer.reportValidity() ) {
        // Check if current password is correct

        // Check if two password are equal

        // Save new password in database
    };

}


// Show posts submitted by user
function showSubmittedPosts() {
    if ( localStorage.getItem("user") === null ) {
        showDefaultMessageYourSubmissions();
        return;
    }

    const emailObject = {};
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
    .then( res => {
        
        if ( res.userExists ) {

            const id = res.results._id;
            fetch(`api/humans/user/${id}`)
            .then( res => res.json() )
            .then( res => {

                // If no stories are associated to user
                if ( res.foundStories === false ) {
                    showDefaultMessageYourSubmissions();
                    return;
                }

                const postArray = res.results;

                finalResult = ``;
                for ( let element of postArray ) {

                    let portraitImage;

                    if ( !element.img ) {
                        portraitImage = `<img src="./img/no_image.jpg" alt="No image available" id="image-${element._id}" class="result-image">`
                    } else {
                        portraitImage = `<img src="${element.img}" alt="Picture of ${element.name} ${element.surname}" id="image-${element._id}" class="result-image">`
                    }
                    
                    finalResult +=
                        `
                        <div id="single-result-${element._id}" class="single-result">
                            
                            <small style="display:none">${element._id}</small>
                            ${portraitImage}
                        
                            <h3>${element.name} ${element.surname} (${element.age}, ${element.gender})</h3>
                            <div id="single-result-show-data">
                                <div>
                                    <p><b>From:</b> ${element.from.city} (${element.from.country})</p>
                                    <p><b>Currently in:</b> ${element.currently_in.city} (${element.currently_in.country})<p>
                                    <p class="min-height"><b>Story:</b> ${element.interview.story}</p>
                                    <p class="min-height"><b>Advice:</b> ${element.interview.advice}</p>
                                    <p class="min-height"><b>Dream:</b> ${element.interview.dream}</p>
                                </div>
                                <div class="add-button-container">
                                    <button type="submit" onclick="editStory(event)" class="home-paragraph-button black-bg white-text bold">Edit story</button>
                                    <button type="submit" onclick="deleteStory(event)" class="home-paragraph-button black-bg white-text bold">Delete story</button>
                                </div>
                            </div>
                            

                            <div id="single-result-edit-data" class="hidden">
                                <form id="edit-story-form-${element._id}" class="formatted-form">
                                    <p><b>Personal data:</b></p>
                                    <label for="new-story-name">Name (required):</label>
                                    <input type="text" name="name" id="new-story-name" autocomplete="given-name" value="${element.name}" required>
                                    <br>
                                    <label for="new-story-surname">Surname (required):</label>
                                    <input type="text" name="surname" id="new-story-surname" autocomplete="family-name" value="${element.surname}" required>
                        
                                    <br>
                                    <br>
                        
                                    <label for="new-story-age">Age:</label>
                                    <input type="number" name="age" id="new-story-age" min="10" max="100" value="${element.age}">
                                    
                                    <label for="gender-select">Gender:</label>
                                    <select name="gender" id="gender-select" autocomplete="sex">
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </select>
                        
                                    <br>
                                    
                                    <p><b>Contact:</b></p>
                                    <label for="new-story-email">Email:</label>
                                    <input type="email" name="email" id="new-story-email" autocomplete="email" value="${element.contact.email}">
                                    
                                    <br>
                                    <br>
                        
                                    <label for="new-story-telephone">Telephone (+12345678):</label>
                                    <input type="tel" name="telephone" id="new-story-telephone" autocomplete="tel" value="${element.contact.telephone_number}">
                        
                                    <p><b>From:</b></p>
                                    <label for="new-story-city-from">City:</label>
                                    <input type="text" name="city-from" id="new-story-city-from" autocomplete="address-level2" value="${element.from.city}">
                                    
                        
                                    <label for="new-story-country-from">Country (required):</label>
                                    <input type="text" name="country-from" id="new-story-country-from" required autocomplete="country-name" value="${element.from.country}">
                                    
                        
                                    <p><b>Living in:</b></p>
                                    <label for="new-story-country">City (required):</label>
                                    <input type="text" name="city" id="new-story-country" autocomplete="address-level2" required value="${element.currently_in.city}">
                                    
                                    <br>
                        
                                    <label for="new-story-country">Country (required):</label>
                                    <input type="text" name="country" id="new-story-country" autocomplete="country-name" required value="${element.currently_in.country}">
                                    
                                    <br>
                        
                                    <label for="new-story-spot">Where usually found: </label>
                                    <textarea name="spot" id="new-story-spot" rows="1" required>${element.where_to_find.spot}</textarea>
                        
                                    
                                    <br>
                                    <br>
                        
                                    <p><b>Interview:</b></p>
                                    <label for="new-story-body">Story (required):</label>
                                    <br>
                                    <textarea name="story" id="new-story-body" rows="4" required>${element.interview.story}</textarea>
                                    
                                    <br>
                        
                                    <label for="new-story-advice">Advice (required):</label>
                                    <br>
                                    <textarea name="advice" id="new-story-advice" rows="2" required>${element.interview.advice}</textarea>
                        
                                    <br>
                        
                                    <label for="new-story-dream">Dream (required):</label>
                                    <br>
                                    <textarea name="dream" id="new-story-dream" rows="2" required>${element.interview.dream}</textarea>
                        
                                    <br>
                                    <br>
                                    
                                    <p><b>Image:</b></p>
                                    <label for="new-story-image">Image:</label>
                                    <input type="text" name="img" id="new-story-image" autocomplete="photo" value="${element.img}">
                                    
                                    <br>
                                    <br>
                        
                                    <p><b>Consent:</b></p>
                                    <p>Does the interviewee agreed to sharing their contact information?</p>
                                    <div class="inline-block">
                                        <input type="radio" id="share-yes" name="share-consent" value="true">
                                        <label for="share-yes">Yes</label>
                                        <input type="radio" id="share-no" name="share-consent" value="false" checked>
                                        <label for="share-no">No</label>
                                    </div>
                        
                                    <br>
                        
                                    <div class="add-button-container">
                                        <button type="submit" class="home-paragraph-button black-bg white-text bold" onclick="saveEdits(event)">Save edits</button>
                                        <button type="submit" onclick="cancelEditStory(event)" class="home-paragraph-button black-bg white-text bold">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        `
                }

                yourSubmissions.innerHTML = finalResult;
                
                singleResultShowData = document.querySelector("#single-result-show-data");
                singleResultEditData = document.querySelector("#single-result-edit-data");
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}

function deleteStory(event) {
    let userChoice = window.confirm("Do you really want to remove this entry?");

    const id = event.currentTarget.parentElement.parentElement.parentElement.firstElementChild.innerText;
    
    const singleResultContainer = event.currentTarget.parentElement.parentElement.parentElement;
    
    if ( userChoice === true ) {

        fetch(`api/humans/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then( res => res.json() )
        .then( res => {
            singleResultContainer.remove();

            setTimeout( function() {
                window.alert("Story deleted!");
            }, 300);
            
        })
        .catch( (error) => {
            console.error("Error:", error);
        });
    }
}

function switchDisplayShowEditData() {
    singleResultShowData.classList.toggle("hidden");
    singleResultEditData.classList.toggle("hidden");
}

function editStory(event) {
    event.preventDefault();

    switchDisplayShowEditData()
}

function cancelEditStory(event) {
    event.preventDefault();

    switchDisplayShowEditData()
}


// Since asynchronous, doesn't work for all the cases
async function getIdCurrentUser() {
    const response = await fetch("/api/currentuser/")
    const id = await response.json();
    return id.results._id;
}


async function saveEdits(event) {
    event.preventDefault();

    const editStoryForm = event.currentTarget.parentElement.parentElement;

    let updatedStory = {    };

    // Necessary to build the object
    let fromArr = [];
    let currentArr = [];
    let interview = [];
    let contact = [];

    // Database id of story
    id = editStoryForm.parentElement.parentElement.firstElementChild.innerText;

    for ( let inputField of editStoryForm.children ) {

        // Filter only meaningful tags
        if ( inputField.tagName === "INPUT" || inputField.tagName === "TEXTAREA" || inputField.tagName === "SELECT" ) {
            
            // Giving data the right formatting
            let validatedData;
            if ( inputField.value ) {
                
                if ( inputField.name === "gender" ) {
                    validatedData = inputField.value.toLowerCase();

                } else if ( inputField.name === "img" ) {
                    validatedData = inputField.value.toLowerCase();

                } else if ( inputField.name === "spot" || inputField.type === "textarea" ) {
                    validatedData = capitalizeFirstCharLeaveRestSame(inputField.value);

                } else if ( inputField.type === "text" ) {
                    validatedData =  capitalizeFirstLetterEveryWord(inputField.value); 
                }

                // Either good as it is or needs some manipulation
                let value = validatedData || inputField.value;

                // Creating object with manipulated data
                switch ( inputField.name ) {
                    case "city-from":
                        fromArr.push( `"city": "${value}"` );
                        break;
    
                    case "country-from":
                        fromArr.push( `"country": "${value}"` );
                        break;
    
                    case "city":
                        currentArr.push( `"city": "${value}"` );
                        break;
    
                    case "country":
                        currentArr.push( `"country": "${value}"` );
                        break;
    
                    case "story":
                        interview.push( `"story": "${value}"` );
                        break;
    
                    case "advice":
                        interview.push( `"advice": "${value}"` );
                        break;
                    
                    
                    case "dream":
                            interview.push( `"dream": "${value}"` );
                        break;
                    
                    // Spot is a nested value
                    case "spot":
                        updatedStory["where_to_find"] = {"spot": value};
                        break;
    
                    case "telephone":
                        contact.push( `"telephone_number": "${value}"` );
                        break;
                    
                    case "email":
                        contact.push( `"email": "${value}"` );
                        break;
    
                    default:
                        updatedStory[inputField.name] = value;
                        break;
                }
            }
        }
    }

    // Radio buttons, true or false
    const shareConsent = document.querySelector(`input[name="share-consent"]:checked`).value;
    contact.push( `"share_contact": ${Boolean(shareConsent)}` );

    // Date of modification
    updatedStory["submitDate"] = new Date();


    // Raw strings are converted into objects, sometimes nested
    if ( fromArr.length > 0 ) {
        updatedStory["from"] = createObjectFromString(fromArr);
    } 

    if ( currentArr.length > 0 ) {
        updatedStory["currently_in"] = createObjectFromString(currentArr);
    } 

    if ( interview.length > 0 ) {
        updatedStory["interview"] = createObjectFromString(interview);
    } 

    updatedStory["contact"] = createObjectFromString(contact);
    
    // Add to logic to add submittedBy user
    // MAYBE I'LL NEED TO CHANGE THIS
    const currentUserId = await getIdCurrentUser();
    updatedStory["submittedBy"] = currentUserId;

    // Checks validity of form, if OK, sends to database
    editStoryForm.checkValidity();
    if ( editStoryForm.reportValidity() ) {
        fetch(`api/humans/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( updatedStory ),
        })
        .then( res => res.json() )
        .then( res => {
            switchDisplayShowEditData()

            setTimeout( function() {
                window.alert("Story modified!");
            }, 300)

            
        })
        .catch( (error) => {
            console.error("Error:", error);
        });
    };


}

// From here on, it's just login logics
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
        console.log(userObject)
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

    // Adapt personal data shown in container and posts shown in container
    populatePersonalData();
    showDefaultMessageYourSubmissions();

}


// Show dropdown menu for when you're logged
function showDropdownUserProfile(event) {
    event.preventDefault();

    const email = localStorage.getItem("user");
    const emailObject = {};
    emailObject["email"] = email

    // Fetch complete name of user from database
    fetch("/api/users/email/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( emailObject ),
    })
    .then( res => res.json() )
    .then( user => {

        if ( user.userFound ) {
            // Show personalized message
            userName = `${user.results.name} ${user.results.surname}`;
            userContainer.firstElementChild.innerText = `Hi, ${userName}`;

            userContainer.classList.toggle("hidden");

            // Not sure if this is still required
            userIconLink.addEventListener("click", showDropdownUserProfile);
        }
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

        passwordInput.value = ``;
        confirmPassword.value = ``;

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
            populatePersonalData();

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

        if ( result.loggedOut ) {

            // Clean locale storage and reload page
            localStorage.clear();
            window.location.replace("./index.html");
            
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// If page is loaded when a user is already logged in
function checkUserAlreadyLoggedIn() {
    if ( localStorage.getItem("user") ) {
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

// Logout button
const logoutButton = document.querySelector("#logout-button");
logoutButton.addEventListener("click", logoutUser)

// When loading page, check if user is already logged in
checkUserAlreadyLoggedIn();




