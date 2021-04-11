// Container with personal info
const yourProfileContainer = document.querySelector("#your-profile-container");
// Smaller container with actual data
const unchangedDataContainer = document.querySelector("#unchanged-data-container");


// Container with hidden form for changing data
const changeDataForm = document.getElementById("profile-data-box");

// Buttons to edit data
const editDataButton = document.querySelector("#edit-data-button");
const cancelEditData = document.getElementById("cancel-data-edit");
const confirmNewData = document.querySelector("#confirm-new-data");


// Container with hidden form for changing password
const changePasswordForm = document.getElementById("profile-password-box");

// Buttons to edit password
const editPasswordButton = document.querySelector("#edit-password-button");
const cancelPasswordEditButton = document.querySelector("#cancel-password-button");
const confirmNewPasswordButton = document.querySelector("#confirm-password-button");

// Inputs when chanding password
const passwordInput = document.querySelector("#password-edit");
const newPasswordInput = document.querySelector("#new-password");
const confirmNewPasswordInput = document.querySelector("#confirm-new-password");

// Error messages for passwords
const passwordNotNewMessage = document.querySelector("#password-not-new");
const firstPasswordWrongMessage = document.querySelector("#first-password-wrong");
const passwordNotSameMessage = document.querySelector("#password-not-same");

// Container with stories submitted
let yourSubmissions = document.querySelector("#your-submissions");

// When loading page, check if user is already logged in, If not, redirect to home
checkUserAlreadyLoggedIn();


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
                    // singleInput.style.color = "black";
                    singleInput.value = user.results.name;
                    break;
                case "surname":
                    // singleInput.style.color = "black";
                    singleInput.value = user.results.surname;
                    break;
                case "email":
                    // singleInput.style.color = "black";
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

    // Show password edit form and hide user data
    changePasswordForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
    
    changePasswordForm.checkValidity();
    if ( changePasswordForm.reportValidity() ) {
        saveNewPassword;
    }
}


// Activated when Cancel button is pressed during password change
function exitEditPassword(event) {
    if ( event ) {
        event.preventDefault();
    }

    changePasswordForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
}

function firstPasswordIsWrongEdit() {

    // Show message and add outline
    firstPasswordWrongMessage.classList.toggle("hidden");
    passwordInput.classList.toggle("red-outline");
    

    setTimeout( function() {
        passwordInput.classList.toggle("red-outline");
        firstPasswordWrongMessage.classList.toggle("hidden");
        passwordInput.value = ``;
    }, 2500)
}

function passwordIsNotNewMessageEdit() {

    // Show error message
    passwordNotNewMessage.classList.toggle("hidden");

    // Show red outline
    // passwordInput.classList.toggle("red-outline");
    newPasswordInput.classList.toggle("red-outline");
    confirmNewPasswordInput.classList.toggle("red-outline");


    setTimeout(function() {
        passwordNotNewMessage.classList.toggle("hidden");

        // passwordInput.classList.toggle("red-outline");
        newPasswordInput.classList.toggle("red-outline");
        confirmNewPasswordInput.classList.toggle("red-outline");

        newPasswordInput.value = ``;
        confirmNewPasswordInput.value=``;
    }, 2500)
}

function passwordMustBeSameEdit() {
    passwordNotSameMessage.classList.toggle("hidden");

    newPasswordInput.classList.toggle("red-outline");
    confirmNewPasswordInput.classList.toggle("red-outline");

    setTimeout(function() {
        passwordNotSameMessage.classList.toggle("hidden");

        newPasswordInput.classList.toggle("red-outline");
        confirmNewPasswordInput.classList.toggle("red-outline");

        // newPasswordInput.value = ``;
        // confirmNewPasswordInput.value=``;
    }, 2500)
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

    confirmNewPasswordInput.classList.add("red-outline");
    newPasswordInput.classList.add("red-outline");
    
    function removePasswordNoCriteriaMessage() {
        confirmNewPasswordInput.classList.remove("red-outline");
        newPasswordInput.classList.remove("red-outline");

        passwordNoCriteriaMessage.classList.add("hidden");

        // passwordInput.value = ``;
        // confirmPassword.value = ``;

        document.getElementById("length").classList.remove("ticked-element");
        document.getElementById("alphanumeric").classList.remove("ticked-element");
        document.getElementById("capital").classList.remove("ticked-element");
        document.getElementById("special").classList.remove("ticked-element");
        
        // Remove event, otherwise form gets deleted everytime user blurs
        passwordInput.removeEventListener("focus", removePasswordNoCriteriaMessage);
    }

    newPasswordInput.addEventListener("focus", removePasswordNoCriteriaMessage);
}


