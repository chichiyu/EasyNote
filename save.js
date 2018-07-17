var prevButton;
var prevText;

document.addEventListener("click", function(){
    var selection = window.getSelection();
    var text = selection.toString().trim();
    console.log(text);
    
    // if a text is selected
    if (text.length > 0 && prevText !== text) {
        // remove the previous button
        if (prevButton) var parent = prevButton.parentElement;
        if (parent) parent.removeChild(prevButton);

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
            // store in the format -- {year: {month: {date: word}}}
            var today = new Date();
            var year = today.getFullYear();
            var month = today.getMonth();
            var date = today.getDate();

            chrome.storage.sync.get(null, function(item) {
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
                    if (arr.indexOf(text) === -1) {
                        arr.push(text);
                        arr.sort();
                    }
                    item["byDate"][year][month][date] = arr;
                }

                if (!item["byWord"]) {
                    item["byWord"] = [];
                    item["byWord"].push(text);
                } else if (item["byWord"].indexOf(text) === -1) {
                    item["byWord"].push(text);
                    item["byWord"].sort();
                }
                
                chrome.storage.sync.set(item, function() {
                    console.log(item);
                })
            })

            // remove the button
            button.innerHTML = "Saved!";
            setTimeout(function(){button.parentElement.removeChild(button)}, 2000);
        }
    }
})