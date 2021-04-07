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

    changeDataForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
}

// Activated when Cancel button is pressed during data editing 
function exitEditPersonalData(event) {
    event.preventDefault();

    changeDataForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
}

// Activated when Confirm data button is pressed during data editing
function saveNewPersonalData(event) {
    event.preventDefault();

    const dataContainer = event.currentTarget.parentElement.parentElement;
    const newDataInputs = dataContainer.children;

    let userObject = {};
    for ( let newInput of newDataInputs ) {
        if ( newInput.tagName === "LABEL" ) {
            let value = newInput.firstElementChild.value;
            let name = newInput.firstElementChild.name;

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
    } 

    dataContainer.checkValidity();
    if ( dataContainer.reportValidity() ) {
        // Save info and update
    };
}


// Activated when Edit password button is pressed
function editPasswordInProfile(event) {
    event.preventDefault();

    changePasswordForm.classList.toggle("hidden");
    unchangedDataContainer.classList.toggle("hidden");
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


    // Fetch ID of current user
    fetch("/api/currentuser/")
    .then( res => res.json() )
    .then( res => {

        id = res.results._id;
        
        // Fetch posts by said user
        fetch(`api/humans/user/${id}`)
        .then( res => res.json() )
        .then( res => {
            const postArray = res.results;

            finalResult = ``;

            if ( postArray ) {
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
                                <p><b>From:</b> ${element.from.city} (${element.from.country})</p>
                                <p><b>Currently in:</b> ${element.currently_in.city} (${element.currently_in.country})<p>
                                <p><b>Story:</b> ${element.interview.story}</p>
                                <p><b>Advice:</b> ${element.interview.advice}</p>
                                <p><b>Dream:</b> ${element.interview.dream}</p>
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
            
            } else {
                showDefaultMessageYourSubmissions();
            }

            
        })
        .catch((error) => {
            console.error("Error:", error);
        });
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


// function editStory(event) {

//     const id = event.currentTarget.parentElement.parentElement.firstElementChild.innerText;

//     fetch(`api/humans/find/${id}`)
//     .then( res => res.json() )
//     .then( res => {
//         element = res.results;

//         let portraitImage;

//         if ( !element.img ) {
//             portraitImage = `<img src="./img/no_image.jpg" alt="No image available" class="result-image">`
//         } else {
//             portraitImage = `<img src="${element.img}" alt="Picture of ${element.name} ${element.surname}" class="result-image">`
//         }

//         result = `
//         <small style="display:none">${element._id}</small>
//         ${portraitImage}
//         <h3>${element.name} ${element.surname} (${element.age}, ${element.gender})</h3>
//         <form id="edit-story-form-${element._id}" class="formatted-form">
//             <p><b>Personal data:</b></p>
//             <label for="new-story-name">Name (required):</label>
//             <input type="text" name="name" id="new-story-name" autocomplete="given-name" value="${element.name}" required>
//             <br>
//             <label for="new-story-surname">Surname (required):</label>
//             <input type="text" name="surname" id="new-story-surname" autocomplete="family-name" value="${element.surname}" required>

//             <br>
//             <br>

//             <label for="new-story-age">Age:</label>
//             <input type="number" name="age" id="new-story-age" min="10" max="100" value="${element.age}">
            
//             <label for="gender-select">Gender:</label>
//             <select name="gender" id="gender-select" autocomplete="sex">
//                 <option value="female">Female</option>
//                 <option value="male">Male</option>
//                 <option value="other">Other</option>
//             </select>

//             <br>
            
//             <p><b>Contact:</b></p>
//             <label for="new-story-email">Email:</label>
//             <input type="email" name="email" id="new-story-email" autocomplete="email" value="${element.contact.email}">
            
//             <br>
//             <br>

//             <label for="new-story-telephone">Telephone (+12345678):</label>
//             <input type="tel" name="telephone" id="new-story-telephone" autocomplete="tel" value="${element.contact.telephone_number}">

//             <p><b>From:</b></p>
//             <label for="new-story-city-from">City:</label>
//             <input type="text" name="city-from" id="new-story-city-from" autocomplete="address-level2" value="${element.from.city}">
            

//             <label for="new-story-country-from">Country (required):</label>
//             <input type="text" name="country-from" id="new-story-country-from" required autocomplete="country-name" value="${element.from.country}">
            

//             <p><b>Living in:</b></p>
//             <label for="new-story-country">City (required):</label>
//             <input type="text" name="city" id="new-story-country" autocomplete="address-level2" required value="${element.currently_in.city}">
            
//             <br>

//             <label for="new-story-country">Country (required):</label>
//             <input type="text" name="country" id="new-story-country" autocomplete="country-name" required value="${element.currently_in.country}">
            
//             <br>

//             <label for="new-story-spot">Where usually found: </label>
//             <textarea name="spot" id="new-story-spot" rows="1" required>${element.where_to_find.spot}</textarea>

            
//             <br>
//             <br>

//             <p><b>Interview:</b></p>
//             <label for="new-story-body">Story (required):</label>
//             <br>
//             <textarea name="story" id="new-story-body" rows="4" required>${element.interview.story}</textarea>
            
//             <br>

//             <label for="new-story-advice">Advice (required):</label>
//             <br>
//             <textarea name="advice" id="new-story-advice" rows="2" required>${element.interview.advice}</textarea>

//             <br>

//             <label for="new-story-dream">Dream (required):</label>
//             <br>
//             <textarea name="dream" id="new-story-dream" rows="2" required>${element.interview.dream}</textarea>

//             <br>
//             <br>
            
//             <p><b>Image:</b></p>
//             <label for="new-story-image">Image:</label>
//             <input type="text" name="img" id="new-story-image" autocomplete="photo" value="${element.img}">
            
//             <br>
//             <br>

//             <p><b>Consent:</b></p>
//             <p>Does the interviewee agreed to sharing their contact information?</p>
//             <div class="inline-block">
//                 <input type="radio" id="share-yes" name="share-consent" value="true">
//                 <label for="share-yes">Yes</label>
//                 <input type="radio" id="share-no" name="share-consent" value="false" checked>
//                 <label for="share-no">No</label>
//             </div>

//             <br>

//             <div class="add-button-container">
//                 <button type="submit" class="home-paragraph-button black-bg white-text bold" onclick="saveEdits(event)">Save edits</button>
//                 <button type="submit" onclick="cancelEditStory(event)" class="home-paragraph-button black-bg white-text bold">Cancel</button>
//             </div>
//         </form>

//         `
//         const singleResultEdit = event.target.parentElement.parentElement;
//         singleResultEdit.innerHTML = result.replaceAll("undefined", "");

//     })
//     .catch( (error) => {
//         console.error("Error:", error);
//     });

    
// }





