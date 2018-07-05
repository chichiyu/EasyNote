var clear = document.getElementById("clear");

clear.onclick = function () {
    chrome.storage.sync.clear(function(){
        chrome.extension.getBackgroundPage().console.log("Storage cleared");
    })
}