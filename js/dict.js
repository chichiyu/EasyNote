var go = document.getElementById('go');
var search1 = document.getElementById('search1');
var definition = document.getElementById('definition');
var synonyms = document.getElementById('synonyms');

function getDef(word) {
    fetch("https://wordsapiv1.p.rapidapi.com/words/" + word + "/definitions", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": config.RAPID_API_HOST,
            "x-rapidapi-key": config.RAPID_API_KEY
        }
    }).then(response => response.json()).then(text => {
        definition.innerHTML = "<i>Definition: </i>" + text['definitions'][0]['definition']
        saveword(word, text['definitions'][0]['definition'])
    }).catch(err => {
        console.log(err);
    });
}

function getSynonyms(word) {
    fetch("https://wordsapiv1.p.rapidapi.com/words/" + word + "/synonyms", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": config.RAPID_API_HOST,
            "x-rapidapi-key": config.RAPID_API_KEY
        }
    }).then(response => response.json()).then(text => {
        synArray = text['synonyms']
        if (synArray.length > 3) synArray = synArray.slice(0, 3)
        synonyms.innerHTML = '<i>Synonyms: </i>'
        for (let i = 0; i < synArray.length; i++) {
            synonyms.innerHTML += synArray[i];
            if (i !== synArray.length-1) synonyms.innerHTML += ", "
        }
        search1.value = ''
    }).catch(err => {
        console.log(err);
    });
}

go.onclick = async function () {
    getDef(search1.value.toLowerCase())
    getSynonyms(search1.value.toLowerCase())
}
