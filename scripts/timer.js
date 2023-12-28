//Get the main div
let div = document.getElementsByTagName("div")[0];

//Get the HTML elements for displaying the time and team name
let timer = document.getElementById("timer");
let team = document.getElementById("team");

//Get the buttons so the text can be changed
let teamNamesButton = document.getElementById("teamNamesButton")
let timerButton = document.getElementById("timerButton")

//set the default states. these states are used to keep track of what should be displayed
let teamNamesState = "on"
let timerState = "traditional"

//set the date and time that the countdown is counting to. the original declaration value is kickoff 2023, the commented overrides are for testing
let date = Date.UTC(2024, 0, 6, 17);
// date = new Date().getTime() + 1000 * 60 * 60 + 1000 * 10 // 1 hour and 10 seconds from page load
// date = new Date().getTime() + 1000 * 60 + 1000 * 10 // 1 minute and 10 seconds from page load
// date = new Date().getTime() + 1000 * 60 + 1000 * 10 // 1 minute and 10 seconds from page load
// date = new Date().getTime() + 1000 * 10 // 10 seconds from page load
// date = new Date().getTime() - 1000 // 1 second before page load

let nicknames = {}
// Loads the team names from the /nicknames/nicknames.json file
async function loadNicknames() {
  let path = "./nicknames/nicknames.json"
  return fetch(path).then((res) => {return res.json();});
}

//runs when the team names button is pressed. Switches the state, changes the button text, clears or loads nicknames, and hides or shows the team name field
function teamNamesFunc() {
  if (teamNamesState == "on") {
    teamNamesState = "off"
    teamNamesButton.innerHTML = "Team Names On"
    teamNamesButton.classList = ["off"]

    team.style.display = "none";
  } else {
    teamNamesState = "on"
    teamNamesButton.innerHTML = "Team Names Off"
    teamNamesButton.classList = ["on"]

    team.style.display = "";
  }
}

//runs when the timer mode button is pressed. Switches the state and changes the button text
function timerFunc() {
  if (timerState == "traditional") {
    timerState = "seconds"
    timerButton.innerHTML = "Traditional Timer"
    timerButton.classList = ["off"]
  } else {
    timerState = "traditional"
    timerButton.innerHTML = "Total Seconds"
    timerButton.classList = ["on"]
  }
  update();
}


//converts from milliseconds to different units of time
function toSeconds(milisec) {
  let sec = Math.floor(milisec / 1000);
  return sec % 60;
}

function toMinutes(milisec) {
  let min = Math.floor(milisec / (60 * 1000));
  return min % 60;
}

function toHours(milisec) {
  let hour = milisec / (60 * 60 * 1000)
  return Math.floor(hour % 24)
}

function toDays(milisec) {
  let day = milisec / (24 * 60 * 60 * 1000)
  return Math.floor(day)
}


//formats time in milliseconds to a traditional timer or total seconds based on "format", which can either be "traditional" or "seconds"
function formatTime(milisec, format) {

  let time = 0;

  switch (format) {
    case "traditional":
      let sec = toSeconds(milisec);
      let min = toMinutes(milisec);
      let hour = toHours(milisec);
      let day = toDays(milisec);
      time = sec + 100 * min + 10000 * hour + 1000000 * day;
      break;
    case "seconds":
      time = Math.floor(milisec / 1000);
      break;
  }

  if (time <= 0) {
    time = 0
  }

  let digits = time.toString().split("");
  while (digits.length < 4) {
    digits.splice(0, 0, "0")
  }

  let sizes = ['0', '1', '2', '3', '2', '3', '4', '5'];
  let colors = ['', '', '', '', 'darkgreen', 'darkgreen', 'darkgreen', 'darkgreen'];

  let timeArr = new Array(digits.length)

  // <span class='size# color'>#</span>
  for (let i = 1; i <= digits.length; i++) {
    let digit = digits[digits.length - i];
    let classes = `size${sizes[sizes.length - i]} ${colors[colors.length - i]}`;

    timeArr[timeArr.length - i] = `<span class='${classes}'>${digit}</span>`
  }

  // <span class='size1'>:</span>
  if (format == "traditional") {

    let with_colons = []

    for (let i = 0; i < timeArr.length; i++) {
      with_colons.push(timeArr[i])

      if ((timeArr.length - i) % 2 == 1 && (timeArr.length - i) != 1) {
        with_colons.push("<span class='size1'>:</span>")
      }
    }

    return with_colons.join('')

  } else {
    return timeArr.join('')
  }
}

//gets the nickname of a team based on the milliseconds left and the format of the timer. this means that the data from the timer doesn't have to be parsed.
function getTeamName(milisec, format) {

  let team_number = "0"

  switch (format) {
    case "traditional":
      team_number = (toMinutes(milisec) * 100 + toSeconds(milisec)).toString();
      break;
    case "seconds":
      let sec = Math.floor(milisec / 1000);
      team_number = (sec % 10000).toString();
      break;
    default:
      return "incorrect format"
  }

  if (team_number in nicknames) {
    let team_nickname = nicknames[team_number]
    return `<span class='darkgreen'>${team_nickname}</span>`
  } else {
    return "<i>No Team</i>"
  }
}

//updates the current time, formats the remaining time in the countdown based on timerState and displays it, and if necessary gets the team nickname based on getTeamName and displays it
let now;
function update() {
  now = new Date().getTime();
  test = now % 1000
  if (test < 0) { console.log("skipped") };
  let dif = date - now + 1000;

  formattedTime = formatTime(dif, timerState)
  timer.innerHTML = formattedTime

  if (teamNamesState == "on") {
    if (dif > 999) {
      team.innerHTML = getTeamName(dif, timerState) //if the countdown isn't done, then display the team name
    } else {
      team.innerHTML = "Welcome to" + 
      "<span class='withmargin darkgreen size0'>C</span>" + 
      "<span class='darkgreen size1'>R</span>" + 
      "<span class='darkgreen size2'>E</span>" + 
      "<span class='darkgreen size3'>S</span>" + 
      "<span class='darkgreen size1'>C</span>" + 
      "<span class='darkgreen size2'>E</span>" + 
      "<span class='darkgreen size3'>N</span>" + 
      "<span class='darkgreen size4'>D</span>" + 
      "<span class='darkgreen size5'>O</span>" + 
      "!"; //if the countdown is done, then display "Welcome to CRESCENDO!"
    }
  }

  now = new Date().getTime();
  if (now < date + 1000) {
    // console.log(now, 1000 - now % 1000)
    setTimeout(() => { update() }, 1001 - now % 1000);
  }

}

async function start(){
  nicknames = await loadNicknames();
  update();
} 

start();