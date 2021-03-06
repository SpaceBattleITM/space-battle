$(function () {
    const $body = $('body');

    var initGame;

    new ClipboardJS('#game-link');

    const copyLink = function(e) {
        $(e.currentTarget).addClass('done');

        setTimeout(function() {
            $(e.currentTarget).removeClass('done');
        }, 3000);
    };

    const initStartScreen = function() {
        $('.start-screen').addClass('active');
    };

    const toPlacementShips = function() {
        $('.start-screen').removeClass('active');
        $body.addClass('placementShips');
        placementShipsScreen();
    };

    const init = function() {
        initGame = new initStartScreen();

        $body.on('click', '#game-link', copyLink);

        socket.on('goToPlacementShips', function () {
            toPlacementShips();
        }.bind(this));
    };

    return init();
});