var prevButton;
var prevText;

document.addEventListener("click", function(){
    var selection = window.getSelection();
    var text = selection.toString().toLowerCase().trim();
    console.log(text);
    
    // if a new text is selected
    if (text.length > 0 && prevText !== text) {
        // remove the previous button
        if (prevButton && prevButton.parentElement) 
            prevButton.parentElement.removeChild(prevButton);

        var node = selection.focusNode;
        console.log(node.nodeValue);

        // create new button
        var button = document.createElement("button");
        var buttonText = document.createTextNode("+");
        button.appendChild(buttonText);
        button.classList.add("addButton");

        node.parentElement.appendChild(button);
        prevButton = button;
        prevText = text;

        // if the button is pressed, store the word
        button.onclick = function() {
            // store in the format -- {year: {month: {date: word}}}
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth();
            var date = today.getDate();

            chrome.storage.sync.get(null, function(item) {
                if (item["byWord"] && item["byWord"].indexOf(text) > -1) {
                    alert("You've saved this word before!");
                } else {
                    if (!item["byDate"] || !item["byDate"][year]) {
                        var dateObj = {};
                        dateObj[date] = [text];
                        var monthObj = {};
                        monthObj[month] = dateObj;
                        item["byDate"] = {};
                        item["byDate"][year] = monthObj;
                    } else if (!item["byDate"][year][month]) {
                        var dateObj = {};
                        dateObj[date] = [text];
                        item["byDate"][year][month] = dateObj;
                    } else if (!item["byDate"][year][month][date]) {
                        item["byDate"][year][month][date] = [text];
                    } else {
                        var arr = item["byDate"][year][month][date];
                        arr.push(text);
                        arr.sort();
                        item["byDate"][year][month][date] = arr;
                    }

                    if (!item["byWord"]) {
                        item["byWord"] = [];
                    }
                    item["byWord"].push(text);
                    item["byWord"].sort();
                                    
                    chrome.storage.sync.set(item, function() {
                        // add a check button to indicate saved
                        var newButton = document.createElement("button");
                        var newButtonText = document.createTextNode("\u2714")
                        newButton.appendChild(newButtonText);
                        newButton.classList.add("checkButton");
                        node.parentElement.appendChild(newButton);
                        setTimeout(function(){newButton.parentElement.removeChild(newButton)}, 2000);
                    })
                }
            })
        }
    } else {
        // if no text is selected, remove previous button
        if (prevButton && prevButton.parentElement)
            prevButton.parentElement.removeChild(prevButton)
    }
})