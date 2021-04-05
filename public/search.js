// Add list of options to select element fetching data from API
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
        urlApi = `/api/humans/${capitalizeFirstLetterEveryWord(countryToSearch)}`;

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























// function createCitySelectorBasedOnCountry() {
//     let searchCountryCityDiv = document.querySelector("#search-country-city");
//     let citySelectionContainer = `
//         <div id="city-selection-container">
//             <label for="city-selection">City:</label>
//             <select name="city-selection" id="city-selection-humans">
//                 <option value="null"></option>
//             </select>
//         </div>
//     `
//     // searchCountryCityDiv.innerHTML += citySelectionContainer;
//     // const citySelection = document.querySelector("#city-selection-humans");

//     // addOptionsToSelectFromDBQuery(`/api/locations/cities/${selectCountry.value}`, citySelection);
// }


// Populate selects for country and city selection


// function createCountryCitySelector() {
//     const selectCountry = document.querySelector("#country-selection-humans");
//     addOptionsToSelectFromDBQuery("/api/locations/countries", selectCountry)
//     .then( result => {
//         console.log(result)
//     });

//     const selectCity = document.querySelector("#city-selection-humans");
//     console.log(selectCountry, selectCountry.firstChild)
//     addOptionsToSelectFromDBQuery(`/api/locations/cities/${selectCountry.value}`, selectCity);
    
// }