var clear = document.getElementById("clear");

clear.onclick = function () {
    var r = confirm("Are you sure? Once you deleted your data, you cannot restore it.")
    if (r === true) chrome.storage.sync.clear(function(){
        chrome.extension.getBackgroundPage().console.log("Storage cleared");
    })
}