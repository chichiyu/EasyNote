function saveword(text, def) {
    // store in the format -- {year: {month: {date: word}}}
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var date = today.getDate();

    chrome.storage.sync.get(null, function(item) {
        if (item["byWord"] && indexOf(item["byWord"], text) > -1) {
            var obj = item["byWord"][indexOf(item["byWord"], text)]
            var msg = "You've already saved '" + text + "' on " + obj.year + "/" + (obj.month + 1) + "/" + obj.date + "!"
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
                arr.push({text: text, def: def});
                arr.sort((a, b) => (a.text < b.text) ? -1 : 1);
                item["byDate"][year][month][date] = arr;
            }

            if (!item["byWord"]) {
                item["byWord"] = [];
            }

            item["byWord"].push({text: text, def: def, year: year, month: month, date: date});
            item["byWord"].sort(function(a, b) {return (a.text < b.text) ? -1 : 1});

            chrome.storage.sync.set(item, function() {
                console.log("Added | " + text + ": "  + def)
            })
        }
    })
}