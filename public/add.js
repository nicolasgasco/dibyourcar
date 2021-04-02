function capitalizeFirstLetterEveryWord(myString) {
    myString = myString.split(" ").map( el => el.charAt(0).toUpperCase() + el.substring(1).toLowerCase() );

    return myString.join(" ").trim();
}

function capitalizeFirstCharLeaveRestSame(myString) {
    myString = myString.trim();
    let result = myString.charAt(0).toUpperCase() + myString.substring(1);
    return result;
}

function sendNewStoryToDB(event) {
    event.preventDefault();

    let newStory = {    };

    // Necessary to build the object
    let fromArr = [];
    let currentArr = [];
    let interview = [];
    let contact = [];

    for ( let inputField of newStoryForm.children ) {
        if ( inputField.tagName !== "LABEL" && inputField.tagName !== "P" ) {

            console.log(inputField.name)

            // Data validation
            let validatedData;
            if ( inputField.value ) {
                

                if ( inputField.name === "gender" ) {
                    validatedData = inputField.value.toLowerCase();
                } else if ( inputField.name === "spot" || inputField.type === "textarea" ) {
                    validatedData = capitalizeFirstCharLeaveRestSame(inputField.value);
                } else if ( inputField.type === "text" ) {
                    validatedData =  capitalizeFirstLetterEveryWord(inputField.value); 
                }

                let value = validatedData || inputField.value;



                switch ( inputField.name ) {
                    case "city-from":
                        fromArr.push({ "city": value });
                        break;
    
                    case "country-from":
                        fromArr.push({ "country": value });
                        break;
    
                    case "city":
                        currentArr.push({ "city": value });
                        break;
    
                    case "country":
                        currentArr.push({ "country": value });
                        break;
    
                    case "story":
                        interview.push({ "story": value });
                        break;
    
                    case "advice":
                        interview.push({ "advice": value });
                        break;
                    
                    
                    case "dream":
                        interview.push({ "dream": value });
                        break;
    
                    case "spot":
                        newStory["where_to_find"] = value;
                        break;
    
                    case "telephone":
                        contact.push({ "telephone_number": value });
                        break;
                    
                    case "email":
                        contact.push({ "email": value });
                        break;
    
                    default:
                        newStory[inputField.name] = value;
                        break;
                }
                
            }


        }
    }

    const shareConsent = document.querySelector(`input[name="share-consent"]:checked`).value;
    contact.push( { "share_contact": Boolean(shareConsent) } );


    newStory["submitDate"] = new Date();

    if ( fromArr.length > 0 ) {
        newStory["from"] = fromArr;
    } 

    if ( currentArr.length > 0 ) {
        newStory["currently_in"] = currentArr;
    } 

    if ( interview.length > 0 ) {
        newStory["interview"] = interview;
    } 

    newStory["contact"] = contact;
    ;

    console.log(newStory)
    
    fetch("api/humans", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newStory),
    })
    .then(response => response.json())
    .then( info => {

        console.log(info)


            
    })
    .catch((error) => {
        console.error("Error:", error);
    });
}









const newStoryForm = document.querySelector("#new-story-form");
const submitStoryButton = document.querySelector("#submit-new-story");
submitStoryButton.addEventListener("click", sendNewStoryToDB);