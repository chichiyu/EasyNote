var prevButton;
var prevText;

document.addEventListener("click", function(){
    var selection = window.getSelection();
    var text = selection.toString();
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
                if (!item[year]) {
                    var dateObj = {};
                    dateObj[date] = [text];
                    var monthObj = {};
                    monthObj[month] = dateObj;
                    item[year] = monthObj;
                } else if (!item[year][month]) {
                    var dateObj = {};
                    dateObj[date] = [text];
                    item[year][month] = dateObj;
                } else if (!item[year][month][date]) {
                    item[year][month][date] = [text];
                } else {
                    var arr = item[year][month][date];
                    arr.push(text);
                    arr.sort();
                    item[year][month][date] = arr;
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