function saveNewPassword(event) {
    event.preventDefault();
    // When arriving here, form is filled and valid

    changePasswordForm.checkValidity();
    if ( changePasswordForm.reportValidity() ) {

        // Old and new password (+ confirm password)
        const newDataInputs = changePasswordForm.children;

        let passwordObject = {};

        // Need this to be available everywhere
        let password;
        let newPassword;
        let confirmNewPassword;

        for ( let newInput of newDataInputs ) {
            // Relevant fields are nested inside labels for formatting reasons
            if ( newInput.tagName === "LABEL" ) {

                let value = newInput.children[1].value;
                let name = newInput.children[1].name;

                // Just create variables for data validation
                switch ( name ) {
                    case "password":
                        password = value;
                        break;
                    case "new-password":
                        newPassword = value;
                        break;
                    case "confirm-new-password":
                        confirmNewPassword = value;
                        break;
                }
            }
        }

        // Check if old password is good
        fetch(`api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( { "email": localStorage.getItem("user"), "password" : password } ),
        })
        .then( res => res.json() )
        .then( user => {
            
            // Check if old password is good
            if ( !user.loginDataCorrect ) {
                firstPasswordIsWrongEdit();
                return;
            }
            // passwordInput.classList.toggle("green-outline")
            passwordObject["password"] = password;

            // Check if new password is actually new
            if ( password === newPassword || password === confirmNewPassword ) {
                passwordIsNotNewMessageEdit();
                return;
            }

            // Check if new password respects criteria
            if ( !isPasswordValid(newPassword)) {
                showPasswordNotValid();
                return;
            }

            // Check if password are equals
            if ( newPassword !== confirmNewPassword ) {
                passwordMustBeSameEdit();
                return;
            }


            passwordObject["new-password"] = newPassword;

            // Get ID of current user
            fetch(`api/users/email/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( {"email" : localStorage.getItem("user")} ),
                })
            .then( res => res.json() )
            .then( id => {
                const userId = id.results._id;

                fetch(`api/users/password/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify( { "_id" : userId, "password" : newPassword} ),
                })
                .then( res => res.json() )
                .then( info => {
                    if ( info.nModified > 0 ) {
                        exitEditPassword();
                        window.alert("Password was changed!")
                    } else {
                        window.alert("It wasn't possible to change the password!")
                    }
                })
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });   

        })
        .catch((error) => {
            console.error('Error:', error);
        });   

    }

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
        
        if ( res.userFound ) {

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

                    let genderField;
                    switch ( element.gender ) {
                        case "male":
                            genderField = 
                            `
                            <label for="gender-select">Gender:</label>
                            <select name="gender" id="gender-select" autocomplete="sex">
                                <option value="female">Female</option>
                                <option value="male" selected>Male</option>
                                <option value="other">Other</option>
                            </select>
                            `
                            break;

                        case "female":
                            genderField = 
                            `
                            <label for="gender-select">Gender:</label>
                            <select name="gender" id="gender-select" autocomplete="sex">
                                <option value="female" selected>Female</option>
                                <option value="male">Male</option>
                                <option value="other">Other</option>
                            </select>
                            `
                            break;
                        case "other":
                            genderField = 
                            `
                            <label for="gender-select">Gender:</label>
                            <select name="gender" id="gender-select" autocomplete="sex">
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="other" selected>Other</option>
                            </select>
                            `
                            break;
                    }


                    let portraitImage;

                    if ( !element.img ) {
                        portraitImage = `<img src="./img/no_image.jpg" alt="No image available" id="image-${element._id}" class="result-image">`
                        
                        // Without this, undefined or null are shown in the form
                        element.img = ``;
                    } else {
                        portraitImage = `<img src="${element.img}" alt="Picture of ${element.name} ${element.surname}" id="image-${element._id}" class="result-image">`
                    }
                    
                    finalResult +=
                        `
                        <div id="single-result-${element._id}" class="single-result">
                            
                            <small style="display:none">${element._id}</small>
                            ${portraitImage}
                        
                            <h3>${element.name} ${element.surname} (${element.age}, ${element.gender})</h3>
                            <div id="single-result-show-data-${element._id}">
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
                            

                            <div id="single-result-edit-data-${element._id}" class="hidden">
                                <form id="edit-story-form-${element._id}" class="formatted-form">
                                    <p><b>Personal data:</b></p>
                                    <label for="new-story-name">Name:</label>
                                    <input type="text" name="name" id="new-story-name" autocomplete="given-name" value="${element.name}" required>
                                    <br>
                                    <label for="new-story-surname">Surname:</label>
                                    <input type="text" name="surname" id="new-story-surname" autocomplete="family-name" value="${element.surname}" required>
                        
                                    <br>
                                    <br>
                        
                                    <label for="new-story-age">Age:</label>
                                    <input type="number" name="age" id="new-story-age" min="10" max="100" value="${element.age}">
                                    
                                    ${genderField}
                        
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
                                    <br>
                        
                                    <label for="new-story-country-from">Country:</label>
                                    <input type="text" name="country-from" id="new-story-country-from" required autocomplete="country-name" value="${element.from.country}">
                                    
                        
                                    <p><b>Living in:</b></p>
                                    <label for="new-story-country">City:</label>
                                    <input type="text" name="city" id="new-story-country" autocomplete="address-level2" required value="${element.currently_in.city}">
                                    
                                    <br>
                        
                                    <label for="new-story-country">Country:</label>
                                    <input type="text" name="country" id="new-story-country" autocomplete="country-name" required value="${element.currently_in.country}">
                                    
                                    <br>
                        
                                    <label for="new-story-spot">Where usually found: </label>
                                    <textarea name="spot" id="new-story-spot" rows="1" required>${element.where_to_find.spot}</textarea>
                        
                                    
                                    <br>
                                    <br>
                        
                                    <p><b>Interview:</b></p>
                                    <label for="new-story-body">Story:</label>
                                    <br>
                                    <textarea name="story" id="new-story-body" rows="4" required>${element.interview.story}</textarea>
                                    
                                    <br>
                        
                                    <label for="new-story-advice">Advice:</label>
                                    <br>
                                    <textarea name="advice" id="new-story-advice" rows="2" required>${element.interview.advice}</textarea>
                        
                                    <br>
                        
                                    <label for="new-story-dream">Dream:</label>
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
                                        <button type="submit" class="home-paragraph-button black-bg white-text bold" id="save-edits-${element._id}" onclick="saveEdits(event)">Save edits</button>
                                        <button type="submit" id="cancel-edits-${element._id}" onclick="cancelEditStory(event)" class="home-paragraph-button black-bg white-text bold">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        `
                }

                yourSubmissions.innerHTML = finalResult;
            
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

            // location.reload();
            
        })
        .catch( (error) => {
            console.error("Error:", error);
        });
    }
}


function switchDisplayShowEditData(event, id) {
    if ( !id ) {
        id = event.currentTarget.parentElement.parentElement.id.split("-").slice(-1);
    }

    const singleResultShowData = document.querySelector(`#single-result-show-data-${id}`);
    singleResultShowData.classList.toggle("hidden");

    const singleResultEditData = document.querySelector(`#single-result-edit-data-${id}`);
    singleResultEditData.classList.toggle("hidden");
}


function editStory(event) {
    event.preventDefault();

    switchDisplayShowEditData(event)
}


function cancelEditStory(event) {
    event.preventDefault();
    const id = event.currentTarget.parentElement.parentElement.id.split("-").slice(-1);

    const singleResultShowData = document.querySelector(`#single-result-show-data-${id}`);
    singleResultShowData.classList.toggle("hidden");

    window.location.hash = singleResultShowData.parentElement.id;

    const singleResultEditData = document.querySelector(`#single-result-edit-data-${id}`);
    singleResultEditData.classList.toggle("hidden");
}


// Since asynchronous, doesn't work for all the cases
let getIdCurrentUser = new Promise((resolve, reject) => {
    const email = localStorage.getItem("user");

    fetch(`api/users/email/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( { "email": email } ),
    })
    .then( res => res.json() )
    .then( res => {
        resolve(res.results._id);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});


async function saveEdits(event) {
    event.preventDefault();

    const editStoryForm = event.currentTarget.parentElement.parentElement;
    editStoryForm.checkValidity();

    let id;
    // If all data is fine
    if ( editStoryForm.reportValidity() ) {

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

                        // If only whitespaces are inserted
                        if ( inputField.value == false ) {
                            validatedData = null;
                        } else {
                            validatedData = inputField.value.toLowerCase();
                        }

                    } else if ( inputField.name === "spot" || inputField.type === "textarea" ) {
                        validatedData = capitalizeFirstCharLeaveRestSame(inputField.value);

                    } else if ( inputField.type === "text" ) {
                        validatedData =  capitalizeFirstLetterEveryWord(inputField.value); 
                    }

                    // If no image is given, I want null to be used as value
                    if ( validatedData === undefined ) {
                        value = inputField.value;
                    } else {
                        value = validatedData;
                    }

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
        getIdCurrentUser.
        then( currentUserId => {
            updatedStory["submittedBy"] = currentUserId;

            fetch(`api/humans/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify( updatedStory ),
            })
            .then( res => res.json() )
            .then( res => {
                switchDisplayShowEditData(event, id)


                location.reload()
                window.alert("Story modified!");
                window.location.hash = `single-result-${id}`;

                

            })
            .catch( (error) => {
                console.error("Error:", error);
            });

        })
        .catch( (error) => {
            console.error("Error:", error);
        });
        
    }
}

// From here on, it's just login logics
// In this page, you can't neither login nor signin, if not logged, you get redirected to home

// User icon and data container
const userIconLink = document.querySelector("#user-icon-button")
const userContainer = document.querySelector("#user-container");

// Logout button
const logoutButton = document.querySelector("#logout-button");
logoutButton.addEventListener("click", logoutUser)

// Adapt page when login is successful
function loginSuccessful(event) {
    
    // Show dropdown menu with user info when clicking on icon
    const userIconLink = document.querySelector("#user-icon-button")
    userIconLink.addEventListener("click", showDropdownUserProfile);

    // Adapt personal data shown in container and posts shown in container
    populatePersonalData();
    // This was Showdefaultmessage before, but I think it was wrong
    showSubmittedPosts();
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

            const userContainer = document.querySelector("#user-container");
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

        if ( userData.isLogged ) {
            loginSuccessful();
        } else {
            localStorage.clear();
            document.location.href= "/";
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}