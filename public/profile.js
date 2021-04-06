// Show message if user has no submitted stories to show
let yourSubmissions = document.querySelector("#your-submissions");

// Container with personal info
const yourProfileContainer = document.querySelector("#your-profile-container");

// Edit data button for personal info container
const editDataButton = document.querySelector("#edit-data-button");
editDataButton.addEventListener("click", editDataInProfile);

// Edit password button for personal info container
const editPasswordButton = document.querySelector("#edit-password-button");
editPasswordButton.addEventListener("click", editPasswordInProfile);

// Show submitted stories in profile when page is loaded
showSubmittedPosts();

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


function editDataInProfile() {

    // Write new form for changing password
    yourProfileContainer.innerHTML = 
    `
    <form id="profile-data-box" class="formatted-form">
        <h3 class="l-text">Edit your data:</h3>
        <label for="confirm-new-name" class="s-text inline-block">Name: <input type="text" name="name" id="confirm-new-name" class="s-text" placeholder="Your name"></label>

        <label for="confirm-new-surname" class="s-text inline-block">Surname: <input type="text" name="surname" id="confirm-new-surname" class="s-text" placeholder="Your surname"></label>
        <br>
        <br>
        <label for="confirm-new-email" class="s-text inline-block">E-mail: <input type="text" id="confirm-new-email" name="email" class="s-text" placeholder="Your e-mail"></label>
        <br>
        <br>
        <div class="add-button-container">
            <button type="submit" id="confirm-new-data" class="home-paragraph-button black-bg white-text bold">Confirm data</button>
            <button type="submit" id="cancel-data-edit" class="home-paragraph-button black-bg white-text bold">Cancel</button>
        </div>

        
    </form>
    `

    // Event for Cancel button, everything goes back to normal
    const cancelEditData = document.getElementById("cancel-data-edit");
    cancelEditData.addEventListener("click", showNormalPersonalData);
}


function editPasswordInProfile() {

    // Switch content to Change data form
    yourProfileContainer.innerHTML = 
    `
    <form id="profile-data-box" class="formatted-form">
        <label for="password-edit" class="s-text inline-block">Current password: <input type="password" id="password-edit" name="password" class="s-text" autocomplete="current-password"></label>

        <br>
        <br>
        <label for="new-password" class="s-text inline-block">New password: <input type="password" id="new-password" name="new-password" class="s-text" autocomplete="new-password"></label>
        <label for="confirm-new-password" class="s-text inline-block">Confirm new password: <input type="password" id="confirm-new-password" name="new-password" class="s-text" autocomplete="new-password"></label>
        <br>
        <br>
        <div class="add-button-container">
            <button type="submit" id="confirm-password-button" class="home-paragraph-button black-bg white-text bold">Confirm password</button>
        </div>        
    </form>
    `
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
            console.log(postArray)
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
    
                        `
                }
    
                yourSubmissions.innerHTML = finalResult;
            
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
    window.confirm("Do you really want to remove this entry?");

    const id = event.currentTarget.parentElement.parentElement.firstElementChild.innerText;
    const singleResultContainer = event.currentTarget.parentElement.parentElement;

    if ( window.confirm ) {

        fetch(`api/humans/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then( res => res.json() )
        .then( res => {
            singleResultContainer.remove();
            window.alert("Story deleted!");
        })
        .catch( (error) => {
            console.error("Error:", error);
        });
    }
}

