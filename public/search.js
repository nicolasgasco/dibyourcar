// Add list of options to select fetching data from API
function addOptionsToSelectFromDBQuery(APIRoute, targetParent) {
    
    fetch(APIRoute)
    .then(response => response.json())
    .then(data => {

        elementList = "";

        for ( let element of data.results.sort() ) {
            elementList +=
            `
            <option value=${element.toLowerCase()}>${element.charAt(0).toUpperCase() + element.substring(1)}</option>
            `
        };

        targetParent.innerHTML = elementList;
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}


function updateCitySelection() {
    const countrySelectorValue = countrySelector.value.charAt(0).toUpperCase() + countrySelector.value.substring(1);

    // City selector changes according to country selector
    addOptionsToSelectFromDBQuery(`/API/locations/cities/${countrySelectorValue}`, citySelector);
}


function createCountryCitySelector() {
    
    // Populate country selection first
    fetch("API/locations/countries")
    .then(response => response.json())
    .then(data => {

        elementList = "";

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


        fetch(`/API/locations/cities/${firstCountryInList}`)
        .then(response => response.json())
        .then(data => {

            elementList = "";

            for ( let element of data.results.sort() ) {
                elementList +=
                `
                <option value=${element.toLowerCase()}>${element.charAt(0).toUpperCase() + element.substring(1)}</option>
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


// Country selector is created first, city selector shows the cities available for the selected country
const countrySelector = document.querySelector("#country-selection-humans");
const citySelector = document.querySelector("#city-selection-humans");
createCountryCitySelector();





















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