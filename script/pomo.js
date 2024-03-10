timer_time_in_seconds = 0 //global timer tracker

function timerStart() { //Start the timer
    startTime = new Date();
    var timeRemaining = document.getElementById("timer").value; //Get the value the user has input
    timeRemainingArray = timeRemaining.split(":");
    mins = timeRemainingArray[0];
    secs = timeRemainingArray[1];
    timer_time_in_seconds = parseInt(secs) + (parseInt(mins) * 60);

    if (timer_time_in_seconds > 3600 || !timer_time_in_seconds || timer_time_in_seconds <= 0) { //If there are issues just make it 60 mins
        timer_time_in_seconds = 3600;
    }
    
    timerInterval = setInterval(updateTimerDisplay, 1000, timer_time_in_seconds); // update display every second
}

function timerPause() { //Stops/pauses the timer.
    clearTimeout(timerEnd);
    clearTimeout(timerInterval);
    console.log("timer stopped!");
}

function timeIsUp() { //Timer ends
    console.log("timer done!");
    timerPause();
}

function setTimeLeft(diff) { //Subtracts the diff from the timer's time. Run every second. Also tracks timerEnd.
    timer_time_in_seconds -= diff; // Subtract the difference from the remaining time
    timerEnd = setTimeout(timeIsUp, timer_time_in_seconds * 1000);
}

function updateTimerDisplay() { //Update the timer display
    setTimeLeft(1); // Subtract 1 second in each update
    seconds = timer_time_in_seconds % 60;
    mins = Math.floor(timer_time_in_seconds / 60); // integer division
    document.getElementById("timer").value = mins + ":" + seconds;
}