function editStory(event) {

    const id = event.currentTarget.parentElement.parentElement.firstElementChild.innerText;

    fetch(`api/humans/find/${id}`)
    .then( res => res.json() )
    .then( res => {
        element = res.results;

        let portraitImage;

        if ( !element.img ) {
            portraitImage = `<img src="./img/no_image.jpg" alt="No image available" class="result-image">`
        } else {
            portraitImage = `<img src="${element.img}" alt="Picture of ${element.name} ${element.surname}" class="result-image">`
        }

        result = `
        <small style="display:none">${element._id}</small>
        ${portraitImage}
        <h3>${element.name} ${element.surname} (${element.age}, ${element.gender})</h3>
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
                <button type="submit" onclick="cancelEdits(event)" class="home-paragraph-button black-bg white-text bold">Cancel</button>
            </div>
        </form>

        `
        const singleResultEdit = event.target.parentElement.parentElement;
        singleResultEdit.innerHTML = result.replaceAll("undefined", "");

    })
    .catch( (error) => {
        console.error("Error:", error);
    });

    
}

function cancelEdits(event) {
    
    event.preventDefault();
    showSubmittedPosts()
    const id = event.currentTarget.parentElement.parentElement.id.split("-").splice(-1);
    setTimeout( function() {
        document.getElementById(`image-${id}`).scrollIntoView({behavior: 'smooth'});
    }, 300)
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

    id = editStoryForm.previousElementSibling.previousElementSibling.previousElementSibling.innerText;

    for ( let inputField of editStoryForm.children ) {

        if ( inputField.tagName === "INPUT" || inputField.tagName === "TEXTAREA" || inputField.tagName === "SELECT" ) {
            
            // Data validation
            let validatedData;
            if ( inputField.value ) {
                
                console.log(inputField.name)
                if ( inputField.name === "gender" ) {
                    console.log("ciao")
                    validatedData = inputField.value.toLowerCase();

                } else if ( inputField.name === "img" ) {
                    validatedData = inputField.value.toLowerCase();

                } else if ( inputField.name === "spot" || inputField.type === "textarea" ) {
                    validatedData = capitalizeFirstCharLeaveRestSame(inputField.value);

                } else if ( inputField.type === "text" ) {
                    validatedData =  capitalizeFirstLetterEveryWord(inputField.value); 
                }

                let value = validatedData || inputField.value;



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

    const shareConsent = document.querySelector(`input[name="share-consent"]:checked`).value;
    contact.push( `"share_contact": ${Boolean(shareConsent)}` );


    updatedStory["submitDate"] = new Date();

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
    const currentUserId = await getIdCurrentUser();
    updatedStory["submittedBy"] = currentUserId;

    console.log(updatedStory)

    fetch(`api/humans/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( updatedStory ),
    })
    .then( res => res.json() )
    .then( res => {
        window.alert("Story modified!");
        console.log(res.results.ops[0]);
        showSubmittedPosts();
    })
    .catch( (error) => {
        console.error("Error:", error);
    });
}




function showNormalPersonalData() {
    yourProfileContainer.innerHTML =
    `
    <form id="profile-data-box" class="formatted-form">
        <label for="name-profile" class="s-text inline-block">Name: <input type="text" id="name-profile" name="name" class="s-text" placeholder="Your name" autocomplete="given-name" readonly></label>

        <label for="surname-profile" class="s-text inline-block">Surname: <input type="text" id="surname-profile" name="surname" class="s-text" placeholder="Your surname" autocomplete="family-name" readonly></label>
        <br>
        <br>
        <label for="email-profile" class="s-text inline-block">E-mail: <input type="text" id="email-profile" name="email" class="s-text" placeholder="Your e-mail" autocomplete="email" readonly></label>
        <br>
        <br>
        <label for="password-profile" class="s-text inline-block">Password: <input type="password" id="password-profile" name="password" class="s-text" placeholder="Your password" autocomplete="current-password" readonly></label>

        <!-- <label for="confirm-password" class="s-text inline-block">Confirm password: <input type="password" name="confirm-password" class="s-text"></label> -->
        <br>
        <br>
        <div class="add-button-container">
            <button type="button" id="edit-data-button" class="home-paragraph-button black-bg white-text bold">Edit data</button>
            <button type="button" id="edit-password-button" class="home-paragraph-button black-bg white-text bold">Edit password</button>
        </div>
        
    </form>
    `
}