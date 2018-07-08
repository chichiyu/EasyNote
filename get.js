var output = document.getElementById("output");
var get = document.getElementById("get");

get.onclick = function() {
    chrome.storage.sync.get(null, function(results){
        var text = "";
        for (var date in results) {
            chrome.extension.getBackgroundPage().console.log(date);
            text += date + ":<br>";
            for (var word of results[date]) {
                text = text + word + "<br>"
            }
        }
        output.innerHTML = text;
        chrome.extension.getBackgroundPage().console.log("GOT");
    })
}