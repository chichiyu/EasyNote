var prevButton;
var prevText;

document.addEventListener("click", function(){
    var selection = window.getSelection();
    var text = selection.toString().toLowerCase().trim();
    
    // if a new text is selected
    if (text.length > 0 && prevText !== text) {
        // remove the previous button
        if (prevButton && prevButton.parentElement) 
            prevButton.parentElement.removeChild(prevButton);

        // pick the later node
        var node;
        var position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING)
            node = selection.focusNode;
        else
            node = selection.anchorNode;

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
                if (item["byWord"] && indexOf(item["byWord"], text) > -1) {
                    var obj = item["byWord"][indexOf(item["byWord"], text)]
                    var msg = "You've already saved this word on " + obj.year + "/" + (obj.month + 1) + "/" + obj.date + "!"
                    alert(msg);
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

                    item["byWord"].push({text: text, year: year, month: month, date: date});
                    item["byWord"].sort(function(a, b) {return (a.text < b.text) ? -1 : 1});

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

// binary search algorithm to see if a word is saved
function indexOf(arr, word) {
    var left = 0;
    var right = arr.length - 1;
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        if (arr[mid].text < word) left = mid + 1;
        else if (arr[mid].text > word) right = mid - 1;
        else return mid;
    }
    return -1;
}