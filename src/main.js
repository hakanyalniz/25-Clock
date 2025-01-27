import $ from "jquery";

let time;
let minutes;
let seconds;
let countdownInterval;
let runningState = false;

$(function () {
  // Start and stop button
  $("#start_stop").on("click", function () {
    // This will allow us to turn on or off the clock
    runningState = !runningState; // Toggle between true and false

    // Get the number from the div and convert it to minutes and seconds
    // So, #time-left might contain 25:30
    time = $("#time-left").text().split(":"); // ["25", "30"]
    minutes = parseInt(time[0], 10); // 25 minutes
    seconds = parseInt(time[1], 10); // 30 seconds

    // If the number is a valid number and greater than 0
    if (
      runningState &&
      !isNaN(minutes) &&
      !isNaN(seconds) &&
      minutes >= 0 &&
      seconds >= 0
    ) {
      // Create a countdown using setInterval, it is set up with variable so we can stop it later on
      countdownInterval = setInterval(function () {
        // Decrease the seconds by 1
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          // If seconds reach 0 and minutes > 0, decrease minutes by 1 and reset seconds to 59
          minutes--;
          seconds = 59;
        }

        // Update the div with the new time
        $("#time-left").text(
          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
          )}`
        );

        // When time is up, stop the interval
        if (minutes === 0 && seconds === 0) {
          clearInterval(countdownInterval);
          $("#countdown").text("Time's up!");
        }
      }, 1000); // 1000ms = 1 second
    } else {
      // If runningState is false (pause), clear the interval
      clearInterval(countdownInterval);
    }
  });

  // Reset button, set all values to default and stop countdown
  $("#reset").on("click", function () {
    $("#break-length").text("5");
    $("#session-length").text("25");
    $("#time-left").text("25:00");
    clearInterval(countdownInterval);
  });

  // Increment and decrement buttons

  // Break buttons
  $("#break-increment").on("click", function () {});
  $("#break-increment").on("click", function () {});

  // Session buttons
  $("#session-increment").on("click", function () {
    let sessionLengthNumber = $("#session-length").text();
    sessionLengthNumber++;
    $("#session-length").text(sessionLengthNumber);

    minutes += 1;
    seconds = 0;
  });

  $("#session-decrement").on("click", function () {
    let sessionLengthNumber = $("#session-length").text();
    sessionLengthNumber--;
    $("#session-length").text(sessionLengthNumber);
  });
});
