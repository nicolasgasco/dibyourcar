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




