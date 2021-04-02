// Add list of options to select element fetching data from API
function addOptionsToSelectFromDBQuery(APIRoute, targetParent, isCity=false) {
    
    fetch(APIRoute)
    .then(response => response.json())
    .then(data => {

        let elementList;
        if ( isCity ) {
            elementList = `<option value="null">All cities</option>`;
        } else {
            elementList = "";
        }


        for ( let element of data.results.sort() ) {
            elementList +=
            `
            <option value=${element.toLowerCase()}>${capitalizeFirstLetterEveryWord(element)}</option>
            `
        };

        targetParent.innerHTML = elementList;
    })
    .catch((error) => {
        console.error("Error:", error);
    });
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

        let elementList = "";

        for ( let element of data.results.sort() ) {
            elementList +=
            `
            <option value=${element.toLowerCase()}>${element.charAt(0).toUpperCase() + element.substring(1)}</option>
            `
        };

        countrySelector.innerHTML = elementList;

        // Then populate city selection
        let firstCountryInList = countrySelector.children[0].value;
        firstCountryInList = firstCountryInList.charAt(0).toUpperCase() + firstCountryInList.substring(1);


        fetch(`/api/locations/cities/${firstCountryInList}`)
        .then(response => response.json())
        .then(data => {

            let elementList = `<option value="null">All cities</option>`;

            for ( let element of data.results.sort() ) {
                elementList +=
                `
                <option value=${element.toLowerCase()}>${capitalizeFirstLetterEveryWord(element)}</option>
                `
            };

            citySelector.innerHTML = elementList;

            const countrySelectorValue = countrySelector.value.charAt(0).toUpperCase() + countrySelector.value.substring(1);

            // City selector changes according to country selector
            countrySelector.addEventListener("change", updateCitySelection);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
    });
};


function showFilteredResults() {
    searchResultsDiv.innerHTML = ``;

    fetch(`/api/humans/${capitalizeFirstLetterEveryWord(countrySelector.value)}/${capitalizeFirstLetterEveryWord(citySelector.value)}`)
    .then(response => response.json())
    .then( allHumans => {

        console.log(allHumans)

        finalResult = ``;

        for ( let element of allHumans.results ) {
            
            let portraitImage;
            if ( !element.img ) {
                portraitImage = `<img src="./img/no_image.png" alt="No image available">`
            } else {
                portraitImage = `<img src="${element.img}" alt="Picture of ${element.name} ${element.surname}">`
            }
            
            finalResult +=
            `
            ${portraitImage}
            <h3>${element.name} ${element.surname}</h3>
            <p>${element.age}, ${element.gender}</p>
            <p>From ${element.from.city} (${element.from.country}), lives in ${element.currently_in.city} (${element.currently_in.country})</p>
            <p>${element.interview.story}</p>
            <q>${element.interview.advice}</q>
            <q>${element.interview.dream}</q>
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
createCountryCitySelector();

// Press Search button to show results according to filters
let searchResultsDiv = document.querySelector("#search-results");
let startSearchButton = document.querySelector("#start-human-search");

showFilteredResults();
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