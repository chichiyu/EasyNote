var navigation = document.getElementById('navigation');
var calendarTab = document.getElementById('calendarTab');
var listTab = document.getElementById('listTab');
var flexbox = document.getElementById('flexbox');
var calendar = document.getElementById('calendar');
var heading = document.getElementById('heading');
var dates = document.getElementById('dates');
var outputHeader = document.getElementById('outputHeader');
var wordListTitle = document.getElementById('wordListTitle');
var wordList = document.getElementById('wordList');
var listView = document.getElementById('listView');

// get today's information
var today = new Date();
var todayYear = today.getFullYear();
var todayMonth = today.getMonth();
var todayDate = today.getDate();

// define some constants
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["S", "M", "T", "W", "T", "F", "S"];
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var byDate; // keeps track of what words have been stored by each day
var byWord; // keeps track of all words stored

calendarTab.onclick = function() {makeCurrent("calendar")};
listTab.onclick = function() {makeCurrent("list")};

chrome.storage.sync.get(null, function(results){
    byDate = results["byDate"] ? results["byDate"] : {};
    byWord = results["byWord"] ? results["byWord"] : [];
    makeCalendar(todayYear, todayMonth);
    displayByDate(todayYear, todayMonth, todayDate);
    displayByWord();
    makeCurrent("calendar");
})


// find how many empty space should be before the first date
function makeCalendar(year, month) {
    // clear the old calendar
    while (heading.lastChild) {
        heading.removeChild(heading.lastChild);
    }

    while (dates.lastChild) {
        dates.removeChild(dates.lastChild);
    }

    // add a heading to the calendar
    var previousDiv = document.createElement("div");
    var previousText = document.createTextNode("\u276e");
    previousDiv.appendChild(previousText);
    previousDiv.classList.add("side");
    previousDiv.onclick = function() {
        month > 0 ? makeCalendar(year, month - 1) : makeCalendar(year - 1, 11);
    }

    var monthDiv = document.createElement("div");
    var monthText = document.createTextNode(year + " " + months[month]);
    monthDiv.appendChild(monthText);
    monthDiv.classList.add("center");

    var nextDiv = document.createElement("div");
    var nextText = document.createTextNode("\u276f");
    nextDiv.appendChild(nextText);
    nextDiv.classList.add("side");
    if (year === todayYear && month === todayMonth) {
        nextDiv.classList.add("lastPage")
    } else {
        nextDiv.onclick = function() {
            month < 11 ? makeCalendar(year, month + 1) : makeCalendar(year + 1, 0);
        }
    }

    heading.appendChild(previousDiv);
    heading.appendChild(monthDiv);
    heading.appendChild(nextDiv);

    // check if it is a leap year
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) daysInMonth[1] = 29;
    else daysInMonth[1] = 28;

    var firstDay = new Date(year, month);
    var day = firstDay.getDay();

    for (var i = 0; i < 7; i++) {
        addText(days[i]);
    }

    for (var i = 0; i < day; i++) {
        addText("");
    }

    for (var i = 1; i <= daysInMonth[month]; i++) {
        addDate(year, month, i);
    }
}

// add the weekdays and empty spaces
function addText(input) {
    var newDiv = document.createElement("div");
    var text = document.createTextNode(input);
    newDiv.appendChild(text);
    newDiv.classList.add("day");
    dates.appendChild(newDiv);
}

// add the date to the calendar
function addDate(year, month, date) {  
    var hasWord = byDate[year] ? byDate[year][month] ? byDate[year][month][date]
        ? byDate[year][month][date].length > 0 : false : false : false;
    // console.log(words);
    console.log(hasWord);
    var newDiv = document.createElement("div");
    var text = document.createTextNode(date);
    newDiv.appendChild(text);
    newDiv.classList.add("day");

    if (year === todayYear && month === todayMonth && date === todayDate) 
        newDiv.classList.add("today");
    if (hasWord) {
        newDiv.classList.add("hasWord")
        newDiv.onclick = function() {displayByDate(year, month, date)}
    };

    dates.appendChild(newDiv);
}

function displayByDate(year, month, date) {    
    // clear the previous words
    while (outputHeader.lastChild) {
        outputHeader.removeChild(outputHeader.lastChild);
    }

    while (wordList.lastChild) {
        wordList.removeChild(wordList.lastChild);
    }

    // add a header for the current page
    var previousDiv = document.createElement("div");
    var previousText = document.createTextNode("\u276e");
    previousDiv.appendChild(previousText);
    previousDiv.classList.add("button");
    previousDiv.onclick = function() {
        date > 1 ? displayByDate(year, month, date - 1) : 
        month > 0 ? displayByDate(year, month - 1, daysInMonth[month - 1]) :
        displayByDate(year - 1, 11, 31);
    }

    var dateDiv = document.createElement("div");
    var monthText = document.createTextNode(printDate(year, month, date));
    dateDiv.appendChild(monthText);
    dateDiv.classList.add("date");

    var nextDiv = document.createElement("div");
    var nextText = document.createTextNode("\u276f");
    nextDiv.appendChild(nextText);
    nextDiv.classList.add("button");
    if (year === todayYear && month === todayMonth && date === todayDate) {
        nextDiv.classList.add("lastPage")
    } else {
        nextDiv.onclick = function() {
            date < daysInMonth[month] ? displayByDate(year, month, date + 1) : 
            month < 11 ? displayByDate(year, month + 1, 1) :
            displayByDate(year + 1, 0, 1);
        }
    }
    
    outputHeader.appendChild(previousDiv);
    outputHeader.appendChild(dateDiv);
    outputHeader.appendChild(nextDiv);

    var wordArr = byDate[year] ? byDate[year][month] ? byDate[year][month][date]
    ? byDate[year][month][date] : null : null : null;

    if (wordArr === null || wordArr.length === 0) {
        wordListTitle.innerHTML = "You didn't save any words on this day!"
        wordListTitle.classList.remove("yesWord");
        wordListTitle.classList.add("noWord");
    } else {
        wordListTitle.innerHTML = "Your saved words for the day:";
        wordListTitle.classList.remove("noWord");
        wordListTitle.classList.add("yesWord");

        for (var word of wordArr) {
            var newWord = document.createElement("li");
            newWord.classList.add("word");
            var newText = document.createTextNode(word);
            newWord.appendChild(newText);
            wordList.appendChild(newWord);
        }
    }
}

function displayByWord() {
    if (byWord.length === 0) {
        var noWord = document.createElement("li");
        noWord.classList.add("noWord");
        var newText = document.createTextNode("You didn't save any words!");
        noWord.appendChild(newText);
        listView.appendChild(noWord);
    } else {
        for (word of byWord) {
            var newWord = document.createElement("li");
            newWord.classList.add("word");
            var newText = document.createTextNode(word);
            newWord.appendChild(newText);
            listView.appendChild(newWord);
        }
    }
}
// print the date in the format yyyy/mm/dd
function printDate(year, month, date) {
    month++;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    return year + "/" + month + "/" + date;
}

function makeCurrent(tab) {
    if (tab === "calendar") {
        calendarTab.classList.add("current");
        listTab.classList.remove("current");
        flexbox.style.display = "flex";
        wordListTitle.style.display = "block";
        wordList.style.display = "block";
        listView.style.display = "none";
    } else {
        calendarTab.classList.remove("current");
        listTab.classList.add("current");
        flexbox.style.display = "none";
        wordListTitle.style.display = "none";
        wordList.style.display = "none";
        listView.style.display = "block";
    }
}