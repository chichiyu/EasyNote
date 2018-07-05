var save = document.getElementById("save");

save.onclick = function () {
    chrome.tabs.executeScript( {
        code: "window.getSelection().toString();"
    }, function(selection) {
        document.getElementById("output").innerHTML = selection[0];

        // store in the format -- date: word
        var obj = {};
        var key = getDate();

        // check if key exists
        chrome.storage.sync.get(key, function(item) {
            if (Object.keys(item).length === 0) {
                obj[key] = [selection[0]];
            } else {
                item[key].push(selection[0]);
                obj[key] = item[key];
            }
            
            chrome.storage.sync.set(obj, function() {
                chrome.extension.getBackgroundPage().console.log('You saved a word: ' + selection[0] + '!');
            })
        })
    });
}


// get today's month and date
function getDate() {
    var date = new Date();
    return date.getMonth() + 1 + "/" + date.getDate();
}