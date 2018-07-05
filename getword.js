var output = document.getElementById("output");
var b1 = document.getElementById("b1");

b1.onclick = function() {
    // chrome.extension.getBackgroundPage().console.log("PRESSED");
    chrome.storage.sync.get(null, function(results){
        var text = "";
        for (var date in results) {
            text = text + date + ": " + results[date] + "<br>"
        }
        output.innerHTML = text;
        // chrome.extension.getBackgroundPage().console.log("GOT");
    })
}