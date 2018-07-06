var prevButton;
var prevText;

document.addEventListener("click", function(){
    var selection = window.getSelection();
    var text = selection.toString();
    console.log(text);
    
    // if a text is selected
    if (text.length > 0 && prevText !== text) {
        // remove the previous button
        if (prevButton) prevButton.parentElement.removeChild(prevButton);

        var node = selection.focusNode;
        console.log(node.nodeValue);

        // create new button
        var button = document.createElement("button");
        var buttonText = document.createTextNode("click me!");
        button.appendChild(buttonText);

        node.parentElement.appendChild(button);
        prevButton = button;
        prevText = text;

        // if the button is pressed, store the word
        button.onclick = function() {
            // store in the format -- date: word
            var obj = {};
            var key = getDate();

            // check if key exists
            chrome.storage.sync.get(key, function(item) {
                if (Object.keys(item).length === 0) {
                    obj[key] = [text];
                } else {
                    item[key].push(text);
                    obj[key] = item[key];
                }
                
                chrome.storage.sync.set(obj, function() {
                    console.log('You saved a word: ' + text + '!');
                })
            })

            // remove the button
            button.innerHTML = "Saved!";
            setTimeout(function(){button.parentElement.removeChild(button)}, 2000);
        }
    }
})

// get today's month and date
function getDate() {
    var date = new Date();
    return date.getMonth() + 1 + "/" + date.getDate();
}