chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("output").innerHTML = selection[0];
    
    var date = new Date();
    var obj = {};
    obj[date] = selection[0];

    chrome.storage.sync.set(obj, function() {
        chrome.extension.getBackgroundPage().console.log('You saved a word: ' + selection[0] + '!');
    })
});

