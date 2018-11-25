function battleStart() {
    var show,
        $body = $('body');

    const showEnemyField = function() {
        $body.removeClass('placementShips').addClass('battle');
    };

    const init = function() {
        show = new showEnemyField();
    };


    return init();
}