$(function() {

});

function startTimer(duration, display, callback) {

    var timer = setInterval(myTimer, 16),
        timerData = duration, seconds, milliseconds;


    function myTimer() {
        seconds = parseInt(timerData / 60, 10);
        milliseconds = parseInt(timerData % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;
        milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds;

        display.text(seconds + ":" + milliseconds);

        if (--timerData === 0) {
            callback();
            myStopFunction();
            display.text("00:00");
        }
    }

    function myStopFunction() {
        clearTimeout(timer);
    }
}