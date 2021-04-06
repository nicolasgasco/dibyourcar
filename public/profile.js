let yourSubmissions = document.querySelector("#your-submissions");

if ( !yourSubmissions.innerText ) {
    yourSubmissions.innerHTML =
    `
    <div>
        <p>You haven't submitted any story yet. Use the button below to add one.</p>
        <a href="./add.html"><button class="home-paragraph-button black-bg white-text bold">New story</button></a>
    </div>
    `
}

function editPasswordInProfile() {
    yourProfileContainer.innerHTML = 
    `
    <form id="profile-data-box" class="formatted-form">
        <label for="password" class="s-text inline-block">Current password: <input type="password" name="password" class="s-text" autocomplete="current-password"></label>

        <br>
        <br>
        <label for="new-password" class="s-text inline-block">New password: <input type="password" name="new-password" class="s-text" autocomplete="new-password"></label>
        <label for="confirm-new-password" class="s-text inline-block">Confirm new password: <input type="password" name="confirm-new-password" class="s-text" autocomplete="new-password"></label>
        <br>
        <br>
        <div class="add-button-container">
            <button type="submit" id="confirm-password-button" class="home-paragraph-button black-bg white-text bold">Confirm password</button>
        </div>        
    </form>
    `
}

function editDataInProfile() {
    yourProfileContainer.innerHTML = 
    `
    <form id="profile-data-box" class="formatted-form">
        <label for="name" class="s-text inline-block">Name: <input type="text" name="name" class="s-text" placeholder="Your name"></label>

        <label for="surname" class="s-text inline-block">Surname: <input type="text" name="surname" class="s-text" placeholder="Your surname"></label>
        <br>
        <br>
        <label for="email" class="s-text inline-block">E-mail: <input type="text" name="email" class="s-text" placeholder="Your e-mail"></label>
        <br>
        <br>
        <div class="add-button-container">
            <button type="submit" id="confirm-new-data" class="home-paragraph-button black-bg white-text bold">Confirm data<button>
        </div>

        
    </form>
    `
}

const yourProfileContainer = document.querySelector("#your-profile-container");

const editDataButton = document.querySelector("#edit-data-button");
editDataButton.addEventListener("click", editDataInProfile);

const editPasswordButton = document.querySelector("#edit-password-button");
editPasswordButton.addEventListener("click", editPasswordInProfile);

function showSubmittedPosts() {
    fetch("/api/currentuser/")
    .then( res => res.json() )
    .then( res => {
        id = res.results._id;
        
        fetch(`api/humans/id/${id}`)
        .then( res => res.json() )
        .then( res => {
            const postArray = res.results;

            console.log(postArray)
            finalResult = ``;

            for ( let element of postArray ) {

                let portraitImage;

                if ( !element.img ) {
                    portraitImage = `<img src="./img/no_image.jpg" alt="No image available" class="result-image">`
                } else {
                    portraitImage = `<img src="${element.img}" alt="Picture of ${element.name} ${element.surname}" class="result-image">`
                }
                
                finalResult +=
                    `
                    <div class="single-result">
                        <small style="display:none">${element._id}</small>
                        ${portraitImage}
                        <h3>${element.name} ${element.surname} (${element.age}, ${element.gender})</h3>
                        <p><b>From:</b> ${element.from.city} (${element.from.country})</p>
                        <p><b>Currently in:</b> ${element.currently_in.city} (${element.currently_in.country})<p>
                        <p><b>Story:</b> ${element.interview.story}</p>
                        <p><b>Advice:</b> ${element.interview.advice}</p>
                        <p><b>Dream:</b> ${element.interview.dream}</p>
                        <div class="add-button-container">
                            <button type="submit" class="home-paragraph-button black-bg white-text bold">Edit story<button>
                            <button type="submit" onclick="deleteStory(event)" class="home-paragraph-button black-bg white-text bold">Delete story<button>
                        </div>
                    </div>

                    `
            }

            yourSubmissions.innerHTML = finalResult;

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

// Show submitted stories in profile when page is loaded
showSubmittedPosts();






