$(function () {
    const $body = $('body');

    var initGame;

    const copyLink = function(e) {
        var link = $(e.currentTarget).text();
        navigator.clipboard.writeText('Сыграй со мной в SPACE BATTLE! Вот ссылка: ' + link);

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
    };

    const init = function() {
        initGame = new initStartScreen();

        $body.on('click', '#game-link', copyLink);
        $body.on('click', '#toPlacementShips', toPlacementShips);
    };

    return init();
});