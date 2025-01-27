import $ from "jquery";

let time;
let minutes;
let seconds;
let countdownInterval;
let runningState = false;
let breakTime = true;

function startCountdown() {
  time = $("#time-left").text().split(":"); // ["25", "30"]
  minutes = parseInt(time[0], 10); // 25 minutes
  seconds = parseInt(time[1], 10); // 30 seconds

  countdownInterval = setInterval(function () {
    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0) {
      minutes--;
      seconds = 59;
    }

    // Update the div with the new time
    $("#time-left").text(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );

    // When time reaches 00:00, switch between session and break
    if (minutes === 0 && seconds === 0) {
      clearInterval(countdownInterval);

      // Play the audio when time is up
      $("#beep")[0].play();

      // This part caused a huge issue
      // The below area was setting to 00:00 and instantly running startCountdown(), as opposed to
      // the 1 second wait interval there is for other numbers
      // This caused issue with the test.
      // I was able to find the problem and fix it at the end.
      // The important thing I learned here is that if you are stumped by a problem, then writing down the supposed logic
      // and step by step rundown of your code in plain words, then following it along your code might just save a lot of time
      setTimeout(() => {
        if ($("#timer-label").text() === "Session") {
          // If it was a session, switch to break time
          breakTime = true;
          $("#timer-label").text("Break");

          $("#time-left").text(
            `${String($("#break-length").text()).padStart(2, "0")}:00`
          );
          startCountdown(); // Start the break timer
        } else {
          // If it was a break, switch to session time
          breakTime = false;
          $("#timer-label").text("Session");

          $("#time-left").text(
            `${String($("#session-length").text()).padStart(2, "0")}:00`
          );
          startCountdown(); // Start the session timer again
        }
      }, 1000);
    }
  }, 1000); // 1000ms = 1 second
}

// Toggle start/pause on button click
$("#start_stop").on("click", function () {
  runningState = !runningState; // Toggle between true and false

  if (runningState) {
    // Start countdown when the timer is not running
    startCountdown();
  } else {
    // Pause countdown by clearing the interval
    clearInterval(countdownInterval);
  }
});

// Reset button, set all values to default and stop countdown
$("#reset").on("click", function () {
  runningState = false;
  $("#break-length").text("5");
  $("#session-length").text("25");
  $("#time-left").text("25:00");
  clearInterval(countdownInterval);

  if ($("#timer-label").text() === "Break") {
    $("#timer-label").text("Session");
  }

  $("#beep")[0].pause(); // Pauses the audio
  $("#beep")[0].currentTime = 0; // Resets the audio to the beginning
});

// Increment and decrement buttons

// Break buttons
$("#break-increment").on("click", function () {
  let breakLengthNumber = $("#break-length").text();

  // If running state is true, don't execute the code
  // The greater than number makes sure that the numbers can't be set below 0
  // and greater than 60
  if (!runningState && breakLengthNumber > 1 && breakLengthNumber < 60) {
    breakLengthNumber++;
    $("#break-length").text(breakLengthNumber);
  } else if (breakLengthNumber == 1) {
    breakLengthNumber++;
    $("#break-length").text(breakLengthNumber);
  }
});
$("#break-decrement").on("click", function () {
  let breakLengthNumber = $("#break-length").text();

  // If running state is true, don't execute the code
  if (!runningState && breakLengthNumber > 1 && breakLengthNumber < 60) {
    breakLengthNumber--;
    $("#break-length").text(breakLengthNumber);
  }
});

// Session buttons
$("#session-increment").on("click", function () {
  let sessionLengthNumber = $("#session-length").text();

  if (!runningState && sessionLengthNumber > 1 && sessionLengthNumber < 60) {
    clearInterval(countdownInterval);

    sessionLengthNumber++;
    $("#session-length").text(sessionLengthNumber);

    time = $("#time-left").text().split(":"); // ["25", "30"]
    minutes = parseInt(time[0], 10); // 25 minutes
    seconds = parseInt(time[1], 10); // 30 seconds

    // Increase minute by the session number, while also resetting seconds
    minutes = sessionLengthNumber;
    seconds = 0;

    // Update the div with the new time
    $("#time-left").text(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
  }
});

$("#session-decrement").on("click", function () {
  let sessionLengthNumber = $("#session-length").text();

  if (!runningState && sessionLengthNumber > 1 && sessionLengthNumber < 60) {
    clearInterval(countdownInterval);

    sessionLengthNumber--;
    $("#session-length").text(sessionLengthNumber);

    time = $("#time-left").text().split(":"); // ["25", "30"]
    minutes = parseInt(time[0], 10); // 25 minutes
    seconds = parseInt(time[1], 10); // 30 seconds

    // Increase minute by the session number, while also resetting seconds
    minutes = sessionLengthNumber;
    seconds = 0;

    // Update the div with the new time
    $("#time-left").text(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
  }
});
